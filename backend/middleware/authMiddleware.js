// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler'); // Often used for handling exceptions inside async express routes
const User = require('../db/User'); // Path adjusted based on our previous fix

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for the 'Authorization' header and if it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret'); // Use the same secret as generateToken

      // Attach user from the token payload (excluding password) to the request object
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware or route handler
    } catch (error) {
      console.error('Not authorized, token failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect };