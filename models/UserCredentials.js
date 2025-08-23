// models/UserCredentials.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserCredentials = sequelize.define(
    "UserCredentials",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "user_credentials",
    }
  );

  return UserCredentials;
};
