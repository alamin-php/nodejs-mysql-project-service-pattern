require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const app = express();

app.use(bodyParser.json());

// Auth routes
app.use("/auth", authRoutes);
app.use("/users", authenticateToken, userRoutes);
app.use("/reports", authenticateToken, reportRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
