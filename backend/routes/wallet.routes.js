const express = require('express');
const router = express.Router();
const { auth, verifyPin } = require('../middleware/auth.middleware'); // Import verifyPin
const walletController = require('../controllers/wallet.controller'); // Import walletController

// All routes are protected by authentication
router.use(auth);

// Initialize wallet for new user
router.post('/initialize', auth, async (req, res) => {
    try {
        // Check if wallet already exists
        let wallet = await Wallet.findOne({ userId: req.user._id });

        if (!wallet) {
            // Check for required user fields
            if (!req.user.firstName || !req.user.lastName) {
                return res.status(400).json({ message: 'User is missing firstName or lastName. Please update your profile.' });
            }
            // Create new wallet for user
            wallet = await Wallet.createWalletForUser(req.user._id);
        }

        res.json({
            message: 'Wallet initialized successfully',
            balance: wallet.balance,
            upiId: wallet.upiId
        });
    } catch (error) {
        res.status(500).json({ message: 'Error initializing wallet', error: error.message });
    }
});

// Get wallet balance
router.get('/balance', walletController.getBalance);

// Add money to wallet (requires authentication)
router.post('/add-money', walletController.addMoney);

// Transfer money to another user's wallet (requires PIN verification)
router.post('/transfer', verifyPin, walletController.transferMoney); // Added verifyPin middleware

// Removed: router.get('/transactions') - This is now handled by /api/transactions route

module.exports = router;
