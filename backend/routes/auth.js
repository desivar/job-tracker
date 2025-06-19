// const express = require("express");
// const router = express.Router();

// const { register, login, getMe, logout } = require("../controllers/auth");
// const { protect } = require("../middleware/auth");
// const validate = require("../middleware/validate");
// const {
//   loginSchema,
//   registerSchema,
//   passwordResetSchema,
//   changePasswordSchema,
// } = require("../validations/auth.validation");

// // Public routes
// router.post("/register", validate(registerSchema), register);
// router.post("/login", validate(loginSchema), login);

// // Protected routes
// router.get("/me", protect, getMe);
// router.get("/logout", protect, logout);

// module.exports = router;
