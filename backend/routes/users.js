// backend/routes/user.js

const express = require("express");
const router = express.Router();
const { protect, authorizeRoles } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { registerSchema } = require("../validations/auth.validation");

const {
  register,
  createUser,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/users");

// Public routes
router.post("/register", validate(registerSchema), register);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin only routes
router.post(
  "/create",
  protect,
  authorizeRoles("admin"),
  validate(registerSchema),
  createUser
);
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin"), getUserById);
router.put("/:id", protect, authorizeRoles("admin"), updateUser);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;
