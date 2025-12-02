const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/users", reportController.generateUsersReport);

module.exports = router;
