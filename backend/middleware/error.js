const ErrorResponse = require("../utils/errorResponse");

// Custom error class for API errors
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error details:", {
    name: err.name,
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method,
  });

  if (process.env.NODE_ENV === "development") {
    console.error("Stack trace:", err.stack);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new APIError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists`;
    error = new APIError(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new APIError(message.join(", "), 400);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new APIError("Invalid token", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new APIError("Token expired", 401);
  }

  // Default error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  });
};

// 404 error handler for undefined routes
const notFound = (req, res, next) => {
  const error = new APIError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

// Async handler wrapper to eliminate try-catch blocks
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  APIError,
  errorHandler,
  notFound,
  asyncHandler,
};
