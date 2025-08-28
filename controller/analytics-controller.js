const {
  Notification,
  User,
  NotificationStatus,
  EmergencyType,
} = require("../models");

exports.getNotificationAnalytics = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [
        { model: User, as: "user", attributes: ["id", "fullName"] },
        { model: NotificationStatus, as: "status", attributes: ["name"] },
        { model: EmergencyType, as: "emergencyType", attributes: ["name"] },
      ],
    });

    // Status counts
    const statusCounts = {};
    notifications.forEach((n) => {
      const status = n.status?.name || "Unknown";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Emergency type counts
    const typeCounts = {};
    notifications.forEach((n) => {
      const type = n.emergencyType?.name || "Unknown";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // User counts
    const userCounts = {};
    notifications.forEach((n) => {
      const user = n.user?.fullName || "Unknown";
      userCounts[user] = (userCounts[user] || 0) + 1;
    });

    // Resolution messages
    const resolutionStats = {
      resolved: notifications.filter((n) => n.resolutionMessage).length,
      unresolved: notifications.filter((n) => !n.resolutionMessage).length,
    };

    res.status(200).json({
      totalNotifications: notifications.length,
      statusCounts,
      typeCounts,
      userCounts,
      resolutionStats,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to fetch notification analytics" });
  }
};
