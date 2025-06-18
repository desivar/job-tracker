const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
    },
    role: {
      type: String,
      enum: {
        values: ["applicant", "recruiter", "admin", "hiring_manager"],
        message:
          "Role must be either admin, recruiter, hiring_manager, or applicant",
      },
      default: "applicant",
    },
    department: {
      type: String,
      required: function () {
        return this.role === "recruiter" || this.role === "admin";
      },
      validate: {
        validator: function (v) {
          if (this.role === "recruiter" || this.role === "admin") {
            return v && v.length >= 2;
          }
          return true;
        },
        message:
          "Department is required for recruiters and admins and must be at least 2 characters long",
      },
    },
    position: {
      type: String,
      required: function () {
        return this.role === "recruiter" || this.role === "hiring_manager";
      },
      validate: {
        validator: function (v) {
          if (this.role === "recruiter" || this.role === "hiring_manager") {
            return v && v.length > 0;
          }
          return true;
        },
        message: "Position is required for recruiters and hiring managers",
      },
    },
    company: {
      type: String,
      required: function () {
        return this.role === "recruiter" || this.role === "hiring_manager";
      },
      validate: {
        validator: function (v) {
          if (this.role === "recruiter" || this.role === "hiring_manager") {
            return v && v.length > 0;
          }
          return true;
        },
        message: "Company is required for recruiters and hiring managers",
      },
    },
    permissions: {
      type: [String],
      default: function () {
        if (this.role === "admin") {
          return [
            "post_job",
            "edit_job",
            "delete_job",
            "view_job",
            "review_application",
            "manage_pipeline",
            "schedule_interview",
            "send_offer",
            "view_analytics",
            "manage_users",
          ];
        } else if (
          this.role === "recruiter" ||
          this.role === "hiring_manager"
        ) {
          return [
            "post_job",
            "edit_job",
            "view_job",
            "review_application",
            "manage_pipeline",
            "schedule_interview",
            "send_offer",
          ];
        } else {
          return [
            "view_job",
            "submit_application",
            "view_application_status",
            "withdraw_application",
          ];
        }
      },
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedAt: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
    lastLoginIP: {
      type: String,
    },
    resume: {
      type: String, // URL to resume file
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        from: Date,
        to: Date,
        current: Boolean,
        description: String,
      },
    ],
    passwordResetToken: String,
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
    },
    preferences: {
      jobTypes: [
        {
          type: String,
          enum: ["full-time", "part-time", "contract", "internship", "remote"],
        },
      ],
      locations: [String],
      salary: {
        min: Number,
        max: Number,
        currency: {
          type: String,
          default: "USD",
        },
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        jobAlerts: {
          type: Boolean,
          default: true,
        },
      },
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.failedLoginAttempts;
        delete ret.accountLockedAt;
        delete ret.lastLoginIP;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.active;
        return ret;
      },
    },
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.username;
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, version: this.version }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// Method to check if password was changed after token was issued
userSchema.methods.hasPasswordChangedAfterToken = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return tokenIssuedAt < changedTimestamp;
  }
  return false;
};

// Method to check if user has specific permission
userSchema.methods.hasPermission = function (permission) {
  return this.permissions.includes(permission);
};

// Static method to build indexes
userSchema.statics.buildIndexes = async function () {
  try {
    await this.collection.createIndex({ role: 1 });
    await this.collection.createIndex({ department: 1 });
    await this.collection.createIndex({
      passwordResetToken: 1,
      passwordResetExpires: 1,
    });
    console.log("User indexes built successfully");
  } catch (error) {
    console.error("Error building user indexes:", error);
    throw error;
  }
};

const User = mongoose.model("User", userSchema);

// Build indexes when the model is compiled
User.buildIndexes().catch(console.error);

module.exports = User;
