// models/EmergencyType.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EmergencyType = sequelize.define(
    "EmergencyType",
    {
      emergency_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "emergency_types",
    }
  );

  return EmergencyType;
};
