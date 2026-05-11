const { analyzeWasteRisk } = require("../services/wasteService");

const analyzeWaste = async (req, res) => {
  try {
    const result = await analyzeWasteRisk(req.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeWaste };
