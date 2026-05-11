const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addInventory, getAllInventory, updateInventory, deleteInventory } = require("../controllers/inventoryController");

router.use(authMiddleware);

router.post("/add", addInventory);
router.get("/all", getAllInventory);
router.put("/update/:id", updateInventory);
router.delete("/delete/:id", deleteInventory);

module.exports = router;
