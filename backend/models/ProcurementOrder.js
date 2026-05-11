const mongoose = require("mongoose");

const procurementOrderSchema = new mongoose.Schema({
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", required: true },
  product: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: "kg" },
  supplier: { type: String },
  cost: { type: Number, default: 0 },
  confidence: { type: Number, default: 50 },
  deliveryDate: { type: Date },
  status: { type: String, enum: ["pending", "ordered", "delivered", "cancelled"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("ProcurementOrder", procurementOrderSchema);
