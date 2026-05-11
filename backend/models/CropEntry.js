const mongoose = require("mongoose");

const cropEntrySchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  cropName: { type: String, required: true },
  cropCategory: { type: String, enum: ["Vegetable", "Fruit", "Grain", "Dairy", "Other"] },
  plantingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date },
  quantityPlanted: { type: Number },
  landAllocation: { type: Number },
  expectedYield: { type: Number },
  irrigationType: { type: String, enum: ["Drip", "Flood", "Sprinkler", "Rainfed"] },
  status: { type: String, enum: ["Planted", "Growing", "Harvested", "Failed"] },
}, { timestamps: true });

module.exports = mongoose.model("CropEntry", cropEntrySchema);
