const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getAnalytics, getWeeklyStats } = require("../controllers/analyticsController");
router.get("/", auth, getAnalytics);
router.get("/weekly", auth, getWeeklyStats);
module.exports = router;