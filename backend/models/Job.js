const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "remote"],
      default: "full-time",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: String,
      required: [true, "Job requirements are required"],
    },
    salary: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter is required"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
    },
    applicationDeadline: {
      type: Date,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: String,
      enum: ["entry", "mid", "senior", "lead", "executive"],
      default: "mid",
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    pipeline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pipeline",
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
jobSchema.index({ title: "text", description: "text", company: "text" });
jobSchema.index({ status: 1, applicationDeadline: 1 });
jobSchema.index({ recruiter: 1 });

module.exports = mongoose.model("Job", jobSchema);
