const Contact = require('../models/contact');
const { HttpError, CtrlWrapper } = require('../utils');

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite = false } = req.params;
  const queryObject = favorite ? { owner, favorite } : { owner };
  const skip = (page - 1) * limit;
  const allContacts = await Contact.find(queryObject, '-createdAt -updatedAt', { skip, limit }).populate(
    'owner',
    'name email'
  );
  res.status(200).json(allContacts);
};

const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

const deleteContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json({ message: 'contact deleted' });
};

const addNewContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateContactById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw HttpError(404, 'Not found');
  }
  res.status(200).json(result);
};

module.exports = {
  getAllContacts: CtrlWrapper(getAllContacts),
  getContactById: CtrlWrapper(getContactById),
  deleteContactById: CtrlWrapper(deleteContactById),
  addNewContact: CtrlWrapper(addNewContact),
  updateContactById: CtrlWrapper(updateContactById),
  updateFavorite: CtrlWrapper(updateFavorite),
};
