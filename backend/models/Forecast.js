const mongoose = require("mongoose");

const forecastSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  userType: { type: String, enum: ["farmer", "retailer"] },
  type: { type: String, enum: ["demand", "revenue", "price", "harvest"] },
  cropName: { type: String },
  predictedValue: { type: Number },
  actualValue: { type: Number, default: null },
  confidence: { type: Number },
  period: { type: String, enum: ["daily", "weekly", "monthly"] },
  date: { type: Date, default: Date.now },
  details: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

module.exports = mongoose.model("Forecast", forecastSchema);
