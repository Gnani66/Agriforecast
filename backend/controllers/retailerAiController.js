const InventoryItem = require("../models/InventoryItem");
const SalesRecord = require("../models/SalesRecord");
const { getAIResponse } = require("../services/aiService");
const { analyzeWasteRisk } = require("../services/wasteService");
const { getDemandForecast, getProcurementRecommendations } = require("../services/retailerForecastService");

const getInsights = async (req, res) => {
  try {
    const retailerId = req.userId;
    const inventory = await InventoryItem.find({ retailerId });
    const sales = await SalesRecord.find({ retailerId }).sort({ date: -1 }).limit(50);
    const waste = await analyzeWasteRisk(retailerId);
    const forecast = await getDemandForecast(retailerId);

    const insights = [];

    const highDemand = forecast.forecasts.filter(f => f.demand === "High" || parseInt(f.increase) >= 10);
    if (highDemand.length > 0) {
      insights.push({
        type: "demand_spike",
        title: "Demand Spike Expected",
        description: `${highDemand[0].product} demand expected to rise by ${highDemand[0].increase} this week.`,
        severity: "high",
      });
    }

    const criticalWaste = waste.alerts.filter(w => w.riskLevel === "critical" || w.riskLevel === "high");
    if (criticalWaste.length > 0) {
      insights.push({
        type: "waste_risk",
        title: "Elevated Spoilage Risk",
        description: `${criticalWaste.length} product(s) show elevated spoilage risk. Review stock immediately.`,
        severity: criticalWaste.some(w => w.riskLevel === "critical") ? "high" : "medium",
      });
    }

    const lowStock = inventory.filter(i => i.status === "critical");
    if (lowStock.length > 0) {
      insights.push({
        type: "stock_shortage",
        title: "Stock Shortage Alert",
        description: `${lowStock.length} product(s) critically low. Reorder recommended.`,
        severity: "high",
      });
    }

    const overstock = inventory.filter(i => i.quantity > i.maxStock * 1.3);
    if (overstock.length > 0) {
      insights.push({
        type: "overstock",
        title: "Overstock Detected",
        description: `${overstock.length} product(s) exceed optimal stock levels. Reduce orders.`,
        severity: "medium",
      });
    }

    const fastSellers = forecast.forecasts
      .filter(f => f.demand === "High")
      .sort((a, b) => parseInt(b.increase) - parseInt(a.increase))
      .slice(0, 3);
    if (fastSellers.length > 0) {
      insights.push({
        type: "fast_moving",
        title: "Fast-Moving Products",
        description: `${fastSellers.map(f => f.product).join(", ")} are selling fastest. Ensure adequate stock.`,
        severity: "low",
      });
    }

    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    let contextData = {};
    if (req.userId) {
      const inventory = await InventoryItem.find({ retailerId: req.userId }).limit(20);
      const sales = await SalesRecord.find({ retailerId: req.userId }).sort({ date: -1 }).limit(10);
      contextData = { inventoryCount: inventory.length, recentSales: sales.length };
    }

    const prompt = `[Retail Context] ${JSON.stringify(contextData)}\n\nRetailer asks: ${message}`;
    const response = await getAIResponse(prompt);

    res.json({ success: true, data: { response, timestamp: new Date() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getInsights, chat };
