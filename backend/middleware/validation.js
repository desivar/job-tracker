const Joi = require("joi");

// User validation schema
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  role: Joi.string().valid("admin", "user").default("user"),
});

// Customer validation schema
const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+?[\d\s-()]{10,}$/)
    .required(),
  address: Joi.string().max(200).required(),
  notes: Joi.string().max(1000).allow("", null),
});

// Job validation schema
const jobSchema = Joi.object({
  customer_id: Joi.string().required(),
  pipeline_id: Joi.string().required(),
  pipeline_step: Joi.string().required(),
  job_name: Joi.string().min(3).max(100).required(),
  comments: Joi.string().max(1000).allow("", null),
  address: Joi.string().max(200).required(),
});

// Pipeline validation schema
const pipelineSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  steps: Joi.array().items(Joi.string()).min(1).required(),
  description: Joi.string().max(500).allow("", null),
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.details[0].message,
      });
    }
    next();
  };
};

module.exports = {
  validateUser: validate(userSchema),
  validateCustomer: validate(customerSchema),
  validateJob: validate(jobSchema),
  validatePipeline: validate(pipelineSchema),
};
