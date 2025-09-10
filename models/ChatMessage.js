// models/ChatMessage.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ChatMessage = sequelize.define(
    "ChatMessage",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userQuestion: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      aiResponse: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      timestamps: true,
      tableName: "chat_messages",
    }
  );

  return ChatMessage;
};
