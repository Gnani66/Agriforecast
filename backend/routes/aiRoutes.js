const express = require("express");
const router = express.Router();
const {
  chatWithAI,
  getCropRecommendation,
  getMarketInsight,
  getHarvestAdvice,
  generateInsights
} = require("../controllers/aiController");

router.post("/chat", chatWithAI);
router.post("/crop-recommendation", getCropRecommendation);
router.post("/market-insight", getMarketInsight);
router.post("/harvest-advice", getHarvestAdvice);
router.post("/generate-insights", generateInsights);

module.exports = router;
