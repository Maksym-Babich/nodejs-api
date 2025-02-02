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
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { vesrsionKey: false, timestamps: true }
);

userSchema.post('save', HandleMongooseError);

const registerSchema = Joi.object({ password: Joi.string().required(), email: Joi.string().required() });
const loginSchema = Joi.object({ password: Joi.string().required(), email: Joi.string().required() });
const updateSubSchema = Joi.object({ subscription: Joi.string().valid('starter', 'pro', 'business').required() });
const emailSchema = Joi.object({ email: Joi.string().required() });

const schemas = {
  registerSchema,
  loginSchema,
  updateSubSchema,
  emailSchema,
};

const User = model('user', userSchema);

module.exports = { User, schemas };
