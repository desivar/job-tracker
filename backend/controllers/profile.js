const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json({ success: true, data: user });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    title: req.body.title,
    bio: req.body.bio,
    skills: req.body.skills,
    experience: req.body.experience,
    education: req.body.education,
    socialLinks: req.body.socialLinks,
    preferences: req.body.preferences,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  }).select("-password");

  // Increment version to invalidate existing tokens
  user.version += 1;
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
    token: user.generateToken(),
  });
});

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private
exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.resume) {
    res.status(400);
    throw new Error("Please upload a resume file");
  }

  const file = req.files.resume;

  // Make sure the file is a PDF
  if (file.mimetype !== "application/pdf") {
    res.status(400);
    throw new Error("Please upload a PDF file");
  }

  // Create custom filename
  const fileName = `resume_${req.user.id}_${Date.now()}${
    path.parse(file.name).ext
  }`;

  // Move file to upload directory
  file.mv(`./uploads/resumes/${fileName}`, async (err) => {
    if (err) {
      console.error(err);
      res.status(500);
      throw new Error("Problem with file upload");
    }

    // Update user profile with resume URL
    await User.findByIdAndUpdate(req.user.id, {
      resume: `/uploads/resumes/${fileName}`,
    });

    res.status(200).json({
      success: true,
      data: fileName,
    });
  });
});

// @desc    Get application history
// @route   GET /api/applications/me
// @access  Private
exports.getApplicationHistory = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user.id })
    .populate({
      path: "job",
      select: "title company location type",
      populate: {
        path: "recruiter",
        select: "firstName lastName",
      },
    })
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});
