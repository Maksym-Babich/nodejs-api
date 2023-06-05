const express = require('express');
const ctrl = require('../../controllers/contacts');
const { addContactSchema, updateContactSchema } = require('../../schemas');
const { validateBody } = require('../../middlewares');

const router = express.Router();

router.get('/', ctrl.getAllContacts);

router.get('/:contactId', ctrl.getContactById);

router.post('/', validateBody(addContactSchema), ctrl.addNewContact);

router.delete('/:contactId', ctrl.deleteContactById);

router.put('/:contactId', validateBody(updateContactSchema), ctrl.updateContactById);

module.exports = router;
