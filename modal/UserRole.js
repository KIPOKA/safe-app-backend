class UserRole {
  constructor(roleName, permissions = []) {
    this.roleName = roleName;  
    this.permissions = permissions;  
  }
}

module.exports = UserRole;
