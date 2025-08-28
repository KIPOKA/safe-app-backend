const express = require("express");
const router = express.Router();
const analyticsController = require("../controller/analytics-controller");

// GET /api/analytics/notifications
router.get("/", analyticsController.getNotificationAnalytics);

module.exports = router;
