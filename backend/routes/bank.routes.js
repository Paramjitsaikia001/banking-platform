const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bank.controller');
const { auth, verifyPin } = require('../middleware/auth.middleware');

// All bank routes are protected by authentication
router.use(auth);

// Bank account management
router.post('/accounts', bankController.addBankAccount); // Create a new bank account
router.get('/accounts', bankController.getBankAccounts); // Get all bank accounts for the user
router.get('/accounts/:accountId', bankController.getBankAccountById); // Get a specific bank account by ID
router.patch('/accounts/:accountId', bankController.updateBankAccount); // Update a bank account (e.g., set as default, change status)
router.delete('/accounts/:accountId', bankController.deleteBankAccount); // Delete a bank account

// Fund transfers (requires PIN verification)
router.post('/transfer-to-bank', verifyPin, bankController.transferToBank); // Transfer from wallet to bank
router.post('/transfer-from-bank', verifyPin, bankController.transferFromBank); // Transfer from bank to wallet

module.exports = router;
