// models/Service.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Service = sequelize.define(
    "Service",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      serviceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [7, 20],
        },
      },
      details: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      timestamps: true,
      tableName: "services",
    }
  );

  return Service;
};
