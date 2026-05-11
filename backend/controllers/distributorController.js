const Shipment = require("../models/Shipment");
const Warehouse = require("../models/Warehouse");
const FleetVehicle = require("../models/FleetVehicle");

const getDashboard = async (req, res) => {
  try {
    const distributorId = req.userId;

    const shipments = await Shipment.find({ distributorId });
    const totalShipments = shipments.length;
    const activeShipments = shipments.filter(s => s.status !== "delivered" && s.status !== "cancelled").length;
    const delivered = shipments.filter(s => s.status === "delivered").length;

    const warehouses = await Warehouse.find({ distributorId });
    const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0);
    const totalUsed = warehouses.reduce((s, w) => s + w.used, 0);
    const avgEfficiency = warehouses.length > 0
      ? Math.round(warehouses.reduce((s, w) => s + w.efficiency, 0) / warehouses.length)
      : 0;

    const fleet = await FleetVehicle.find({ distributorId });
    const activeVehicles = fleet.filter(v => v.status === "Active").length;
    const idleVehicles = fleet.filter(v => v.status === "Idle").length;
    const maintenanceVehicles = fleet.filter(v => v.status === "Maintenance").length;

    const totalTrips = fleet.reduce((s, v) => s + v.totalTrips, 0);

    res.json({
      success: true,
      data: {
        totalShipments,
        activeShipments,
        delivered,
        totalCapacity,
        totalUsed,
        warehouseEfficiency: avgEfficiency,
        fleetSize: fleet.length,
        activeVehicles,
        idleVehicles,
        maintenanceVehicles,
        totalTrips
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find({ distributorId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: shipments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndUpdate(
      { _id: req.params.id, distributorId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!shipment) return res.status(404).json({ success: false, message: "Shipment not found" });
    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({ distributorId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: warehouses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFleet = async (req, res) => {
  try {
    const fleet = await FleetVehicle.find({ distributorId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: fleet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRoutes = async (req, res) => {
  try {
    const shipments = await Shipment.find({
      distributorId: req.userId,
      status: { $ne: "delivered" }
    });

    const destinations = [...new Set(shipments.map(s => s.destination))];

    const routes = destinations.map(dest => {
      const destShipments = shipments.filter(s => s.destination === dest);
      const totalWeight = destShipments.reduce((s, sh) => s + (sh.weight || 0), 0);
      return {
        destination: dest,
        shipmentCount: destShipments.length,
        totalWeight,
        priority: destShipments.some(s => s.priority === "high") ? "high" : "medium",
        suggestedRoute: `Optimize delivery to ${dest} with ${destShipments.length} shipments`
      };
    });

    res.json({
      success: true,
      data: {
        routes,
        totalActiveShipments: shipments.length,
        uniqueDestinations: destinations.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const distributorId = req.userId;

    const shipments = await Shipment.find({ distributorId });
    const total = shipments.length;
    const delivered = shipments.filter(s => s.status === "delivered").length;
    const onTimeRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    const warehouses = await Warehouse.find({ distributorId });
    const utilization = warehouses.length > 0
      ? Math.round(warehouses.reduce((s, w) => s + (w.capacity > 0 ? (w.used / w.capacity) * 100 : 0), 0) / warehouses.length)
      : 0;

    const fleet = await FleetVehicle.find({ distributorId });
    const fleetUtilization = fleet.length > 0
      ? Math.round((fleet.filter(v => v.status === "Active").length / fleet.length) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        totalShipments: total,
        deliveredShipments: delivered,
        onTimeDeliveryRate: onTimeRate,
        warehouseUtilization: utilization,
        fleetUtilization,
        activeShipments: shipments.filter(s => s.status !== "delivered" && s.status !== "cancelled").length,
        totalWarehouses: warehouses.length,
        totalVehicles: fleet.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboard,
  getShipments,
  updateShipment,
  getWarehouses,
  getFleet,
  getRoutes,
  getAnalytics
};
