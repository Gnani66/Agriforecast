const mongoose = require("mongoose");

const marketPriceSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  variety: { type: String },
  state: { type: String },
  district: { type: String },
  market: { type: String },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  modalPrice: { type: Number },
  date: { type: Date, default: Date.now },
  source: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("MarketPrice", marketPriceSchema);
