const mongoose = require("mongoose");

const harvestPredictionSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer" },
  cropName: { type: String },
  plantingDate: { type: Date },
  expectedHarvestDate: { type: Date },
  bestHarvestWindowStart: { type: Date },
  bestHarvestWindowEnd: { type: Date },
  demandPeakTiming: { type: String },
  riskLevel: { type: String, enum: ["Low", "Medium", "High"] },
  recommendation: { type: String },
  generatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HarvestPrediction", harvestPredictionSchema);
