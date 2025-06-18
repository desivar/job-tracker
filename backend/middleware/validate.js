const validate = (schema) => (req, res, next) => {
  console.log("Validating request body:", req.body);

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    errors: {
      wrap: {
        label: "",
      },
    },
  });

  if (error) {
    console.log("Validation error:", error.details);
    const errorDetails = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
      type: detail.type,
    }));

    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errorDetails,
    });
  }

  next();
};

module.exports = validate;
