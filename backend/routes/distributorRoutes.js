const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDashboard, getShipments, updateShipment,
  getWarehouses, getFleet, getRoutes, getAnalytics
} = require("../controllers/distributorController");

router.use(authMiddleware);

router.get("/dashboard", getDashboard);
router.get("/shipments", getShipments);
router.put("/shipments/:id", updateShipment);
router.get("/warehouses", getWarehouses);
router.get("/fleet", getFleet);
router.get("/routes", getRoutes);
router.get("/analytics", getAnalytics);

module.exports = router;
