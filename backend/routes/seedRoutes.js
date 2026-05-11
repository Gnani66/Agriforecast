const express = require("express");
const router = express.Router();
const MarketPrice = require("../models/MarketPrice");
const Forecast = require("../models/Forecast");

const seedCrops = [
  { cropName: "Tomato", min: 40, max: 60, demand: 85, region: "Bangalore" },
  { cropName: "Onion", min: 25, max: 40, demand: 72, region: "Mysore" },
  { cropName: "Potato", min: 18, max: 28, demand: 78, region: "Pune" },
  { cropName: "Rice", min: 32, max: 45, demand: 65, region: "Nagpur" },
  { cropName: "Wheat", min: 24, max: 35, demand: 55, region: "Delhi" },
  { cropName: "Banana", min: 30, max: 50, demand: 80, region: "Jalgaon" },
  { cropName: "Mango", min: 60, max: 120, demand: 90, region: "Ratnagiri" },
  { cropName: "Cauliflower", min: 25, max: 40, demand: 70, region: "Nashik" },
  { cropName: "Cabbage", min: 15, max: 25, demand: 68, region: "Nashik" },
  { cropName: "Brinjal", min: 20, max: 35, demand: 75, region: "Ahmednagar" },
];

router.post("/seed", async (req, res) => {
  try {
    await MarketPrice.deleteMany({});
    await Forecast.deleteMany({});

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
        demandScore: crop.demand,
      });

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

    res.json({ success: true, message: "Data seeded successfully", count: seedCrops.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
