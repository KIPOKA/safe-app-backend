// routes/userRoutes.js
const express = require("express");
const userController = require("../controller/user-controller");

const router = express.Router();

// Auth routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

// Profile routes
router.put("/update-profile", userController.updateProfile);

// User management routes
router.get("/", userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);

// Delete user route
router.delete("/delete", userController.deleteUserByEmail);

module.exports = router;
