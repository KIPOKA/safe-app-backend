// models/MedicalAid.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MedicalAid = sequelize.define(
    "MedicalAid",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "medical_aids",
    }
  );

  return MedicalAid;
};
