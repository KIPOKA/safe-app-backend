const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "UserCredentials",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // now safe
        validate: { isEmail: true },
      },
      password: { type: DataTypes.STRING, allowNull: false },
    },
    {
      tableName: "user_credentials",
      timestamps: true,
    }
  );
};
