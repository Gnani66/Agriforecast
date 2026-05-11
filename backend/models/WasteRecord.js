const mongoose = require("mongoose");

const wasteRecordSchema = new mongoose.Schema({
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", required: true },
  product: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
  reason: { type: String, enum: ["expiry", "demand", "overstock", "storage"] },
  severity: { type: String, enum: ["critical", "high", "medium", "low"] },
  status: { type: String, enum: ["active", "mitigated"], default: "active" },
  recommendedAction: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("WasteRecord", wasteRecordSchema);
