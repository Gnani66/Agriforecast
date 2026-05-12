const cron = require("node-cron");
const { setCache } = require("../services/redisClient");
const { getPriceTrend } = require("../services/marketService");
const MarketPrice = require("../models/MarketPrice");

const fetchMarketPrices = async () => {
  const crops = ["Tomato", "Onion", "Potato", "Rice", "Wheat", "Banana", "Mango", "Cauliflower", "Cabbage", "Brinjal"];
  const livePrices = [];

  for (const crop of crops) {
    const basePrice = 20 + Math.random() * 50;
    const modalPrice = Math.round(basePrice + (Math.random() * 10 - 5));
    const minPrice = Math.round(modalPrice * 0.8);
    const maxPrice = Math.round(modalPrice * 1.2);

    const priceData = {
      _id: `live_${crop}_${Date.now()}`,
      cropName: crop,
      variety: "General",
      state: "Maharashtra",
      district: "Pune",
      market: "Pune Mandi",
      minPrice,
      maxPrice,
      modalPrice,
      date: new Date(),
      source: "simulated"
    };

    const trendData = await getPriceTrend(crop, 7);
    const sevenDayAvg = trendData.average || modalPrice;

    let trend = "stable";
    if (modalPrice > sevenDayAvg * 1.05) trend = "up";
    else if (modalPrice < sevenDayAvg * 0.95) trend = "down";

    livePrices.push({ ...priceData, sevenDayAvg, trend });
  }

  await setCache("live_market_prices", livePrices, 7200);
};

const initCronJobs = () => {
  fetchMarketPrices();
  cron.schedule("0 * * * *", () => {
    fetchMarketPrices();
  });
};

module.exports = { initCronJobs };
