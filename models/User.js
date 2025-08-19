// models/User.js
const { DataTypes } = require("sequelize"); 

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      cellNumber: {
        type: DataTypes.STRING,
        validate: {
          len: [10, 15],
        },
      },
      address: {
        type: DataTypes.STRING,
      },
      emergencyContactName: {
        type: DataTypes.STRING,
      },
      emergencyContactPhone: {
        type: DataTypes.STRING,
        validate: {
          len: [10, 15],
        },
      },
      allergies: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      conditions: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      timestamps: true,
      tableName: "users",
    }
  );

  return User;
};
