//Imports
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

// All routes require authentication
router.use(protect);

// @route   GET /api/jobs
// @desc    Get all jobs and create new job
// @access  Private/Recruiter/HiringManager/Admin
router
  .route("/")
  .get(getJobs)
  .post(authorize("recruiter", "hiring_manager", "admin"), createJob);

// @route   GET/PUT/DELETE /api/jobs/:id
// @desc    Get, update, or delete single job
// @access  Private/Recruiter/HiringManager/Admin
router
  .route("/:id")
  .get(getJob)
  .put(authorize("recruiter", "hiring_manager", "admin"), updateJob)
  .delete(authorize("recruiter", "hiring_manager", "admin"), deleteJob);

module.exports = router;
