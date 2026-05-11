const InventoryItem = require("../models/InventoryItem");
const WasteRecord = require("../models/WasteRecord");
const ProcurementOrder = require("../models/ProcurementOrder");
const SalesRecord = require("../models/SalesRecord");
const Forecast = require("../models/Forecast");
const { generateDemandForecast } = require("../services/forecastService");
const { analyzeWasteRisk } = require("../services/wasteService");
const { getDemandForecast, getProcurementRecommendations } = require("../services/retailerForecastService");

const getDashboard = async (req, res) => {
  try {
    const retailerId = req.userId;

    const inventoryItems = await InventoryItem.find({ retailerId });
    const totalInventory = inventoryItems.length;
    const lowStockItems = inventoryItems.filter(i => i.status === "critical" || i.status === "warning").length;
    const totalStockValue = inventoryItems.reduce((s, i) => s + (i.quantity * (i.sellingPrice || i.price || 0)), 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaySalesRecords = await SalesRecord.find({ retailerId, date: { $gte: todayStart } });
    const todaySales = todaySalesRecords.reduce((s, r) => s + (r.revenue || r.totalAmount || 0), 0);

    const wasteData = await analyzeWasteRisk(retailerId);
    const spoilageRisk = wasteData.highRiskCount;

    const forecastData = await getDemandForecast(retailerId);
    const fastMoving = forecastData.forecasts.filter(f => f.demand === "High").length;
    const revenueProjection = forecastData.forecasts.reduce((s, f) => s + (f.predictedDemand * (f.avgDailySales || 1) * 30), 0);

    const recentSales = await SalesRecord.find({ retailerId }).sort({ date: -1 }).limit(7);
    const inventoryAlerts = inventoryItems.filter(i => i.status === "critical" || i.status === "warning").slice(0, 5);

    res.json({
      success: true,
      data: {
        totalInventory,
        lowStockItems,
        spoilageRisk,
        todaySales,
        fastMoving,
        revenueProjection: Math.round(revenueProjection),
        totalStockValue: Math.round(totalStockValue),
        recentSales,
        inventoryAlerts,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getInventory = async (req, res) => {
  try {
    const items = await InventoryItem.find({ retailerId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addInventory = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.productName && !body.product) body.product = body.productName;
    if (!body.product) return res.status(400).json({ success: false, message: "Product name is required" });
    const item = await InventoryItem.create({ ...body, retailerId: req.userId });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateInventory = async (req, res) => {
  try {
    const item = await InventoryItem.findOneAndUpdate(
      { _id: req.params.id, retailerId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Inventory item not found" });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWaste = async (req, res) => {
  try {
    const result = await analyzeWasteRisk(req.userId);
    res.json({ success: true, data: result.alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProcurement = async (req, res) => {
  try {
    const result = await getProcurementRecommendations(req.userId);
    res.json({ success: true, data: result.recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { retailerId: req.userId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const sales = await SalesRecord.find(filter).sort({ date: -1 });
    res.json({ success: true, data: sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getForecast = async (req, res) => {
  try {
    const result = await getDemandForecast(req.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getInventory,
  addInventory,
  updateInventory,
  getWaste,
  getProcurement,
  getSales,
  getForecast
};
