const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { HandleMongooseError } = require('../utils');

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: String,
  },
  { vesrsionKey: false, timestamps: true }
);

userSchema.post('save', HandleMongooseError);

const registerSchema = Joi.object({ password: Joi.string().required(), email: Joi.string().required() });
const loginSchema = Joi.object({ password: Joi.string().required(), email: Joi.string().required() });

const schemas = {
  registerSchema,
  loginSchema,
};

const User = model('user', userSchema);

module.exports = { User, schemas };
