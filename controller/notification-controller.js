const {
  Notification,
  User,
  EmergencyContact,
  BloodType,
  MedicalAid,
  NotificationStatus,
  EmergencyType,
  MessageSolution,
} = require("../models");

// Create a new notification
exports.createNotification = async (req, res) => {
  const { fromUserId, emergencyTypeId } = req.body;

  try {
    if (!fromUserId || !emergencyTypeId) {
      return res
        .status(400)
        .json({ error: "User ID and Emergency Type ID are required" });
    }

    // Check if user exists
    const user = await User.findByPk(fromUserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if emergency type exists
    const emergencyType = await EmergencyType.findByPk(emergencyTypeId);
    if (!emergencyType) {
      return res.status(404).json({ error: "Emergency type not found" });
    }

    // Get default status ("Pending")
    const defaultStatus = await NotificationStatus.findOne({
      where: { name: "Pending" },
    });
    if (!defaultStatus) {
      return res.status(500).json({ error: "Default status not found" });
    }

    // Create the notification
    const notification = await Notification.create({
      fromUserId,
      emergencyTypeId,
      statusId: defaultStatus.status_id, // <-- set default status
    });

    res.status(201).json({
      message: "Notification created successfully",
      notification,
    });
  } catch (err) {
    console.error("Notification creation error:", err);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// ==================== GET NOTIFICATIONS ====================

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "allergies"],
          include: [
            {
              model: EmergencyContact,
              as: "emergencyContacts",
              attributes: ["id", "name", "phone", "relation"],
            },
            {
              model: BloodType,
              as: "bloodType",
              attributes: ["id", "type"],
            },
            {
              model: MedicalAid,
              as: "medicalAid",
              attributes: ["medicalAidId", "name", "type"],
            },
          ],
        },
        {
          model: NotificationStatus,
          as: "status",
          attributes: [["status_id", "id"], "name"],
        },
        {
          model: EmergencyType,
          as: "emergencyType",
          attributes: [["emergency_id", "id"], "name", "description"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ notifications });
  } catch (err) {
    console.error("Get notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Get notifications for a specific user
exports.getNotificationsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.findAll({
      where: { fromUserId: userId },
      include: [
        { model: User, as: "user", attributes: ["id", "fullName"] },
        {
          model: EmergencyType,
          as: "emergencyType",
          attributes: ["emergency_id", "name"],
        },
        {
          model: NotificationStatus,
          as: "status",
          attributes: [["status_id", "id"], "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ error: "Failed to get notifications" });
  }
};

// ==================== UPDATE STATUS ====================
// controllers/notificationController.js
exports.updateNotificationStatus = async (req, res) => {
  const { notificationId, statusId, message } = req.body;
  console.log(req.body);

  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // update notification status
    notification.statusId = statusId;
    await notification.save();

    // if resolution message is provided, save it
    let solution = null;
    if (message) {
      solution = await MessageSolution.create({
        notificationId,
        fromUserId: notification.fromUserId,
        resolutionMessage: message,
        statusId,
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
      notification,
      solution,
    });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

// ==================== DELETE NOTIFICATION ====================
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });

    await notification.destroy();
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

// ==================== GET SINGLE NOTIFICATION ====================
exports.getNotificationById = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByPk(notificationId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName", "allergies"],
          include: [
            {
              model: EmergencyContact,
              as: "emergencyContacts",
              attributes: ["id", "name", "phone", "relation"],
            },
            {
              model: BloodType,
              as: "bloodType",
              attributes: ["id", "type"],
            },
            {
              model: MedicalAid,
              as: "medicalAid",
              attributes: ["medicalAidId", "name", "type"],
            },
          ],
        },
        {
          model: NotificationStatus,
          as: "status",
          attributes: [["status_id", "id"], "name"],
        },
        {
          model: EmergencyType,
          as: "emergencyType",
          attributes: [["emergency_id", "id"], "name", "description"],
        },
      ],
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ notification });
  } catch (err) {
    console.error("Get single notification error:", err);
    res.status(500).json({ error: "Failed to fetch notification" });
  }
};

// controllers/notificationController.js

// ==================== ADD RESOLUTION MESSAGE ====================
exports.addResolutionMessage = async (req, res) => {
  const { notificationId, message } = req.body;
  console.log(req.body);

  try {
    if (!notificationId || !message) {
      return res
        .status(400)
        .json({ error: "Notification ID and message are required" });
    }

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Save message in MessageSolution table
    const solution = await MessageSolution.create({
      notificationId,
      fromUserId: notification.fromUserId,
      message,
      statusId: notification.statusId, // optional: store current status
    });

    res
      .status(200)
      .json({ message: "Resolution message saved successfully", solution });
  } catch (err) {
    console.error("Add resolution message error:", err);
    res.status(500).json({ error: "Failed to save resolution message" });
  }
};

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
