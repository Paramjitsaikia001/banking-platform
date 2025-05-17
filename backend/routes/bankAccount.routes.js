const express = require('express');
const router = express.Router();
const bankAccountController = require('../controllers/bankAccount.controller');
const auth = require('../middleware/auth.middleware');

// All routes are protected
router.use(auth);

// Bank account routes
router.post('/', bankAccountController.createAccount);
router.get('/', bankAccountController.getAccounts);
router.get('/:id', bankAccountController.getAccount);
router.patch('/:id', bankAccountController.updateAccount);
router.delete('/:id', bankAccountController.deleteAccount);

module.exports = router; 