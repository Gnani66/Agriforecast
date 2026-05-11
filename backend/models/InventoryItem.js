const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  retailerId: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer", required: true },
  product: { type: String, required: true },
  category: { type: String },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: "kg" },
  minStock: { type: Number, default: 10 },
  maxStock: { type: Number, default: 100 },
  avgDaily: { type: Number, default: 0 },
  purchasePrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  expiryDate: { type: Date },
  storageType: { type: String, default: "Ambient" },
  supplierName: { type: String, default: "" },
  turnover: { type: String, enum: ["Fast", "Medium", "Slow"], default: "Medium" },
  demand: { type: Number, default: 50 },
  status: { type: String, enum: ["critical", "warning", "healthy"], default: "healthy" },
}, { timestamps: true });

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
