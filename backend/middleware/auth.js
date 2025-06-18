const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const config = require("../config/config");

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token provided");
      }

      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      if (!decoded || !decoded.id) {
        res.status(401);
        throw new Error("Invalid token format");
      }

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      res.status(401);
      if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      } else if (error.name === "TokenExpiredError") {
        throw new Error("Token expired");
      } else {
        throw new Error("Not authorized");
      }
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // Flatten roles array in case it's passed as an array of arrays
    const allowedRoles = roles.flat();

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role ${
          req.user ? req.user.role : "unknown"
        } is not authorized to access this route`
      );
    }
    next();
  };
};

// Admin authorization
const authorizeAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to perform this action");
  }
  next();
});

// Role authorization
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role ${
          req.user ? req.user.role : "unknown"
        } is not authorized to perform this action`
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
  generateToken,
  authorizeAdmin,
  authorizeRoles,
};
