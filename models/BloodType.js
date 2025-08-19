// models/BloodType.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const BloodType = sequelize.define(
    "BloodType",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      allergies: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      medicalConditions: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      timestamps: false,
      tableName: "blood_types",
    }
  );

  return BloodType;
};
