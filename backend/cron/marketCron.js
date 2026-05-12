const cron = require("node-cron");
const { setCache } = require("../services/redisClient");
const { getPriceTrend } = require("../services/marketService");
const MarketPrice = require("../models/MarketPrice");
const { getProphetForecast } = require("../services/mlForecastService");

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

    // Generate simulated history for Prophet ML
    const historyData = [];
    for (let i = 30; i > 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const noise = (Math.random() - 0.5) * (modalPrice * 0.3);
      historyData.push({
        date: d.toISOString().split('T')[0],
        value: Math.max(1, Math.round(modalPrice + noise))
      });
    }

    let mlPredictedPrice = modalPrice;
    let mlForecastData = [];
    try {
      mlForecastData = await getProphetForecast(historyData, 7);
      if (mlForecastData && mlForecastData.length > 0) {
        // Average the 7-day prediction
        const sumPred = mlForecastData.reduce((sum, f) => sum + f.prediction, 0);
        mlPredictedPrice = Math.max(1, Math.round(sumPred / mlForecastData.length));
      }
    } catch (err) {
      console.warn(`Prophet ML failed for crop ${crop}:`, err.message);
    }

    const trendData = await getPriceTrend(crop, 7);
    const historicalSevenDayAvg = trendData.average || modalPrice;
    
    // We now use ML Prediction for future trend
    const sevenDayAvg = mlPredictedPrice;

    let trend = "stable";
    if (mlPredictedPrice > modalPrice * 1.05) trend = "up";
    else if (mlPredictedPrice < modalPrice * 0.95) trend = "down";

    livePrices.push({ 
      ...priceData, 
      historicalAvg: historicalSevenDayAvg,
      sevenDayAvg: mlPredictedPrice, // Now represents ML Forecasted Avg
      trend,
      mlForecastData 
    });
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
