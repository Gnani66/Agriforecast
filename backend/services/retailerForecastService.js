const Forecast = require("../models/Forecast");
const InventoryItem = require("../models/InventoryItem");
const SalesRecord = require("../models/SalesRecord");

const retailerForecastMap = {
  Milk: { demand: "High", increase: "12%", trend: "Increasing", confidence: 85 },
  "Curd/Yogurt": { demand: "High", increase: "10%", trend: "Increasing", confidence: 82 },
  "Paneer/Cheese": { demand: "Medium", increase: "8%", trend: "Stable", confidence: 78 },
  Rice: { demand: "Medium", increase: "5%", trend: "Stable", confidence: 75 },
  Wheat: { demand: "Low", increase: "3%", trend: "Decreasing", confidence: 70 },
  Vegetables: { demand: "High", increase: "15%", trend: "Increasing", confidence: 80 },
  Fruits: { demand: "Medium", increase: "7%", trend: "Stable", confidence: 72 },
  Tomatoes: { demand: "High", increase: "18%", trend: "Increasing", confidence: 88 },
  Onions: { demand: "Medium", increase: "6%", trend: "Stable", confidence: 74 },
  Potatoes: { demand: "Medium", increase: "4%", trend: "Stable", confidence: 76 },
  Oils: { demand: "Low", increase: "2%", trend: "Stable", confidence: 68 },
  Spices: { demand: "Medium", increase: "5%", trend: "Increasing", confidence: 71 },
};

const defaultForecast = { demand: "Medium", increase: "5%", trend: "Stable", confidence: 70 };

const generateRetailForecast = (product) => {
  for (const [key, value] of Object.entries(retailerForecastMap)) {
    if (product.toLowerCase().includes(key.toLowerCase())) {
      return { ...value, product: key };
    }
  }
  return { ...defaultForecast, product };
};

const getDemandForecast = async (retailerId) => {
  const items = await InventoryItem.find({ retailerId });
  const sales = await SalesRecord.find({ retailerId }).sort({ date: -1 }).limit(100);

  const forecasts = items.map(item => {
    const forecast = generateRetailForecast(item.product);
    const recentSales = sales
      .filter(s => s.product.toLowerCase() === item.product.toLowerCase())
      .slice(0, 7);
    const avgDailySales = recentSales.length > 0
      ? recentSales.reduce((s, r) => s + (r.unitsSold || r.quantity || 0), 0) / recentSales.length
      : item.avgDaily || 0;

    const predictedDemand = Math.round(avgDailySales * (1 + parseInt(forecast.increase) / 100));

    return {
      product: item.product,
      category: item.category,
      currentStock: item.quantity,
      avgDailySales,
      predictedDemand,
      demand: forecast.demand,
      increase: forecast.increase,
      trend: forecast.trend,
      confidence: forecast.confidence,
      daysUntilOut: avgDailySales > 0 ? Math.round(item.quantity / avgDailySales) : null,
    };
  });

  const highDemand = forecasts.filter(f => f.demand === "High");
  const spikeAlerts = forecasts
    .filter(f => parseInt(f.increase) >= 10)
    .map(f => ({
      product: f.product,
      message: `${f.product} demand expected to increase by ${f.increase}.`,
    }));

  return {
    forecasts,
    summary: {
      totalProducts: forecasts.length,
      highDemandCount: highDemand.length,
      averageConfidence: Math.round(forecasts.reduce((s, f) => s + f.confidence, 0) / forecasts.length),
    },
    spikeAlerts,
    generatedAt: new Date(),
  };
};

const getProcurementRecommendations = async (retailerId) => {
  const items = await InventoryItem.find({ retailerId });
  const demandData = await getDemandForecast(retailerId);

  const recommendations = items.map(item => {
    const forecast = demandData.forecasts.find(f => f.product === item.product);
    const reorderPoint = item.minStock || 10;
    const isLow = item.quantity <= reorderPoint;
    const suggestedQty = forecast
      ? Math.max(forecast.predictedDemand * 7, item.maxStock * 0.5)
      : item.maxStock * 0.5;

    return {
      product: item.product,
      currentStock: item.quantity,
      minStock: item.minStock,
      maxStock: item.maxStock,
      reorderPoint,
      suggestedQuantity: Math.round(suggestedQty),
      avgDailySales: forecast?.avgDailySales || 0,
      urgency: item.quantity <= reorderPoint * 0.5 ? "high" : item.quantity <= reorderPoint ? "medium" : "low",
      reason: item.quantity <= reorderPoint
        ? `Stock below reorder point (${reorderPoint})`
        : item.quantity > item.maxStock * 1.2
          ? `Overstock — reduce order`
          : `Stock level adequate`,
    };
  });

  return {
    recommendations,
    highPriority: recommendations.filter(r => r.urgency === "high"),
    generatedAt: new Date(),
  };
};

module.exports = { generateRetailForecast, getDemandForecast, getProcurementRecommendations };
