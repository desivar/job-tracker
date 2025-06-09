// backend/routes/user.js

const express = require("express");
const router = express.Router();
const userCon = require("../controllers/user"); // Your controller import
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for authentication

// --- Public Routes (typically for unauthenticated access) ---
// User registration
router.post("/register", userCon.createUser); // Assuming createUser is for registration and is public

// --- Protected Routes (require authentication) ---
// GET all users (typically for admin views, requires auth)
router.get("/", authMiddleware, userCon.getAllUsers);

// Get the currently logged-in user's profile
// This route MUST be placed BEFORE the /:id route,
// otherwise '/me' would be incorrectly interpreted as an ID.
router.get('/me', authMiddleware, userCon.getLoggedInUserProfile);

// GET user by ID (for admin viewing specific users, requires auth)
router.get("/:id", authMiddleware, userCon.getUserById);

// PUT update user by ID (requires auth)
router.put("/:id", authMiddleware, userCon.updateUser);

// DELETE user by ID (requires auth)
router.delete("/:id", authMiddleware, userCon.deleteUser);


module.exports = router;