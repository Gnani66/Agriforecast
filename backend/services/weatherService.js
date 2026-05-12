const axios = require("axios");

const COORDS = {
  "pune": { lat: 18.5204, lon: 73.8567 },
  "mumbai": { lat: 19.0760, lon: 72.8777 },
  "delhi": { lat: 28.7041, lon: 77.1025 },
  "bangalore": { lat: 12.9716, lon: 77.5946 },
  "chennai": { lat: 13.0827, lon: 80.2707 },
  "kolkata": { lat: 22.5726, lon: 88.3639 },
  "hyderabad": { lat: 17.3850, lon: 78.4867 },
  "ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "nashik": { lat: 19.9975, lon: 73.7898 },
  "nagpur": { lat: 21.1458, lon: 79.0882 },
  "aurangabad": { lat: 19.8762, lon: 75.3433 },
};

const getCoords = (city) => {
  const key = city.toLowerCase().trim();
  if (COORDS[key]) return COORDS[key];
  return { lat: 18.5204, lon: 73.8567 };
};

const getCurrentWeather = async (city = "Pune") => {
  try {
    const { lat, lon } = getCoords(city);
    const res = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure",
        daily: "precipitation_sum",
        forecast_days: 1,
        timezone: "auto",
      },
    });

    const c = res.data.current || {};
    const daily = res.data.daily || {};

    const code = c.weather_code ?? 0;
    const conditionMap = {
      0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
      45: "foggy", 48: "depositing rime fog",
      51: "light drizzle", 53: "moderate drizzle", 55: "dense drizzle",
      56: "light freezing drizzle", 57: "dense freezing drizzle",
      61: "light rain", 63: "moderate rain", 65: "heavy rain",
      66: "light freezing rain", 67: "heavy freezing rain",
      71: "light snow", 73: "moderate snow", 75: "heavy snow",
      77: "snow grains",
      80: "light rain showers", 81: "moderate rain showers", 82: "violent rain showers",
      85: "light snow showers", 86: "heavy snow showers",
      95: "thunderstorm", 96: "thunderstorm with light hail", 99: "thunderstorm with heavy hail",
    };

    return {
      temp: Math.round(c.temperature_2m ?? 28),
      feelsLike: Math.round(c.apparent_temperature ?? 26),
      humidity: c.relative_humidity_2m ?? 65,
      wind: Math.round(c.wind_speed_10m ?? 0),
      pressure: Math.round(c.surface_pressure ?? 1013),
      visibility: 10000,
      condition: conditionMap[code] || "clear sky",
      icon: code,
      city,
      country: "IN",
      rainfall: daily.precipitation_sum?.[0] ?? 0,
    };
  } catch (error) {
    console.error("Weather API error:", error.message);
    throw new Error("Failed to fetch weather data");
  }
};

const getForecast = async (city = "Pune", days = 7) => {
  try {
    const { lat, lon } = getCoords(city);
    const res = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        daily: "temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean,weather_code",
        timezone: "auto",
        forecast_days: Math.min(days, 16),
      },
    });

    const d = res.data.daily || {};
    const conditionMap = {
      0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
      45: "Foggy", 48: "Rime Fog",
      51: "Drizzle", 53: "Drizzle", 55: "Drizzle",
      61: "Rain", 63: "Rain", 65: "Rain",
      71: "Snow", 73: "Snow", 75: "Snow",
      80: "Rain Showers", 81: "Rain Showers", 82: "Rain Showers",
      95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm",
    };

    return d.time.slice(0, days).map((date, i) => ({
      date,
      high: Math.round(d.temperature_2m_max[i]),
      low: Math.round(d.temperature_2m_min[i]),
      humidity: Math.round(d.relative_humidity_2m_mean[i]),
      rainfall: Math.round(d.precipitation_sum[i] * 10) / 10,
      condition: conditionMap[d.weather_code[i]] || "Unknown",
    }));
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
  const r = weatherData.rainfall ?? 0;
  const t = weatherData.temp ?? 25;
  const h = weatherData.humidity ?? 50;
  const w = weatherData.wind ?? 0;

  if (r > 50) {
    risks.push({
      type: "flood",
      severity: "high",
      message: "Heavy rainfall expected. Avoid field work and ensure proper drainage."
    });
  }

  if (t > 35) {
    risks.push({
      type: "heat",
      severity: "high",
      message: "High temperature alert. Ensure adequate irrigation and crop shading."
    });
  }

  if (h > 80) {
    risks.push({
      type: "disease",
      severity: "medium",
      message: "High humidity may increase fungal disease risk. Monitor crops closely."
    });
  }

  if (w > 30) {
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