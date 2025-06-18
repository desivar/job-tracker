const asyncHandler = require("express-async-handler");
const Application = require("../models/Application");

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
exports.createApplication = asyncHandler(async (req, res) => {
  const application = await Application.create({
    ...req.body,
    applicant: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: application,
  });
});

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
exports.getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({
    applicant: req.user._id,
  }).populate("job", "title company");

  res.status(200).json({
    status: "success",
    results: applications.length,
    data: applications,
  });
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    applicant: req.user._id,
  }).populate("job", "title company");

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  res.status(200).json({
    status: "success",
    data: application,
  });
});

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
exports.updateApplication = asyncHandler(async (req, res) => {
  let application = await Application.findOne({
    _id: req.params.id,
    applicant: req.user._id,
  });

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  application = await Application.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("job", "title company");

  res.status(200).json({
    status: "success",
    data: application,
  });
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    applicant: req.user._id,
  });

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  await application.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
