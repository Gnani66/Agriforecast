const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getInsights, chat } = require("../controllers/retailerAiController");

router.post("/chat", chat);
router.use(authMiddleware);
router.get("/insights", getInsights);

module.exports = router;
