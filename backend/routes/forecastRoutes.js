const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getDemandForecast } = require("../controllers/forecastController");

router.use(authMiddleware);

router.get("/demand", getDemandForecast);

module.exports = router;
