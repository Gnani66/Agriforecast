const mongoose = require("mongoose");

const dailyForecastSchema = new mongoose.Schema({
  date: { type: String },
  high: { type: Number },
  low: { type: Number },
  condition: { type: String },
  rainfall: { type: Number },
  humidity: { type: Number },
}, { _id: false });

const weatherDataSchema = new mongoose.Schema({
  city: { type: String, required: true },
  date: { type: Date, default: Date.now },
  temp: { type: Number },
  feelsLike: { type: Number },
  humidity: { type: Number },
  wind: { type: Number },
  pressure: { type: Number },
  visibility: { type: Number },
  condition: { type: String },
  icon: { type: String },
  rainfall: { type: Number, default: 0 },
  forecast: [dailyForecastSchema],
}, { timestamps: true });

module.exports = mongoose.model("WeatherData", weatherDataSchema);
