const express = require("express");
const router = express.Router();
const notificationController = require("../controller/notification-controller");

// ==================== Notification Routes ==================== //

// Create a new notification
router.post("/create", notificationController.createNotification);

// Get all notifications
router.get("/", notificationController.getNotifications);

// Get notifications for a specific user
router.get("/user/:userId", notificationController.getNotificationsByUser);

// Get a single notification by ID
router.get("/:notificationId", notificationController.getNotificationById);

// Update notification status
router.put("/status", notificationController.updateNotificationStatus);

// Delete a notification by ID
router.delete(
  "/delete/:notificationId",
  notificationController.deleteNotification
);

// Add a resolution message for a notification
router.post("/resolution", notificationController.addResolutionMessage);

module.exports = router;
