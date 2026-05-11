const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", required: true },
  origin: { type: String },
  destination: { type: String },
  status: { type: String, default: "pending" },
  eta: { type: String },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  weight: { type: Number },
  vehicle: { type: String },
  driver: { type: String },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Shipment", shipmentSchema);
