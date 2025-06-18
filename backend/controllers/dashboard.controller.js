const asyncHandler = require("express-async-handler");
const Job = require("../models/Job");
const Application = require("../models/Application");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  let stats = {};

  if (userRole === "applicant") {
    // Get applicant stats
    const applications = await Application.find({ applicant: userId });

    stats = {
      totalApplications: applications.length,
      applicationsByStatus: {
        pending: applications.filter((app) => app.status === "pending").length,
        reviewing: applications.filter((app) => app.status === "reviewing")
          .length,
        interview: applications.filter((app) => app.status === "interview")
          .length,
        offered: applications.filter((app) => app.status === "offered").length,
        rejected: applications.filter((app) => app.status === "rejected")
          .length,
        accepted: applications.filter((app) => app.status === "accepted")
          .length,
      },
      recentApplications: await Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("job", "title company"),
    };
  } else {
    // Get recruiter/admin stats
    const jobs = await Job.find(
      userRole === "recruiter" ? { recruiter: userId } : {}
    );
    const applications = await Application.find(
      userRole === "recruiter"
        ? { job: { $in: jobs.map((job) => job._id) } }
        : {}
    );

    stats = {
      totalJobs: jobs.length,
      totalApplications: applications.length,
      applicationsByStatus: {
        pending: applications.filter((app) => app.status === "pending").length,
        reviewing: applications.filter((app) => app.status === "reviewing")
          .length,
        interview: applications.filter((app) => app.status === "interview")
          .length,
        offered: applications.filter((app) => app.status === "offered").length,
        rejected: applications.filter((app) => app.status === "rejected")
          .length,
        accepted: applications.filter((app) => app.status === "accepted")
          .length,
      },
      recentJobs: await Job.find(
        userRole === "recruiter" ? { recruiter: userId } : {}
      )
        .sort({ createdAt: -1 })
        .limit(5),
      recentApplications: await Application.find(
        userRole === "recruiter"
          ? { job: { $in: jobs.map((job) => job._id) } }
          : {}
      )
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("job", "title company")
        .populate("applicant", "firstName lastName email"),
    };
  }

  res.status(200).json({
    status: "success",
    data: stats,
  });
});
