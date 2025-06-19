const express = require("express");
const router = express.Router();

const { uploadResume } = require("../controllers/upload.controller");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// @route   POST /api/upload/resume
// @desc    Upload a resume
// @access  Private
router.post("/resume",  uploadResume);

// @route   GET /api/upload/resumes/:filename
// @desc    Get uploaded file
// @access  Private
router.get("/resumes/:filename",  (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "error",
      message: "File not found",
    });
  }

  // Send the file
  res.sendFile(filePath);
});

module.exports = router;
