const Customer = require("../models/Customer");
const asyncHandler = require("express-async-handler");

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await Customer.find({ createdBy: req.user._id })
    .populate("createdBy", "username email")
    .sort("-createdAt");

  res.status(200).json(customers);
});

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  }).populate("createdBy", "username email");

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.status(200).json(customer);
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, address, company, notes, tags } =
    req.body;

  // Check if customer with email already exists for this user
  const customerExists = await Customer.findOne({
    email,
    createdBy: req.user._id,
  });

  if (customerExists) {
    res.status(400);
    throw new Error("Customer with this email already exists");
  }

  const customer = await Customer.create({
    firstName,
    lastName,
    email,
    phone,
    address,
    company,
    notes,
    tags,
    createdBy: req.user._id,
  });

  res.status(201).json(customer);
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  // Check if email is being changed and if it's already taken
  if (req.body.email && req.body.email !== customer.email) {
    const emailExists = await Customer.findOne({
      email: req.body.email,
      createdBy: req.user._id,
      _id: { $ne: customer._id },
    });

    if (emailExists) {
      res.status(400);
      throw new Error("Email already in use by another customer");
    }
  }

  const updatedCustomer = await Customer.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  ).populate("createdBy", "username email");

  res.status(200).json(updatedCustomer);
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  });

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  await customer.deleteOne();
  res.status(200).json({ message: "Customer removed successfully" });
});

// @desc    Get customer statistics
// @route   GET /api/customers/stats
// @access  Private
exports.getCustomerStats = asyncHandler(async (req, res) => {
  const stats = await Customer.aggregate([
    { $match: { createdBy: req.user._id } },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        activeCustomers: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
        inactiveCustomers: {
          $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalCustomers: 1,
        activeCustomers: 1,
        inactiveCustomers: 1,
      },
    },
  ]);

  res.status(200).json(
    stats[0] || {
      totalCustomers: 0,
      activeCustomers: 0,
      inactiveCustomers: 0,
    }
  );
});
