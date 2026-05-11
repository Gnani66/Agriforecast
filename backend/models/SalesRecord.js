const mongoose = require("mongoose");

const salesRecordSchema = new mongoose.Schema({
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", required: true },
  product: { type: String, required: true },
  category: { type: String },
  unitsSold: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  region: { type: String, default: "" },
  paymentMethod: { type: String },
  date: { type: Date, default: Date.now },
  customerCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("SalesRecord", salesRecordSchema);
