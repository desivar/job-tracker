const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  try {
    console.log("Registration request body:", req.body);

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      department,
      position,
      company,
      resume,
      skills,
      experience,
    } = req.body;

    // Create user with required fields
    const userData = {
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || "applicant",
    };

    console.log("Initial user data:", userData);

    // Add conditional required fields based on role
    if (role === "recruiter" || role === "admin") {
      if (!department) {
        res.status(400);
        throw new Error("Department is required for recruiters and admins");
      }
      userData.department = department;
    }

    if (role === "recruiter" || role === "hiring_manager") {
      if (!position) {
        res.status(400);
        throw new Error(
          "Position is required for recruiters and hiring managers"
        );
      }
      if (!company) {
        res.status(400);
        throw new Error(
          "Company is required for recruiters and hiring managers"
        );
      }
      userData.position = position;
      userData.company = company;
    }

    // Add optional fields if they exist
    if (resume) userData.resume = resume;
    if (skills) userData.skills = skills;
    if (experience) userData.experience = experience;

    console.log("Final user data before creation:", userData);

    // Create user
    const user = await User.create(userData);

    console.log("User created successfully:", user);

    // Generate token
    const token = user.generateToken();

    console.log("Token generated successfully");

    // Send response
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          position: user.position,
          company: user.company,
          permissions: user.permissions,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      console.error("Validation error messages:", messages);
      res.status(400);
      throw new Error(messages.join(". "));
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.error("Duplicate key error for field:", field);
      res.status(400);
      throw new Error(`${field} already exists`);
    }

    res.status(400);
    throw new Error(error.message || "Registration failed");
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide an email and password");
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log(`Login attempt failed: No user found with email ${email}`);
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log(`Login attempt failed: Invalid password for email ${email}`);
      res.status(401);
      throw new Error("Invalid credentials");
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Generate token
    const token = user.generateToken();

    // Verify the token before sending
    const decoded = jwt.verify(token, config.jwtSecret);
    if (!decoded || !decoded.id) {
      throw new Error("Token generation failed");
    }

    // Send response
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          permissions: user.permissions,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(error.status || 500);
    throw new Error(error.message || "Login failed");
  }
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });

  if (!user) {
    res.status(404);
    throw new Error("No user found with this email address");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token expires in 10 minutes
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  // In a real application, you would send an email with the reset token
  res.status(200).json({
    status: "success",
    message: "Password reset instructions sent to email",
    resetToken, // Remove this in production
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  // Get hashed token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  // Set new password and clear reset token
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.failedLoginAttempts = 0;
  user.active = true;
  user.accountLockedAt = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password reset successful",
    token: user.generateAuthToken(),
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");

  // Verify current password
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  // Update password
  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
    token: user.generateAuthToken(),
  });
});
