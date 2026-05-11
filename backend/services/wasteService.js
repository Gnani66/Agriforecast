const InventoryItem = require("../models/InventoryItem");
const SalesRecord = require("../models/SalesRecord");
const { getCurrentWeather } = require("./weatherService");

const analyzeWasteRisk = async (retailerId) => {
  const items = await InventoryItem.find({ retailerId });
  const sales = await SalesRecord.find({ retailerId }).sort({ date: -1 }).limit(50);

  const results = [];

  for (const item of items) {
    const salesVelocity = calculateSalesVelocity(item.product, sales);
    const daysToExpiry = item.expiryDate
      ? Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;

    let riskLevel = "low";
    let wasteProbability = 0;
    let expiryWarning = null;

    if (daysToExpiry !== null && daysToExpiry <= 2) {
      riskLevel = "critical";
      wasteProbability = 90;
      expiryWarning = `${item.product} may expire within ${daysToExpiry} day(s).`;
    } else if (daysToExpiry !== null && daysToExpiry <= 5) {
      riskLevel = "high";
      wasteProbability = 65;
      expiryWarning = `${item.product} expires in ${daysToExpiry} days.`;
    } else if (item.quantity > item.maxStock * 1.2) {
      riskLevel = "medium";
      wasteProbability = 40;
      expiryWarning = `${item.product} stock exceeds predicted demand.`;
    } else if (salesVelocity < item.avgDaily * 0.5 && item.quantity > item.minStock * 2) {
      riskLevel = "medium";
      wasteProbability = 30;
      expiryWarning = `Slow sales detected for ${item.product}.`;
    }

    if (riskLevel !== "low" || wasteProbability > 0) {
      results.push({
        productId: item._id,
        product: item.product,
        category: item.category,
        quantity: item.quantity,
        expiryDate: item.expiryDate,
        riskLevel,
        wasteProbability,
        expiryWarning,
        daysToExpiry,
        salesVelocity,
        recommendedAction: getRecommendedAction(riskLevel, item),
      });
    }
  }

  try {
    const weather = await getCurrentWeather();
    if (weather.humidity > 80 || weather.temp > 35) {
      results.forEach(r => {
        if (r.riskLevel !== "critical") {
          r.riskLevel = r.riskLevel === "low" ? "medium" : r.riskLevel;
          r.wasteProbability = Math.min(100, r.wasteProbability + 15);
          if (!r.expiryWarning) {
            r.expiryWarning = `High ${weather.temp > 35 ? "temperature" : "humidity"} may accelerate spoilage.`;
          }
        }
      });
    }
  } catch (e) {
  }

  results.sort((a, b) => b.wasteProbability - a.wasteProbability);

  return {
    totalItems: items.length,
    atRiskCount: results.length,
    highRiskCount: results.filter(r => r.riskLevel === "critical" || r.riskLevel === "high").length,
    alerts: results,
  };
};

const calculateSalesVelocity = (product, sales) => {
  const productSales = sales.filter(s => s.product.toLowerCase() === product.toLowerCase());
  if (productSales.length === 0) return 0;
  const total = productSales.reduce((s, r) => s + (r.unitsSold || r.quantity || 0), 0);
  return total / productSales.length;
};

const getRecommendedAction = (riskLevel, item) => {
  switch (riskLevel) {
    case "critical":
      return "Apply immediate discount or donate to reduce waste.";
    case "high":
      return "Run promotion or move to front-of-store for quick sale.";
    case "medium":
      return "Reduce next order quantity and monitor closely.";
    default:
      return "Continue regular monitoring.";
  }
};

module.exports = { analyzeWasteRisk };
