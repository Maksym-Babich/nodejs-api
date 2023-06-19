const express = require('express');
const ctrl = require('../../controllers/contacts');
const { addContactSchema, updateContactSchema, updateFavoriteSchema } = require('../../schemas');
const { validateBody, isValidId, authenticate } = require('../../middlewares');

const router = express.Router();

router.get('/', authenticate, ctrl.getAllContacts);

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById);

router.post('/', authenticate, validateBody(addContactSchema), ctrl.addNewContact);

router.delete('/:contactId', authenticate, isValidId, ctrl.deleteContactById);

router.put('/:contactId', authenticate, isValidId, validateBody(updateContactSchema), ctrl.updateContactById);

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
