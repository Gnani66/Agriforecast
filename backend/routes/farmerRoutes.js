const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile, updateProfile, getDashboard, getCrops, createCrop,
  updateCrop, deleteCrop, getForecast, getMarket, getLiveMarket, getHarvest,
  getRevenue, getWeather, seedData, getInsights
} = require("../controllers/farmerController");

router.post("/seed", seedData);

router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/dashboard", getDashboard);
router.get("/crops", getCrops);
router.post("/crops", createCrop);
router.put("/crops/:id", updateCrop);
router.delete("/crops/:id", deleteCrop);
router.get("/forecast", getForecast);
router.get("/market", getMarket);
router.get("/market/live", getLiveMarket);
router.get("/harvest", getHarvest);
router.get("/revenue", getRevenue);
router.get("/weather", getWeather);
router.get("/insights", getInsights);

module.exports = router;
