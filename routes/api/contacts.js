const express = require('express');
const ctrl = require('../../controllers/contacts');
const { addContactSchema, updateContactSchema, updateFavoriteSchema } = require('../../schemas');
const { validateBody, isValidId } = require('../../middlewares');

const router = express.Router();

router.get('/', ctrl.getAllContacts);

router.get('/:contactId', isValidId, ctrl.getContactById);

router.post('/', validateBody(addContactSchema), ctrl.addNewContact);

router.delete('/:contactId', isValidId, ctrl.deleteContactById);

router.put('/:contactId', isValidId, validateBody(updateContactSchema), ctrl.updateContactById);

router.patch('/:contactId/favorite', isValidId, validateBody(updateFavoriteSchema), ctrl.updateFavorite);

module.exports = router;
