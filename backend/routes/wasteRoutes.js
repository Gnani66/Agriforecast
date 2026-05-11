const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { analyzeWaste } = require("../controllers/wasteController");

router.use(authMiddleware);

router.get("/analyze", analyzeWaste);

module.exports = router;
