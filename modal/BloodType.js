class BloodType {
  constructor(type, allergies = [], medicalConditions = []) {
    this.type = type; 
    this.allergies = allergies;  
    this.medicalConditions = medicalConditions;  
  }
}

module.exports = BloodType;
