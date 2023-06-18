const { Schema, model } = require('mongoose');
const { HandleMongooseError } = require('../utils');

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { vesrsionKey: false, timestamps: true }
);

ContactSchema.post('save', HandleMongooseError);

const Contact = model('contact', ContactSchema);

module.exports = Contact;
