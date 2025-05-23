const Joi = require("joi");

const contactValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .required(),
  address: Joi.string().min(10).max(1000).optional(),
  notes: Joi.string().min(10).max(1000).optional(),
});

module.exports = {
  contactValidationSchema,
};
