const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { auth } = require('../middleware/auth.middleware');

// All routes are protected
router.use(auth);

// Transaction routes
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/stats', transactionController.getTransactionStats);
router.get('/:id', transactionController.getTransaction);

module.exports = router; 