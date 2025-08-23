const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize
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
const EmergencyContact = require("./EmergencyContact")(sequelize);
const UserCredentials = require("./UserCredentials")(sequelize);
// Define associations

// User associations
User.belongsTo(BloodType, { foreignKey: "bloodTypeId", as: "bloodType" });
User.belongsTo(MedicalAid, { foreignKey: "medicalAidId", as: "medicalAid" });
User.belongsTo(UserRole, { foreignKey: "roleId", as: "userRole" });
User.hasOne(UserCredentials, { foreignKey: "userId", as: "credentials" });

// Emergency contacts
User.hasMany(EmergencyContact, {
  foreignKey: "userId",
  as: "emergencyContacts",
});
EmergencyContact.belongsTo(User, { foreignKey: "userId", as: "user" });
UserCredentials.belongsTo(User, { foreignKey: "userId", as: "user" });

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  BloodType,
  MedicalAid,
  UserRole,
  EmergencyContact,
  UserCredentials,
};
