const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadResume,
  getApplicationHistory,
} = require("../controllers/profile");



router
  .route("/users/profile")
  .get( getProfile)
  .put( updateProfile);

router.route("/upload/resume").post( uploadResume);

router.route("/applications/me").get( getApplicationHistory);

module.exports = router;
