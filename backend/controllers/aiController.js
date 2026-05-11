const {
  getAIResponse,
  generateCropRecommendation,
  generateMarketInsight,
  generateHarvestAdvice,
  generateInsight
} = require("../services/aiService");

let AIChat;
try {
  AIChat = require("../models/AIChat");
} catch (e) {
  // AIChat model not available, skip saving to DB
}

const saveChatMessage = async (userId, userType, role, content) => {
  if (!AIChat) return;
  try {
    await AIChat.create({ userId, userType, role, content });
  } catch (e) {
    // silently skip DB save failure
  }
};

const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const response = await getAIResponse(message, context);

    const userId = req.user?.id || req.body?.userId || "anonymous";
    const userType = req.user?.type || req.body?.userType || "anonymous";

    await saveChatMessage(userId, userType, "user", message);
    await saveChatMessage(userId, userType, "assistant", response);

    res.json({
      success: true,
      data: {
        response,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCropRecommendation = async (req, res) => {
  try {
    const { region, season, soilType, weatherData } = req.body;

    const recommendation = await generateCropRecommendation(
      region || "Maharashtra",
      season || "Rabi",
      soilType || "Loamy",
      weatherData || {}
    );

    res.json({
      success: true,
      data: {
        recommendation,
        metadata: {
          region,
          season,
          soilType,
          generatedAt: new Date()
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getMarketInsight = async (req, res) => {
  try {
    const { crops, weatherData } = req.body;

    const insight = await generateMarketInsight(
      crops || [],
      weatherData || {}
    );

    res.json({
      success: true,
      data: {
        insight,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getHarvestAdvice = async (req, res) => {
  try {
    const { crop, plantingDate, weatherForecast } = req.body;

    const advice = await generateHarvestAdvice(
      crop || "Tomato",
      plantingDate || new Date().toISOString(),
      weatherForecast || []
    );

    res.json({
      success: true,
      data: {
        advice,
        crop,
        plantingDate,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const generateInsights = async (req, res) => {
  try {
    const { dashboardData } = req.body;

    const insight = await generateInsight(dashboardData || {});

    res.json({
      success: true,
      data: {
        insight,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  chatWithAI,
  getCropRecommendation,
  getMarketInsight,
  getHarvestAdvice,
  generateInsights
};
