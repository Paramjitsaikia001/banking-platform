// backend/routes/wallet.routes.js
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { protect, verifyPin } = require('../middleware/auth.middleware');

// All wallet routes are protected
router.use(protect);

// Get wallet balance
router.get('/balance', walletController.getBalance);

// Add money (mock payment)
router.post('/add', walletController.addMoney);

// Transfer money (requires PIN)
router.post('/transfer', verifyPin, walletController.transferMoney);

// Get transaction history
router.get('/transactions', walletController.getTransactions);

module.exports = router;