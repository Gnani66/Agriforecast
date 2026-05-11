const mongoose = require("mongoose");

const fleetVehicleSchema = new mongoose.Schema({
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: "Distributor", required: true },
  plate: { type: String },
  model: { type: String },
  driver: { type: String },
  status: { type: String, enum: ["Active", "Idle", "Maintenance"], default: "Idle" },
  location: { type: String },
  fuel: { type: Number, default: 100 },
  mileage: { type: Number, default: 0 },
  nextService: { type: String },
  totalTrips: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("FleetVehicle", fleetVehicleSchema);
