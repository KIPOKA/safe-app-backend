// models/Location.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Location = sequelize.define(
    "Location",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
        validate: {
          min: -90,
          max: 90,
        },
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
        validate: {
          min: -180,
          max: 180,
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      timestamps: true,
      tableName: "locations",
    }
  );

  return Location;
};
