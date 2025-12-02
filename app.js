require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const rootRoutes = require("./routes/rootRoutes");
const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const app = express();

app.use(bodyParser.json());

//Root route to check server status
app.use("/", rootRoutes);
app.use("/health", healthRoutes);

// Auth routes
app.use("/auth", authRoutes);
app.use("/users", authenticateToken, userRoutes);
app.use("/reports", authenticateToken, reportRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
