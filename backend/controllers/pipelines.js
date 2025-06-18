const Pipeline = require("../models/Pipeline");
const asyncHandler = require("express-async-handler");

// @desc    Create a new pipeline
// @route   POST /api/pipelines
// @access  Private
const createPipeline = asyncHandler(async (req, res) => {
  req.body.owner = req.user.id;

  // Add creator as admin team member
  req.body.team = [
    {
      user: req.user.id,
      role: "admin",
    },
  ];

  const pipeline = await Pipeline.create(req.body);
  res.status(201).json({ success: true, data: pipeline });
});

// @desc    Get all pipelines
// @route   GET /api/pipelines
// @access  Private
const getPipelines = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      { owner: req.user.id },
      { "team.user": req.user.id },
      { isTemplate: true },
    ],
  };

  if (req.query.status) {
    query.status = req.query.status;
  }

  const pipelines = await Pipeline.find(query)
    .populate("owner", "firstName lastName")
    .populate("team.user", "firstName lastName")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: pipelines.length,
    data: pipelines,
  });
});

// @desc    Get single pipeline
// @route   GET /api/pipelines/:id
// @access  Private
const getPipeline = asyncHandler(async (req, res) => {
  const pipeline = await Pipeline.findById(req.params.id)
    .populate("owner", "firstName lastName")
    .populate("team.user", "firstName lastName");

  if (!pipeline) {
    res.status(404);
    throw new Error("Pipeline not found");
  }

  // Check if user has access
  const hasAccess =
    pipeline.owner.equals(req.user.id) ||
    pipeline.team.some((member) => member.user.equals(req.user.id)) ||
    pipeline.isTemplate;

  if (!hasAccess) {
    res.status(401);
    throw new Error("Not authorized to access this pipeline");
  }

  res.status(200).json({ success: true, data: pipeline });
});

// @desc    Update pipeline
// @route   PUT /api/pipelines/:id
// @access  Private
const updatePipeline = asyncHandler(async (req, res) => {
  let pipeline = await Pipeline.findById(req.params.id);

  if (!pipeline) {
    res.status(404);
    throw new Error("Pipeline not found");
  }

  // Check if user has edit access
  const hasEditAccess =
    pipeline.owner.equals(req.user.id) ||
    pipeline.team.some(
      (member) =>
        member.user.equals(req.user.id) &&
        ["admin", "editor"].includes(member.role)
    );

  if (!hasEditAccess) {
    res.status(401);
    throw new Error("Not authorized to update this pipeline");
  }

  pipeline = await Pipeline.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("owner", "firstName lastName")
    .populate("team.user", "firstName lastName");

  res.status(200).json({ success: true, data: pipeline });
});

// @desc    Delete pipeline
// @route   DELETE /api/pipelines/:id
// @access  Private
const deletePipeline = asyncHandler(async (req, res) => {
  const pipeline = await Pipeline.findById(req.params.id);

  if (!pipeline) {
    res.status(404);
    throw new Error("Pipeline not found");
  }

  // Check if user is owner or admin
  const isOwnerOrAdmin =
    pipeline.owner.equals(req.user.id) ||
    pipeline.team.some(
      (member) => member.user.equals(req.user.id) && member.role === "admin"
    );

  if (!isOwnerOrAdmin) {
    res.status(401);
    throw new Error("Not authorized to delete this pipeline");
  }

  await pipeline.remove();

  res.status(200).json({ success: true, data: {} });
});

module.exports = {
  createPipeline,
  getPipelines,
  getPipeline,
  updatePipeline,
  deletePipeline,
};
