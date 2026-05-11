const { getDemandForecast } = require("../services/retailerForecastService");

const getDemandForecastHandler = async (req, res) => {
  try {
    const result = await getDemandForecast(req.userId);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDemandForecast: getDemandForecastHandler };
