const {
  User,
  BloodType,
  MedicalAid,
  UserRole,
  EmergencyContact,
  UserCredentials,
} = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ==================== AUTHENTICATION METHODS ====================

// Register User

exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if email already exists in credentials table
    const existingCredentials = await UserCredentials.findOne({
      where: { email },
    });
    if (existingCredentials) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Create user profile
    const user = await User.create({ fullName });
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user credentials
    await UserCredentials.create({
      userId: user.id,
      email,
      password: hashedPassword,
    });

    const responseUser = user.toJSON();
    res.status(201).json({
      message: "User registered successfully",
      user: responseUser,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "User registration failed" });
  }
};

// Login User

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find credentials
    const credentials = await UserCredentials.findOne({ where: { email } });
    if (!credentials)
      return res.status(404).json({ error: "Invalid credentials" });

    // Compare passwords
    const validPassword = await bcrypt.compare(password, credentials.password);
    if (!validPassword)
      return res.status(401).json({ error: "Invalid credentials" });

    // Fetch associated user profile
    const user = await User.findOne({
      where: { id: credentials.userId },
      include: [
        { model: BloodType, as: "bloodType", attributes: ["id", "type"] },
        {
          model: MedicalAid,
          as: "medicalAid",
          attributes: ["id", "name", "type"],
        },
        { model: UserRole, as: "userRole", attributes: ["id", "roleName"] },
        { model: EmergencyContact, as: "emergencyContacts" },
      ],
    });

    if (!user) return res.status(404).json({ error: "User profile not found" });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email, role: user.userRole?.roleName || "user" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    const responseUser = user.toJSON();
    delete responseUser.password;

    res.json({
      message: "Login successful",
      token,
      user: responseUser,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  const { email } = req.body;
  const {
    cellNumber,
    address,
    bloodType,
    allergies,
    conditions,
    medicalAid,
    userRole,
    emergencyContacts,
  } = req.body;

  try {
    // 1️⃣ Find credentials by email
    const credentials = await UserCredentials.findOne({ where: { email } });
    if (!credentials) return res.status(404).json({ error: "User not found" });

    // 2️⃣ Get userId from credentials
    const userId = credentials.userId;

    // 3️⃣ Find the actual user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: "User profile not found" });

    // Update fields as before...
    let bloodTypeId = null;
    if (bloodType) {
      const bt = await BloodType.findOne({ where: { type: bloodType } });
      if (!bt)
        return res
          .status(400)
          .json({ error: `Blood type '${bloodType}' not found` });
      bloodTypeId = bt.id;
    }

    let medicalAidId = null;
    if (medicalAid) {
      const ma = await MedicalAid.findOne({ where: { name: medicalAid } });
      if (!ma)
        return res
          .status(400)
          .json({ error: `Medical aid '${medicalAid}' not found` });
      medicalAidId = ma.id;
    }

    let roleId = null;
    if (userRole) {
      const role = await UserRole.findOne({ where: { roleName: userRole } });
      if (!role)
        return res.status(400).json({ error: `Role '${userRole}' not found` });
      roleId = role.id;
    }

    await user.update({
      cellNumber,
      address,
      bloodTypeId,
      allergies,
      conditions,
      medicalAidId,
      roleId,
    });

    // Handle emergency contacts
    if (Array.isArray(emergencyContacts)) {
      await EmergencyContact.destroy({ where: { userId: user.id } });
      const contactsToCreate = emergencyContacts.map((c) => ({
        name: c.name,
        phone: c.phone,
        relation: c.relation,
        userId: user.id,
      }));
      await EmergencyContact.bulkCreate(contactsToCreate);
    }

    const updatedUser = await User.findOne({
      where: { id: user.id },
      include: [
        { model: BloodType, as: "bloodType", attributes: ["id", "type"] },
        {
          model: MedicalAid,
          as: "medicalAid",
          attributes: ["id", "name", "type"],
        },
        { model: UserRole, as: "userRole", attributes: ["id", "roleName"] },
        { model: EmergencyContact, as: "emergencyContacts" },
      ],
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: UserCredentials,
          as: "credentials",
          attributes: ["email"],
        },
        { model: BloodType, as: "bloodType", attributes: ["id", "type"] },
        {
          model: MedicalAid,
          as: "medicalAid",
          attributes: ["id", "name", "type"],
        },
        { model: UserRole, as: "userRole", attributes: ["id", "roleName"] },
        { model: EmergencyContact, as: "emergencyContacts" },
      ],
    });

    const responseJSON = users.map((u) => {
      const user = u.toJSON();
      // Optionally flatten the email for convenience
      user.email = user.credentials?.email || null;
      delete user.credentials;
      return user;
    });

    res.json({ users: responseJSON });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// In user-controller.js
exports.getUserByEmail = async (req, res) => {
  const { email } = req.params; // or req.query.email

  try {
    // Find credentials first
    const credentials = await UserCredentials.findOne({ where: { email } });
    if (!credentials) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user profile
    const user = await User.findOne({
      where: { id: credentials.userId },
      include: [
        { model: BloodType, as: "bloodType", attributes: ["id", "type"] },
        {
          model: MedicalAid,
          as: "medicalAid",
          attributes: ["id", "name", "type"],
        },
        { model: UserRole, as: "userRole", attributes: ["id", "roleName"] },
        { model: EmergencyContact, as: "emergencyContacts" },
      ],
    });

    if (!user) return res.status(404).json({ error: "User profile not found" });

    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: "Failed to get user" });
  }
};

exports.deleteUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Find user credentials
    const credentials = await UserCredentials.findOne({ where: { email } });
    if (!credentials) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = credentials.userId;

    // 2️⃣ Delete emergency contacts
    await EmergencyContact.destroy({ where: { userId } });

    // 3️⃣ Delete user profile
    await User.destroy({ where: { id: userId } });

    // 4️⃣ Delete credentials
    await UserCredentials.destroy({ where: { id: credentials.id } });

    res.json({ message: `User with email ${email} deleted successfully` });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
