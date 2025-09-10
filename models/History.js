// models/History.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const History = sequelize.define(
    "History",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sessionId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Unique identifier for a chat session",
      },
      userMessage: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      aiMessage: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "histories",
    }
  );

  return History;
};
