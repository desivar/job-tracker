const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    "string.base": "Username must be text",
    "string.alphanum": "Username must only contain alpha-numeric characters",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot be longer than 30 characters",
    "string.empty": "Username is required",
    "any.required": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters long",
    "string.max": "First name cannot be longer than 50 characters",
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters long",
    "string.max": "Last name cannot be longer than 50 characters",
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  role: Joi.string()
    .valid("admin", "recruiter", "hiring_manager", "applicant")
    .default("applicant")
    .messages({
      "any.only":
        "Role must be either admin, recruiter, hiring_manager, or applicant",
    }),
  department: Joi.string()
    .min(2)
    .max(50)
    .when("role", {
      is: Joi.valid("recruiter", "admin"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.min": "Department must be at least 2 characters long",
      "string.max": "Department cannot be longer than 50 characters",
      "any.required": "Department is required for recruiters and admins",
    }),
  position: Joi.string()
    .min(2)
    .max(50)
    .when("role", {
      is: Joi.valid("recruiter", "hiring_manager"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.min": "Position must be at least 2 characters long",
      "string.max": "Position cannot be longer than 50 characters",
      "string.empty": "Position is required for recruiters and hiring managers",
      "any.required": "Position is required for recruiters and hiring managers",
    }),
  company: Joi.string()
    .min(2)
    .max(50)
    .when("role", {
      is: Joi.valid("recruiter", "hiring_manager"),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "string.min": "Company must be at least 2 characters long",
      "string.max": "Company cannot be longer than 50 characters",
      "string.empty": "Company is required for recruiters and hiring managers",
      "any.required": "Company is required for recruiters and hiring managers",
    }),
  resume: Joi.string().allow("").optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  experience: Joi.number().min(0).optional().messages({
    "number.base": "Experience must be a number",
    "number.min": "Experience cannot be negative",
  }),
}).options({ abortEarly: false, stripUnknown: true });

const passwordResetSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)
    .required()
    .messages({
      "string.min": "New password must be at least 6 characters long",
      "string.empty": "New password is required",
      "any.required": "New password is required",
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, and one number",
    })
    .invalid(Joi.ref("currentPassword"))
    .messages({
      "any.invalid": "New password must be different from current password",
    }),
});

module.exports = {
  loginSchema,
  registerSchema,
  passwordResetSchema,
  changePasswordSchema,
};
