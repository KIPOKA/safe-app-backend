const {User} = require("../models");
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

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const responseUser = user.toJSON();
    delete responseUser.password;

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

    // FIXED: Changed from User.find to User.findOne
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
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
  const { id } = req.user || req.body; // ⚠️ depends on JWT middleware
  const {
    cellNumber,
    address,
    emergencyContactName,
    emergencyContactPhone,
    bloodType,
    allergies,
    conditions,
    medicalAid,
    userRole,
  } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    await user.update({
      cellNumber,
      address,
      emergencyContactName,
      emergencyContactPhone,
      bloodType,
      allergies,
      conditions,
      medicalAid,
      userRole,
    });

    const responseUser = user.toJSON();
    delete responseUser.password;

    res.json({ message: "Profile updated successfully", user: responseUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Profile update failed" });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.json({ users });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};