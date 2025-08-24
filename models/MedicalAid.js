// models/MedicalAid.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MedicalAid = sequelize.define(
    "MedicalAid",
    {
      medicalAidId: {
        type: DataTypes.INTEGER,
        references: {
          model: "medical_aids",
          key: "id",
        },
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
