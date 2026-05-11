const mongoose = require("mongoose");

const retailerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    storeName: {
      type: String,
    },
    storeType: {
      type: String,
    },
    region: {
      type: String,
    },
    inventoryCategory: {
      type: String,
    },
    storageCapacity: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Retailer", retailerSchema);