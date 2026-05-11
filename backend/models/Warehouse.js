const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", required: true },
  name: { type: String },
  location: { type: String },
  capacity: { type: Number },
  used: { type: Number, default: 0 },
  efficiency: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Warehouse", warehouseSchema);
