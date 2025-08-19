const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Initialize models
const User = require("./User")(sequelize);
const BloodType = require("./BloodType")(sequelize);
const MedicalAid = require("./MedicalAid")(sequelize);
const UserRole = require("./UserRole")(sequelize);

// Associations
User.belongsTo(BloodType, { foreignKey: "bloodTypeId", as: "bloodType" });
User.belongsTo(MedicalAid, { foreignKey: "medicalAidId", as: "medicalAid" });
User.belongsTo(UserRole, { foreignKey: "roleId", as: "userRole" });

module.exports = {
  sequelize,
  User,
  BloodType,
  MedicalAid,
  UserRole,
};
