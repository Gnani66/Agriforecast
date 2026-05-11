const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDashboard, getInventory, addInventory, updateInventory,
  getWaste, getProcurement, getSales, getForecast
} = require("../controllers/retailerController");
const { deleteInventory } = require("../controllers/inventoryController");
const { addSale } = require("../controllers/salesController");

router.use(authMiddleware);

router.get("/dashboard", getDashboard);
router.get("/inventory", getInventory);
router.post("/inventory", addInventory);
router.put("/inventory/:id", updateInventory);
router.delete("/inventory/:id", deleteInventory);
router.get("/waste", getWaste);
router.get("/procurement", getProcurement);
router.get("/sales", getSales);
router.post("/sales", addSale);
router.get("/forecast", getForecast);

module.exports = router;
