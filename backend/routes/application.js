const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require("../controllers/application.controller");

// Application routes
router.post("/", protect, createApplication);
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplication);
router.put("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

module.exports = router;
