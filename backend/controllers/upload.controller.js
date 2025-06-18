const multer = require("multer");
const path = require("path");
const fs = require("fs");
const APIError = require("../utils/APIError");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/resumes");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter to accept only certain file types
const fileFilter = (req, file, cb) => {
  console.log("File filter called with file:", file.originalname);
  const allowedTypes = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    console.log("File type accepted:", ext);
    cb(null, true);
  } else {
    console.log("File type rejected:", ext);
    cb(
      new APIError(
        "Invalid file type. Only PDF and Word documents are allowed.",
        400
      )
    );
  }
};

// Create multer upload instance
const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("resume");

// Upload controller
exports.uploadResume = (req, res, next) => {
  console.log("Upload route hit");
  uploadMiddleware(req, res, function (err) {
    console.log("Upload middleware executed");
    if (err instanceof multer.MulterError) {
      // Multer error (e.g., file too large)
      console.error("Multer error:", err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    } else if (err) {
      // Other errors
      console.error("Upload error:", err);
      return res.status(400).json({
        status: "error",
        message: err.message || "File upload failed",
      });
    }

    // Check if file exists
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({
        status: "error",
        message: "Please upload a file",
      });
    }

    console.log("File uploaded successfully:", req.file.filename);
    // Return the file URL
    const fileUrl = `/uploads/resumes/${req.file.filename}`;
    const response = {
      status: "success",
      url: fileUrl,
    };
    console.log("Sending response:", response);
    res.status(200).json(response);
  });
};
