// models/EmergencyContact.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EmergencyContact = sequelize.define(
    "EmergencyContact",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [10, 15],
        },
      },
      relation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "emergency_contacts",
    }
  );

  return EmergencyContact;
};
