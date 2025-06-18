const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Customer = require("../models/Customer");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  try {
    const [
      totalCustomers,
      totalJobs,
      activeJobs,
      completedJobs,
      totalApplicants,
    ] = await Promise.all([
      Customer.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ status: "open" }),
      Job.countDocuments({ status: "closed" }),
      User.countDocuments({ role: "applicant" }),
    ]);

    // Get total applications count if the Application model exists
    let totalApplications = 0;
    try {
      totalApplications = await Application.countDocuments();
    } catch (error) {
      console.log("Application model not available:", error.message);
    }

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalJobs,
        activeJobs,
        completedJobs,
        totalApplicants,
        totalApplications,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Get recent activities
// @route   GET /api/dashboard/activities
// @access  Private
exports.getRecentActivities = asyncHandler(async (req, res) => {
  try {
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "firstName lastName");

    let activities = recentJobs.map((job) => ({
      type: "job",
      title: job.title,
      description: `New job posted${
        job.createdBy
          ? ` by ${job.createdBy.firstName} ${job.createdBy.lastName}`
          : ""
      }`,
      date: job.createdAt,
    }));

    // Try to get recent applications if the model exists
    try {
      const recentApplications = await Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("applicant", "firstName lastName")
        .populate("job", "title");

      const applicationActivities = recentApplications.map((app) => ({
        type: "application",
        title: app.job.title,
        description: `New application from ${app.applicant.firstName} ${app.applicant.lastName}`,
        date: app.createdAt,
      }));

      activities = [...activities, ...applicationActivities];
    } catch (error) {
      console.log("Application model not available:", error.message);
    }

    // Sort all activities by date
    activities.sort((a, b) => b.date - a.date);
    activities = activities.slice(0, 5);

    res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// @desc    Get job statistics
// @route   GET /api/dashboard/job-stats
// @access  Private
exports.getJobStats = asyncHandler(async (req, res) => {
  try {
    const jobsByType = await Job.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    let applicationsByStage = [];
    try {
      applicationsByStage = await Application.aggregate([
        {
          $group: {
            _id: "$stage",
            count: { $sum: 1 },
          },
        },
      ]);
    } catch (error) {
      console.log("Application model not available:", error.message);
    }

    const jobsByMonth = await Job.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 6 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        jobsByType,
        applicationsByStage,
        jobsByMonth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
