const { Sequelize, DataTypes } = require("sequelize");
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

// Import models
const User = require("./User")(sequelize);
const BloodType = require("./BloodType")(sequelize);
const MedicalAid = require("./MedicalAid")(sequelize);
const UserRole = require("./UserRole")(sequelize);
const EmergencyContact = require("./EmergencyContact")(sequelize);
const UserCredentials = require("./UserCredentials")(sequelize);
const Notification = require("./Notification")(sequelize);
const EmergencyType = require("./EmergencyType")(sequelize);
const NotificationStatus = require("./NotificationStatus")(sequelize);
const MessageSolution = require("./MessageSolution")(sequelize); // initialize with sequelize

// ==================== Associations ==================== //

// User associations
User.belongsTo(BloodType, { foreignKey: "bloodTypeId", as: "bloodType" });
User.belongsTo(MedicalAid, { foreignKey: "medicalAidId", as: "medicalAid" });
User.belongsTo(UserRole, { foreignKey: "roleId", as: "userRole" });
User.hasOne(UserCredentials, { foreignKey: "userId", as: "credentials" });
User.hasMany(Notification, {
  foreignKey: "fromUserId",
  as: "userNotifications",
});
User.hasMany(EmergencyContact, {
  foreignKey: "userId",
  as: "emergencyContacts",
});

// EmergencyContact associations
EmergencyContact.belongsTo(User, { foreignKey: "userId", as: "user" });

// UserCredentials associations
UserCredentials.belongsTo(User, { foreignKey: "userId", as: "user" });

// Notification associations
Notification.belongsTo(User, { foreignKey: "fromUserId", as: "user" });
Notification.belongsTo(EmergencyType, {
  foreignKey: "emergencyTypeId",
  as: "emergencyType",
});
Notification.belongsTo(NotificationStatus, {
  foreignKey: "statusId",
  as: "status",
});

// EmergencyType associations
EmergencyType.hasMany(Notification, {
  foreignKey: "emergencyTypeId",
  as: "emergencyTypeNotifications",
});

// NotificationStatus associations
NotificationStatus.hasMany(Notification, {
  foreignKey: "statusId",
  as: "notifications",
});

// ==================== MessageSolution associations ==================== //
// Each notification can have **one or many resolution messages**
MessageSolution.belongsTo(Notification, {
  foreignKey: "notificationId",
  as: "notification",
});
Notification.hasMany(MessageSolution, {
  foreignKey: "notificationId",
  as: "solutions",
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  BloodType,
  MedicalAid,
  UserRole,
  EmergencyContact,
  UserCredentials,
  Notification,
  EmergencyType,
  NotificationStatus,
  MessageSolution,
};
