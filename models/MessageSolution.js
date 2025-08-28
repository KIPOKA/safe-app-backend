const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MessageSolution = sequelize.define(
    "MessageSolution",
    {
      message_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      resolutionMessage: {
        type: DataTypes.TEXT,
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
      tableName: "message_solution",
    }
  );

  return MessageSolution;
};
