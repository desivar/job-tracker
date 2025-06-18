const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc    Register user
// @route   POST /api/users/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (userExists) {
    res.status(400);
    throw new Error(
      userExists.email === email.toLowerCase()
        ? "Email already registered"
        : "Username already taken"
    );
  }

  // Create user
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    role: role || "applicant",
    active: true,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token: user.generateAuthToken(),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Create new user (Admin only)
// @route   POST /api/users/create
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (userExists) {
    res.status(400);
    throw new Error(
      userExists.email === email.toLowerCase()
        ? "Email already registered"
        : "Username already taken"
    );
  }

  // Create user
  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    role,
    active: true,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if email is being changed and if it's already taken
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
  }

  // Check if username is being changed and if it's already taken
  if (req.body.username && req.body.username !== user.username) {
    const usernameExists = await User.findOne({
      username: req.body.username.toLowerCase(),
    });
    if (usernameExists) {
      res.status(400);
      throw new Error("Username already in use");
    }
  }

  user.username = req.body.username?.toLowerCase() || user.username;
  user.email = req.body.email?.toLowerCase() || user.email;
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    role: updatedUser.role,
    token: updatedUser.generateAuthToken(),
  });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort("-createdAt");
  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if email is being changed and if it's already taken
  if (req.body.email && req.body.email !== user.email) {
    const emailExists = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use");
    }
  }

  // Check if username is being changed and if it's already taken
  if (req.body.username && req.body.username !== user.username) {
    const usernameExists = await User.findOne({
      username: req.body.username.toLowerCase(),
    });
    if (usernameExists) {
      res.status(400);
      throw new Error("Username already in use");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username?.toLowerCase() || user.username,
        email: req.body.email?.toLowerCase() || user.email,
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        role: req.body.role || user.role,
      },
    },
    { new: true, runValidators: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.status(200).json({ message: "User removed successfully" });
});
