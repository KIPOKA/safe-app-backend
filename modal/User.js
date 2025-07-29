const BloodType = require('./BloodType');
const UserRole = require('./UserRole');

class User {
  constructor(fullName, email, cellNumber, address, emergencyContact, bloodType, userRole) {
    this.fullName = fullName;
    this.email = email;
    this.cellNumber = cellNumber;
    this.address = address;
    this.emergencyContact = emergencyContact;
    this.bloodType = bloodType instanceof BloodType ? bloodType : null;
    this.userRole = userRole instanceof UserRole ? userRole : null;
  }
}

module.exports = User;
