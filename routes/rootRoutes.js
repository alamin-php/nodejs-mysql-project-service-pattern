const express = require("express");
const router = express.Router();

// Root check endpoint
router.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

module.exports = router;
