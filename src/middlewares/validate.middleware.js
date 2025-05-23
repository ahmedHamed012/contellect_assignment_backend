const {
  contactValidationSchema,
} = require("./../modules/Contact/validation/contact.validation");

const validateContact = (req, res, next) => {
  const { error } = contactValidationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((d) => d.message),
    });
  }
  next();
};

module.exports = {
  validateContact,
};
