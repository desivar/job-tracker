// backend/routes/user.js

const express = require("express");
const router = express.Router(); // <--- FIX 1: Change this line to express.Router()
const userCon = require("../controllers/user");
const authMiddleware = require("../middleware/authMiddleware");

// --- Public Routes ---
router.post("/register", userCon.createUser);

// --- Protected Routes ---
// GET all users (typically for admin views, requires auth)
router.get("/", authMiddleware.protect, userCon.getAllUsers); // <--- FIX 2: Add .protect
// Get the currently logged-in user's profile
router.get('/me', authMiddleware.protect, userCon.getLoggedInUserProfile); // <--- FIX 2: Add .protect
// GET user by ID (for admin viewing specific users, requires auth)
router.get("/:id", authMiddleware.protect, userCon.getUserById); // <--- FIX 2: Add .protect
// PUT update user by ID (requires auth)
router.put("/:id", authMiddleware.protect, userCon.updateUser); // <--- FIX 2: Add .protect
// DELETE user by ID (requires auth)
router.delete("/:id", authMiddleware.protect, userCon.deleteUser); // <--- FIX 2: Add .protect


module.exports = router;