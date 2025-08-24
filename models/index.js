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

// Import models
const User = require("./User")(sequelize);
const BloodType = require("./BloodType")(sequelize);
const MedicalAid = require("./MedicalAid")(sequelize);
const UserRole = require("./UserRole")(sequelize);
const EmergencyContact = require("./EmergencyContact")(sequelize);
const UserCredentials = require("./UserCredentials")(sequelize);
const Notification = require("./Notification")(sequelize);
const EmergencyType = require("./EmergencyType")(sequelize);

// User associations
User.belongsTo(BloodType, { foreignKey: "bloodTypeId", as: "bloodType" });
User.belongsTo(MedicalAid, { foreignKey: "medicalAidId", as: "medicalAid" });
User.belongsTo(UserRole, { foreignKey: "roleId", as: "userRole" });
User.hasOne(UserCredentials, { foreignKey: "userId", as: "credentials" });
const NotificationStatus = require("./NotificationStatus")(sequelize);

// ==================== Associations ==================== //
User.hasMany(Notification, {
  foreignKey: "fromUserId",
  as: "userNotifications",
});
User.hasMany(EmergencyContact, {
  foreignKey: "userId",
  as: "emergencyContacts",
});

// Emergency contacts
EmergencyContact.belongsTo(User, { foreignKey: "userId", as: "user" });

// UserCredentials
UserCredentials.belongsTo(User, { foreignKey: "userId", as: "user" });

// Notifications associations
Notification.belongsTo(User, { foreignKey: "fromUserId", as: "user" });
Notification.belongsTo(EmergencyType, {
  foreignKey: "emergencyTypeId",
  as: "emergencyType",
});

// EmergencyType associations
EmergencyType.hasMany(Notification, {
  foreignKey: "emergencyTypeId",
  as: "emergencyTypeNotifications",
});

// Notification → Status

Notification.belongsTo(NotificationStatus, {
  foreignKey: "statusId",
  as: "status",
});
NotificationStatus.hasMany(Notification, {
  foreignKey: "statusId",
  as: "notifications",
});

// ====================================================== //

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
};
