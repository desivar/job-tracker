const Job = require("../models/Job");
const asyncHandler = require("express-async-handler");

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = asyncHandler(async (req, res) => {
  req.body.recruiter = req.user.id;
  const job = await Job.create(req.body);
  res.status(201).json({ success: true, data: job });
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const query = {};

  // Build filter object
  if (req.query.title) {
    query.$text = { $search: req.query.title };
  }
  if (req.query.company) {
    query.company = { $regex: req.query.company, $options: "i" };
  }
  if (req.query.location) {
    query.location = { $regex: req.query.location, $options: "i" };
  }
  if (req.query.type) {
    query.type = req.query.type;
  }
  if (req.query.status) {
    query.status = req.query.status;
  }
  if (req.query.experience) {
    query.experience = req.query.experience;
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const jobs = await Job.find(query)
    .populate("recruiter", "firstName lastName company")
    .skip(startIndex)
    .limit(limit)
    .sort("-createdAt");

  const total = await Job.countDocuments(query);

  res.status(200).json({
    success: true,
    count: jobs.length,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
    },
    data: jobs,
  });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "recruiter",
    "firstName lastName company"
  );

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.status(200).json({ success: true, data: job });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter, Job Owner)
const updateJob = asyncHandler(async (req, res) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Make sure user is job recruiter
  if (job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized to update this job");
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: job });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter, Job Owner)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Make sure user is job recruiter
  if (job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized to delete this job");
  }

  await job.remove();

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
};
