const axios = require("axios");

const getCurrentWeather = async (city = "Pune") => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    return {
      temp: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      wind: Math.round(response.data.wind.speed * 3.6),
      pressure: response.data.main.pressure,
      visibility: Math.round(response.data.visibility / 1000),
      condition: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      city: response.data.name,
      country: response.data.sys.country,
      rainfall: response.data.rain ? (response.data.rain["1h"] || response.data.rain["3h"] || 0) : 0
    };
  } catch (error) {
    console.error("Weather API error:", error.message);
    throw new Error("Failed to fetch weather data");
  }
};

const getForecast = async (city = "Pune", days = 7) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    const dailyData = {};
    response.data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          conditions: [],
          humidity: [],
          rain: []
        };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].humidity.push(item.main.humidity);
      if (item.rain && item.rain["3h"]) {
        dailyData[date].rain.push(item.rain["3h"]);
      }
      dailyData[date].conditions.push(item.weather[0].main);
    });

    const forecast = Object.entries(dailyData).slice(0, days).map(([date, data]) => ({
      date,
      high: Math.round(Math.max(...data.temps)),
      low: Math.round(Math.min(...data.temps)),
      humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
      rainfall: Math.round((data.rain.reduce((a, b) => a + b, 0) * 10) / 10),
      condition: getMostCommon(data.conditions)
    }));

    return forecast;
  } catch (error) {
    console.error("Forecast API error:", error.message);
    throw new Error("Failed to fetch forecast data");
  }
};

const getMostCommon = (arr) => {
  const counts = {};
  arr.forEach(item => { counts[item] = (counts[item] || 0) + 1; });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

const analyzeFarmingRisks = (weatherData) => {
  const risks = [];
  
  if (weatherData.rainfall > 50) {
    risks.push({
      type: "flood",
      severity: "high",
      message: "Heavy rainfall expected. Avoid field work and ensure proper drainage."
    });
  }
  
  if (weatherData.temp > 35) {
    risks.push({
      type: "heat",
      severity: "high",
      message: "High temperature alert. Ensure adequate irrigation and crop shading."
    });
  }
  
  if (weatherData.humidity > 80) {
    risks.push({
      type: "disease",
      severity: "medium",
      message: "High humidity may increase fungal disease risk. Monitor crops closely."
    });
  }
  
  if (weatherData.wind > 30) {
    risks.push({
      type: "wind",
      severity: "medium",
      message: "Strong winds expected. Support tall crops and avoid spraying."
    });
  }
  
  if (risks.length === 0) {
    risks.push({
      type: "none",
      severity: "low",
      message: "Weather conditions are favorable for farming activities."
    });
  }
  
  return risks;
};

module.exports = {
  getCurrentWeather,
  getForecast,
  analyzeFarmingRisks
};