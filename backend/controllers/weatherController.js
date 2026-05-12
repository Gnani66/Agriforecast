const { getCurrentWeather, getForecast, analyzeFarmingRisks } = require("../services/weatherService");

const getWeather = async (req, res) => {
  try {
    const { city } = req.query;
    const weather = await getCurrentWeather(city || "Pune");
    const risks = analyzeFarmingRisks(weather);
    
    res.json({
      success: true,
      data: {
        ...weather,
        risks,
        farmingTips: generateFarmingTips(weather)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getWeatherForecast = async (req, res) => {
  try {
    const { city, days } = req.query;
    const forecast = await getForecast(city || "Pune", parseInt(days) || 7);
    
    // Analyze forecast for farming decisions
    const farmingAnalysis = analyzeForecast(forecast);
    
    res.json({
      success: true,
      data: {
        forecast,
        analysis: farmingAnalysis
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const analyzeForecast = (forecast) => {
  const recommendations = [];
  let totalRainfall = 0;
  
  forecast.forEach(day => {
    totalRainfall += day.rainfall;
  });
  
  if (totalRainfall > 50) {
    recommendations.push({
      type: "harvest",
      message: "Heavy rainfall expected this week. Consider early harvest of mature crops."
    });
  }
  
  if (totalRainfall > 20 && totalRainfall < 50) {
    recommendations.push({
      type: "irrigation",
      message: "Good rainfall expected. You can reduce irrigation for the next few days."
    });
  }
  
  const rainyDays = forecast.filter(d => d.rainfall > 5).length;
  if (rainyDays >= 3) {
    recommendations.push({
      type: "fieldwork",
      message: `${rainyDays} days with rain expected. Avoid pesticide spraying and field work during this period.`
    });
  }
  
  return recommendations;
};

const generateFarmingTips = (weather) => {
  const tips = [];
  
  if (weather.humidity > 70) {
    tips.push("High humidity - monitor crops for fungal diseases");
  }
  if (weather.temp > 30) {
    tips.push("High temperature - ensure adequate soil moisture");
  }
  if (weather.rainfall > 0) {
    tips.push("Rain expected - skip irrigation today");
  }
  if (weather.wind > 20) {
    tips.push("Strong winds - avoid spraying pesticides");
  }
  
  return tips;
};

module.exports = {
  getWeather,
  getWeatherForecast
};