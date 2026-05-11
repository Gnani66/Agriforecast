const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { addSale, getAllSales } = require("../controllers/salesController");

router.use(authMiddleware);

router.post("/add", addSale);
router.get("/all", getAllSales);

module.exports = router;
