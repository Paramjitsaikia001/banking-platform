const express = require('express');
const router = express.Router();
const { auth, verifyPin } = require('../middleware/auth.middleware'); // Import verifyPin
const walletController = require('../controllers/wallet.controller'); // Import walletController

// All routes are protected by authentication
router.use(auth);

// Get wallet balance
router.get('/balance', walletController.getBalance);

// Add money to wallet (requires authentication)
router.post('/add-money', walletController.addMoney);

// Transfer money to another user's wallet (requires PIN verification)
router.post('/transfer', verifyPin, walletController.transferMoney); // Added verifyPin middleware

// Removed: router.get('/transactions') - This is now handled by /api/transactions route

module.exports = router;
