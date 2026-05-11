const CropEntry = require("../models/CropEntry");
const FarmerProfile = require("../models/FarmerProfile");
const Forecast = require("../models/Forecast");
const MarketPrice = require("../models/MarketPrice");
const { getCurrentWeather, analyzeFarmingRisks, getForecast: getWeatherForecast } = require("../services/weatherService");
const { generateDemandForecast, generateRevenueForecast, calculateDemandIndex } = require("../services/forecastService");
const { getMarketPrices, getPriceTrend } = require("../services/marketService");
const { predictHarvest } = require("../services/harvestPredictionService");

function computeWeatherRiskLevel(risks) {
  if (!risks || risks.length === 0) return "low";
  const severityOrder = { high: 3, medium: 2, low: 1 };
  const maxSeverity = risks.reduce((max, r) => Math.max(max, severityOrder[r.severity] || 0), 0);
  if (maxSeverity >= 3) return "high";
  if (maxSeverity >= 2) return "medium";
  return "low";
}

function computeWeatherRiskScore(risks) {
  if (!risks || risks.length === 0) return 0;
  const severityOrder = { high: 35, medium: 20, low: 5 };
  return Math.min(100, risks.reduce((sum, r) => sum + (severityOrder[r.severity] || 0), 0));
}

const getDashboard = async (req, res) => {
  try {
    const farmerId = req.userId;

    const crops = await CropEntry.find({ farmerId });
    const cropsCount = crops.length;
    const activeCrops = crops.filter(c => c.status === "Planted" || c.status === "Growing").length;
    const readyForHarvest = crops.filter(c => {
      if (!c.expectedHarvestDate) return false;
      const daysUntil = Math.ceil((new Date(c.expectedHarvestDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntil <= 7 && daysUntil >= -7;
    }).length;

    const recentCrops = await CropEntry.find({ farmerId })
      .sort({ updatedAt: -1 })
      .limit(5);

    const profile = await FarmerProfile.findOne({ farmerId });
    const city = profile ? profile.region || profile.district || "Pune" : "Pune";

    let weather = { temp: 28, feelsLike: 26, humidity: 65, wind: 12, condition: "clear sky", rainfall: 0, city };
    try {
      weather = await getCurrentWeather(city);
    } catch (e) {

    }

    const weatherRisk = analyzeFarmingRisks(weather);

    let forecastedRevenue = 0;
    const revForecast = await Forecast.findOne({
      userId: farmerId,
      type: "revenue",
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    if (revForecast) {
      forecastedRevenue = revForecast.predictedValue;
    } else {
      const generated = await generateRevenueForecast(farmerId, "farmer");
      if (generated) forecastedRevenue = generated.predictedValue;
    }

    let demandIndex = 50;
    if (crops.length > 0) {
      demandIndex = await calculateDemandIndex(crops[0].cropName);
    }

    const upcomingHarvests = crops
      .filter(c => c.status === "Planted" || c.status === "Growing")
      .sort((a, b) => new Date(a.expectedHarvestDate) - new Date(b.expectedHarvestDate))
      .slice(0, 5);

    const cropNames = [...new Set(crops.map(c => c.cropName))];
    const marketPrices = [];
    for (const name of cropNames) {
      try {
        const price = await getMarketPrices(name, "Maharashtra");
        marketPrices.push(typeof price.toObject === 'function' ? price.toObject() : price);
      } catch (e) {
      }
    }

    res.json({
      success: true,
      data: {
        cropPlansCount: cropsCount,
        activeCrops,
        readyForHarvest,
        forecastedRevenue,
        demandIndex,
        weatherRisk: computeWeatherRiskScore(weatherRisk),
        weatherRiskLevel: computeWeatherRiskLevel(weatherRisk),
        recentCrops,
        upcomingHarvests,
        marketPrices
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    let profile = await FarmerProfile.findOne({ farmerId: req.userId });
    if (!profile) {
      profile = await FarmerProfile.create({ farmerId: req.userId });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await FarmerProfile.findOneAndUpdate(
      { farmerId: req.userId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCrops = async (req, res) => {
  try {
    const crops = await CropEntry.find({ farmerId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCrop = async (req, res) => {
  try {
    const crop = await CropEntry.create({ ...req.body, farmerId: req.userId });
    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCrop = async (req, res) => {
  try {
    const crop = await CropEntry.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!crop) return res.status(404).json({ success: false, message: "Crop not found" });
    res.json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCrop = async (req, res) => {
  try {
    const crop = await CropEntry.findOneAndDelete({ _id: req.params.id, farmerId: req.userId });
    if (!crop) return res.status(404).json({ success: false, message: "Crop not found" });
    res.json({ success: true, message: "Crop deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getForecast = async (req, res) => {
  try {
    const crops = await CropEntry.find({ farmerId: req.userId }).select("cropName");
    const cropNames = [...new Set(crops.map(c => c.cropName))];

    const recentForecasts = await Forecast.find({
      userId: req.userId,
      type: "demand",
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (recentForecasts.length === 0 && cropNames.length > 0) {
      for (const name of cropNames) {
        await generateDemandForecast(name);
      }
    }

    const forecasts = await Forecast.find({
      userId: req.userId,
      type: { $in: ["demand", "revenue"] }
    }).sort({ date: -1 });

    res.json({ success: true, data: forecasts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMarket = async (req, res) => {
  try {
    const { cropName } = req.query;

    if (cropName) {
      const price = await getMarketPrices(cropName, "Maharashtra");
      return res.json({ success: true, data: price });
    }

    const crops = await CropEntry.find({ farmerId: req.userId }).select("cropName");
    const cropNames = [...new Set(crops.map(c => c.cropName))];

    const allPrices = [];
    for (const name of cropNames) {
      const price = await getMarketPrices(name, "Maharashtra");
      allPrices.push(price);
    }

    res.json({ success: true, data: allPrices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHarvest = async (req, res) => {
  try {
    const activeCrops = await CropEntry.find({
      farmerId: req.userId,
      status: { $in: ["Planted", "Growing"] }
    });

    const profile = await FarmerProfile.findOne({ farmerId: req.userId });
    const city = profile ? profile.region || profile.district || "Pune" : "Pune";

    let weather = { temp: 28, feelsLike: 26, humidity: 65, wind: 12, condition: "clear sky", rainfall: 0, city };
    try {
      weather = await getCurrentWeather(city);
    } catch (e) {

    }

    const predictions = [];
    for (const crop of activeCrops) {
      const prediction = await predictHarvest(crop, weather);
      predictions.push(prediction);
    }

    res.json({ success: true, data: predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRevenue = async (req, res) => {
  try {
    let revenueForecast = await Forecast.findOne({
      userId: req.userId,
      type: "revenue",
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    if (!revenueForecast) {
      revenueForecast = await generateRevenueForecast(req.userId, "farmer");
    }

    res.json({ success: true, data: revenueForecast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWeather = async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ farmerId: req.userId });
    const city = profile ? profile.region || profile.district || "Pune" : "Pune";

    const current = await getCurrentWeather(city);
    const forecast = await getWeatherForecast(city, 7);
    const risks = analyzeFarmingRisks(current);

    res.json({
      success: true,
      data: {
        current,
        forecast,
        risks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const seedData = async (req, res) => {
  try {
    await MarketPrice.deleteMany({});
    await Forecast.deleteMany({});

    const seedCrops = [
      { cropName: "Tomato", min: 40, max: 60, demand: 85 },
      { cropName: "Onion", min: 25, max: 40, demand: 72 },
      { cropName: "Potato", min: 18, max: 28, demand: 78 },
      { cropName: "Rice", min: 32, max: 45, demand: 65 },
      { cropName: "Wheat", min: 24, max: 35, demand: 55 },
      { cropName: "Banana", min: 30, max: 50, demand: 80 },
      { cropName: "Mango", min: 60, max: 120, demand: 90 },
      { cropName: "Cauliflower", min: 25, max: 40, demand: 70 },
      { cropName: "Cabbage", min: 15, max: 25, demand: 68 },
      { cropName: "Brinjal", min: 20, max: 35, demand: 75 },
    ];

    let marketPriceCount = 0;
    let forecastCount = 0;

    for (const crop of seedCrops) {
      const modal = Math.round((crop.min + crop.max) / 2);
      await MarketPrice.create({
        cropName: crop.cropName,
        variety: "General",
        state: "Maharashtra",
        district: "Pune",
        market: "Pune Mandi",
        minPrice: crop.min,
        maxPrice: crop.max,
        modalPrice: modal,
        date: new Date(),
        source: "seed",
      });
      marketPriceCount++;

      await Forecast.create({
        userId: null,
        userType: "farmer",
        type: "demand",
        cropName: crop.cropName,
        predictedValue: crop.demand,
        confidence: 80,
        period: "weekly",
        date: new Date(),
      });
      forecastCount++;
    }

    await Forecast.create({
      userId: null,
      userType: "farmer",
      type: "revenue",
      cropName: "all",
      predictedValue: 85000,
      confidence: 75,
      period: "monthly",
      date: new Date(),
    });
    forecastCount++;

    res.json({ success: true, message: "Data seeded successfully", counts: { marketPriceCount, forecastCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getCrops,
  createCrop,
  updateCrop,
  deleteCrop,
  getForecast,
  getMarket,
  getHarvest,
  getRevenue,
  getWeather,
  seedData,
};
