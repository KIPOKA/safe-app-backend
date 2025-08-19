// routes/userRoutes.js
const express = require("express");
const userController = require("../controller/user-controller");

const router = express.Router();

// Auth routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/profile", userController.updateProfile);
router.get("/", userController.getAllUsers);

module.exports = router;   
