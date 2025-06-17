const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { protect } = require("../middleware/authMiddleware"); // If you're using authentication

// Public routes
router.post("/", userController.createUser); // Register a new user
// Add a login route if handled separately from createUser (e.g., /api/users/login)
// router.post("/login", userController.loginUser); // Assuming you have a login function

// Protected routes (example - adjust as per your requirements)
router.get("/", protect, userController.getAllUsers); // Admin only
router.get("/me", protect, userController.getLoggedInUserProfile); // Get own profile
router.get("/:id", protect, userController.getUserById); // Admin or specific logic
router.put("/:id", protect, userController.updateUser); // Admin or user updating own
router.delete("/:id", protect, userController.deleteUser); // Admin only

module.exports = router;