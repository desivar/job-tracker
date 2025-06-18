const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/dashboard.controller");

router.get("/stats", protect, getDashboardStats);

module.exports = router;
