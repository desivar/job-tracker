//Imports
const express = require("express");
const router = express.Router();

const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

// All routes require authentication

// @route   GET /api/jobs
// @desc    Get all jobs and create new job
// @access  Private/Recruiter/HiringManager/Admin
router.route("/").get(getJobs).post(createJob);

// @route   GET/PUT/DELETE /api/jobs/:id
// @desc    Get, update, or delete single job
// @access  Private/Recruiter/HiringManager/Admin
router.route("/:id").get(getJob).put(updateJob).delete(deleteJob);

module.exports = router;
