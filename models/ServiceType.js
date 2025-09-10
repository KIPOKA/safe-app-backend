// models/ServiceType.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ServiceType = sequelize.define(
    "ServiceType",
    {
      id: {
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
        defaultValue: "",
      },
    },
    {
      timestamps: true,
      tableName: "service_types",
    }
  );

  return ServiceType;
};
