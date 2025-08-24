const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      notification_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      emergencyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      statusId: {
        // FK to NotificationStatus
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
      tableName: "notifications",
    }
  );

  return Notification;
};
