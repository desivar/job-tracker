const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
  getApplicationHistory,
} = require("../controllers/profile");

const { protect } = require("../middleware/auth");

router
  .route("/users/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.route("/upload/resume").post(protect, uploadResume);

router.route("/applications/me").get(protect, getApplicationHistory);

module.exports = router;
