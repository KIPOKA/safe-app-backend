// models/NotificationStatus.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const NotificationStatus = sequelize.define(
    "NotificationStatus",
    {
      status_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "notification_statuses",
    }
  );

  return NotificationStatus;
};
