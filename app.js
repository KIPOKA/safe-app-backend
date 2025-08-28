const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./models");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Connect to DB and Start Server
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started on port ${PORT} and accessible on all IPs`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
