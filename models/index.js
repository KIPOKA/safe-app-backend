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
const MessageSolution = require("./MessageSolution")(sequelize);
const Location = require("./Location")(sequelize);
const Service = require("./Service")(sequelize);
const ServiceType = require("./ServiceType")(sequelize);
const ChatMessage = require("./ChatMessage")(sequelize);
const History = require("./History")(sequelize);

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

// ==================== Location associations ==================== //
// Each Notification has ONE Location
Notification.belongsTo(Location, {
  foreignKey: "locationId",
  as: "location",
});

// A Location can have MANY Notifications
Location.hasMany(Notification, {
  foreignKey: "locationId",
  as: "notifications",
});

// ==================== Service Associations ==================== //
// Each Service belongs to a ServiceType
Service.belongsTo(ServiceType, { foreignKey: "serviceTypeId", as: "type" });
ServiceType.hasMany(Service, { foreignKey: "serviceTypeId", as: "services" });

// Each Service is linked to a Notification (solving that emergency)
Service.belongsTo(Notification, {
  foreignKey: "notificationId",
  as: "notification",
});
Notification.hasMany(Service, { foreignKey: "notificationId", as: "services" });

// ==================== ChatMessage Associations ==================== //
// Each ChatMessage belongs to a Notification
ChatMessage.belongsTo(Notification, {
  foreignKey: "notificationId",
  as: "notification",
});

// A Notification can have many ChatMessages
Notification.hasMany(ChatMessage, {
  foreignKey: "notificationId",
  as: "chatMessages",
});

// ==================== History Associations ==================== //
// Each history record belongs to a Notification
History.belongsTo(Notification, {
  foreignKey: "notificationId",
  as: "notification",
});

// A Notification can have many history records
Notification.hasMany(History, {
  foreignKey: "notificationId",
  as: "histories",
});
// A Notification can have many history records

History.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(History, { foreignKey: "userId", as: "histories" });

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
  Location,
  ChatMessage,
  History,
};
