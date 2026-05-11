const mongoose = require("mongoose");

const farmerProfileSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true, unique: true },
  region: { type: String },
  district: { type: String },
  farmSize: { type: Number },
  soilType: { type: String },
  waterAvailability: { type: String, enum: ["Low", "Medium", "High"] },
  primaryCrops: { type: [String] },
  farmingType: { type: String, enum: ["Organic", "Conventional", "Mixed"] },
}, { timestamps: true });

module.exports = mongoose.model("FarmerProfile", farmerProfileSchema);
