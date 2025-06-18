const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job is required"],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Applicant is required"],
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "interview",
        "offered",
        "rejected",
        "accepted",
      ],
      default: "pending",
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    resume: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    interviewDate: Date,
    interviewNotes: String,
    offerDetails: {
      salary: Number,
      benefits: String,
      startDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
