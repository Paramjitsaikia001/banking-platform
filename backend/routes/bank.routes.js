// backend/routes/bank.routes.js
const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bank.controller');
const { protect, verifyPin } = require('../middleware/auth.middleware');

// All bank routes are protected
router.use(protect);

// Bank account management
router.post('/accounts', bankController.addBankAccount);
router.get('/accounts', bankController.getBankAccounts);
router.put('/accounts/:accountId/primary', bankController.setPrimaryAccount);
router.delete('/accounts/:accountId', bankController.deleteBankAccount);

// Fund transfers (requires PIN)
router.post('/transfer-to-bank', verifyPin, bankController.transferToBank);
router.post('/transfer-from-bank', verifyPin, bankController.transferFromBank);

module.exports = router;