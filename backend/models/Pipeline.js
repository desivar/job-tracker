const mongoose = require("mongoose");

const pipelineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Pipeline name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stages: [
      {
        name: {
          type: String,
          required: [true, "Stage name is required"],
          trim: true,
        },
        order: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Pipeline owner is required"],
    },
    team: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["viewer", "editor", "admin"],
          default: "viewer",
        },
      },
    ],
    isTemplate: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure stages are ordered correctly
pipelineSchema.pre("save", function (next) {
  this.stages.sort((a, b) => a.order - b.order);
  next();
});

// Index for searching
pipelineSchema.index({ name: "text", description: "text" });
pipelineSchema.index({ owner: 1, status: 1 });
pipelineSchema.index({ "team.user": 1 });

module.exports = mongoose.model("Pipeline", pipelineSchema);
