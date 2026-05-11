const Forecast = require("../models/Forecast");
const CropEntry = require("../models/CropEntry");
const MarketPrice = require("../models/MarketPrice");

const generateForecast = async (cropName) => {
  const mockForecasts = {
    Tomato: {
      demand: "High",
      increase: "18%",
      region: "Bangalore",
      priceTrend: "Increasing",
      confidence: 85,
      predictedValue: 85
    },
    Onion: {
      demand: "Medium",
      increase: "8%",
      region: "Mysore",
      priceTrend: "Stable",
      confidence: 72,
      predictedValue: 62
    },
    Potato: {
      demand: "High",
      increase: "12%",
      region: "Pune",
      priceTrend: "Increasing",
      confidence: 78,
      predictedValue: 75
    },
    Rice: {
      demand: "Medium",
      increase: "5%",
      region: "Nagpur",
      priceTrend: "Stable",
      confidence: 70,
      predictedValue: 55
    },
    Wheat: {
      demand: "Low",
      increase: "3%",
      region: "Delhi",
      priceTrend: "Decreasing",
      confidence: 65,
      predictedValue: 45
    }
  };

  return mockForecasts[cropName] || {
    demand: "Medium",
    increase: "10%",
    region: "Maharashtra",
    priceTrend: "Stable",
    confidence: 70,
    predictedValue: 60
  };
};

const generateDemandForecast = async (cropName) => {
  try {
    const existing = await Forecast.findOne({
      cropName,
      type: "demand",
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    if (existing) return existing;

    const mock = await generateForecast(cropName);

    const forecast = await Forecast.create({
      userId: null,
      userType: "farmer",
      type: "demand",
      cropName,
      predictedValue: mock.predictedValue,
      confidence: mock.confidence,
      period: "weekly",
      date: new Date(),
      details: mock
    });

    return forecast;
  } catch (error) {
    console.error("Demand forecast error:", error.message);
    return null;
  }
};

const generateRevenueForecast = async (userId, userType) => {
  const existing = await Forecast.findOne({ userId, type: "revenue", date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } });
  if (existing) return existing;

  const crops = await CropEntry.find({ farmerId: userId });
  const MarketPriceModel = require("../models/MarketPrice");

  let totalRevenue = 0;
  for (const crop of crops) {
    const price = await MarketPriceModel.findOne({ cropName: new RegExp(`^${crop.cropName}$`, "i") }).sort({ date: -1 });
    const modalPrice = price ? price.modalPrice : 40;
    totalRevenue += (crop.expectedYield || 0) * modalPrice;
  }

  if (totalRevenue === 0) totalRevenue = 85000;

  const forecast = await Forecast.create({
    userId, userType,
    type: "revenue",
    cropName: "all",
    predictedValue: totalRevenue,
    confidence: 75,
    period: "monthly",
    date: new Date()
  });
  return forecast;
};

const calculateDemandIndex = async (cropName) => {
  try {
    const recentPrices = await MarketPrice.find({ cropName })
      .sort({ date: -1 })
      .limit(10);

    if (recentPrices.length === 0) {
      return 50 + Math.round(Math.random() * 30);
    }

    const avgModal = recentPrices.reduce((s, p) => s + p.modalPrice, 0) / recentPrices.length;
    const latestModal = recentPrices[0].modalPrice;
    const trend = ((latestModal - avgModal) / avgModal) * 100;

    let demandIndex = 50 + Math.round(trend * 2);
    demandIndex = Math.max(0, Math.min(100, demandIndex));

    return demandIndex;
  } catch (error) {
    console.error("Demand index error:", error.message);
    return 60;
  }
};

module.exports = {
  generateForecast,
  generateDemandForecast,
  generateRevenueForecast,
  calculateDemandIndex
};
