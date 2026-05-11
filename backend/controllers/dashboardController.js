const InventoryItem = require("../models/InventoryItem");
const SalesRecord = require("../models/SalesRecord");
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
    const todaySalesRecords = await SalesRecord.find({
      retailerId,
      date: { $gte: todayStart }
    });
    const todaySales = todaySalesRecords.reduce((s, r) => s + (r.revenue || r.totalAmount || 0), 0);

    const wasteData = await analyzeWasteRisk(retailerId);
    const spoilageRisk = wasteData.highRiskCount;

    const forecastData = await getDemandForecast(retailerId);
    const fastMoving = forecastData.forecasts.filter(f => f.demand === "High").length;
    const revenueProjection = forecastData.forecasts.reduce((s, f) => s + (f.predictedDemand * f.avgDailySales * 30), 0);

    const recentSales = await SalesRecord.find({ retailerId })
      .sort({ date: -1 })
      .limit(7);

    const inventoryAlerts = inventoryItems
      .filter(i => i.status === "critical" || i.status === "warning")
      .slice(0, 5);

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
        wasteAlerts: wasteData.alerts.slice(0, 5),
        demandForecast: forecastData.forecasts.slice(0, 10),
        procurement: await getProcurementRecommendations(retailerId),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };
