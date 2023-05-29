const express = require('express');
const ctrl = require('../../controllers/contacts');
const { contactsSchema } = require('../../schemas');
const { validateBody } = require('../../middlewares');

const router = express.Router();

router.get('/', ctrl.getAllContacts);

router.get('/:contactId', ctrl.getContactById);

router.post('/', validateBody(contactsSchema), ctrl.addNewContact);

router.delete('/:contactId', ctrl.deleteContactById);

router.put('/:contactId', validateBody(contactsSchema), ctrl.updateContactById);

module.exports = router;
