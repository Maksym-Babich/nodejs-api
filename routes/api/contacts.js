const express = require('express');
const contacts = require('../../models/contacts');
const HttpError = require('../../utils/HttpError');
const Joi = require('joi');

const router = express.Router();
const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get('/', async (_, res) => {
  const allContacts = await contacts.listContacts();
  res.status(200).json(allContacts);
});

router.get('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
});

router.post('/', async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(204).send();
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const { error } = schema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const result = await contacts.updateContact(contactId, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
});

module.exports = router;
