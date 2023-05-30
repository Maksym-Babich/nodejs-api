const Joi = require('joi');

const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).or('name', 'email', 'phone');

module.exports = updateContactSchema;
