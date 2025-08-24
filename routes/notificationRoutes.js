const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notification-controller");

// Create notification
router.post("/notification", notificationController.createNotification);

// Get notifications (optionally for a specific user)
router.get(
  "/notifications/user/:userId",
  notificationController.getNotificationsByUser
);

// Update notification status
router.put("/status", notificationController.updateNotificationStatus);

router.get("/", notificationController.getNotifications);
// Delete notification
router.delete("/delete", notificationController.deleteNotification);

module.exports = router;
