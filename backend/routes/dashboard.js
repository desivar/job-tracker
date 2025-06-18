const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/error");
const mongodb = require("../db/database");
const ObjectId = require("mongodb").ObjectId;
const {
  getDashboardStats,
  getRecentActivities,
  getJobStats,
} = require("../controllers/dashboard");

// Get dashboard statistics
router.get("/stats", protect, getDashboardStats);

// Get job trends (last 7 days)
router.get(
  "/job-trends",
  protect,
  asyncHandler(async (req, res) => {
    const db = mongodb.getDatabase().db();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const jobs = await db
      .collection("jobs")
      .find({
        createdAt: { $gte: sevenDaysAgo },
      })
      .toArray();

    // Group jobs by date
    const trends = jobs.reduce((acc, job) => {
      const date = new Date(job.createdAt).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Fill in missing dates with 0
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      result.unshift({
        date: dateStr,
        count: trends[dateStr] || 0,
      });
    }

    res.json(result);
  })
);

// Get pipeline statistics
router.get(
  "/pipeline-stats",
  protect,
  asyncHandler(async (req, res) => {
    const db = mongodb.getDatabase().db();

    const pipeline = [
      {
        $group: {
          _id: "$pipeline_step",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          stage: "$_id",
          count: 1,
        },
      },
    ];

    const stats = await db.collection("jobs").aggregate(pipeline).toArray();

    res.json(stats);
  })
);

router.get("/activities", protect, getRecentActivities);
router.get("/job-stats", protect, getJobStats);

module.exports = router;
