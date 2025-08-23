// models/UserRole.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      permissions: {
        type: DataTypes.JSON, // store as JSON array
        defaultValue: [],
      },
    },
    {
      timestamps: false,
      tableName: "user_roles",
    }
  );

  return UserRole;
};
