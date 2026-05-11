const MarketPrice = require("../models/MarketPrice");

const marketData = {
  Tomato: {
    region: "Bangalore",
    marketPrice: 45,
    demandScore: 85,
    supplyLevel: "Medium",
    seasonalTrend: "Increasing"
  },
  Onion: {
    region: "Mysore",
    marketPrice: 32,
    demandScore: 72,
    supplyLevel: "High",
    seasonalTrend: "Stable"
  },
  Potato: {
    region: "Pune",
    marketPrice: 22,
    demandScore: 78,
    supplyLevel: "Medium",
    seasonalTrend: "Increasing"
  },
  Rice: {
    region: "Nagpur",
    marketPrice: 38,
    demandScore: 65,
    supplyLevel: "High",
    seasonalTrend: "Stable"
  },
  Wheat: {
    region: "Delhi",
    marketPrice: 28,
    demandScore: 55,
    supplyLevel: "Low",
    seasonalTrend: "Decreasing"
  }
};

const getMarketPrices = async (cropName, region) => {
  try {
    const existing = await MarketPrice.findOne({
      cropName: new RegExp(`^${cropName}$`, "i"),
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    }).sort({ date: -1 });

    if (existing) return existing;

    const mock = marketData[cropName];
    if (mock) {
      const price = await MarketPrice.create({
        cropName,
        variety: "General",
        state: region || "Maharashtra",
        district: "Pune",
        market: "Pune Mandi",
        minPrice: Math.round(mock.marketPrice * 0.7),
        maxPrice: Math.round(mock.marketPrice * 1.3),
        modalPrice: mock.marketPrice,
        date: new Date(),
        source: "estimated"
      });
      return price;
    }

    const price = await MarketPrice.create({
      cropName,
      variety: "General",
      state: region || "Maharashtra",
      district: "Pune",
      market: "Pune Mandi",
      minPrice: 30 + Math.round(Math.random() * 20),
      maxPrice: 50 + Math.round(Math.random() * 30),
      modalPrice: 40 + Math.round(Math.random() * 15),
      date: new Date(),
      source: "estimated"
    });

    return price;
  } catch (error) {
    console.error("Market price error:", error.message);
    throw new Error("Failed to fetch market prices");
  }
};

const getPriceTrend = async (cropName, days = 30) => {
  try {
    const prices = await MarketPrice.find({
      cropName: new RegExp(`^${cropName}$`, "i")
    }).sort({ date: -1 }).limit(days);

    if (prices.length < 2) {
      return {
        trend: "stable",
        change: 0,
        average: prices.length > 0 ? prices[0].modalPrice : 0,
        data: prices
      };
    }

    const sorted = prices.sort((a, b) => a.date - b.date);
    const first = sorted[0].modalPrice;
    const last = sorted[sorted.length - 1].modalPrice;
    const change = last - first;
    const percentChange = first > 0 ? Math.round((change / first) * 100) : 0;
    const average = Math.round(sorted.reduce((s, p) => s + p.modalPrice, 0) / sorted.length);

    let trend = "stable";
    if (percentChange > 5) trend = "up";
    else if (percentChange < -5) trend = "down";

    return { trend, change: percentChange, average, data: sorted };
  } catch (error) {
    console.error("Price trend error:", error.message);
    return { trend: "stable", change: 0, average: 0, data: [] };
  }
};

module.exports = {
  getMarketPrices,
  getPriceTrend
};
