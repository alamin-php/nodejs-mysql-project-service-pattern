const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Health check endpoint
router.get("/", async (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  let databaseStatus = "disconnected";
  let userCount = 0;

  try {
    // DB check
    await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) as count FROM users", (err, results) => {
        if (err) return reject(err);
        databaseStatus = "connected";
        userCount = results[0].count; // ✅ get correct value
        resolve();
      });
    });

    res.json({
      status: "ok",
      uptime: `${Math.floor(uptime)} seconds`,
      database: databaseStatus,
      totalUsers: userCount,
      memoryUsage,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      uptime: `${Math.floor(uptime)} seconds`,
      database: databaseStatus,
      totalUsers: userCount,
      memoryUsage,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
