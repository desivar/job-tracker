// backend/routes/user.js

const express = require("express");
const router = express.Router();

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
router.get("/profile",  getProfile);
router.put("/profile",  updateProfile);

// Admin only routes
router.post(
  "/create",
  
  
  validate(registerSchema),
  createUser
);
router.get("/",   getAllUsers);
router.get("/:id",   getUserById);
router.put("/:id",   updateUser);
router.delete("/:id",   deleteUser);

module.exports = router;
