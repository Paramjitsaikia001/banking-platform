// backend/routes/wallet.routes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');

// Initialize wallet for new user
router.post('/initialize', auth, async (req, res) => {
    try {
        // Check if wallet already exists
        let wallet = await Wallet.findOne({ userId: req.user._id });

        if (!wallet) {
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
router.get('/balance', auth, async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        res.json({ balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wallet balance', error: error.message });
    }
});

// Add money to wallet
router.post('/add-money', auth, async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // In a real application, you would process the payment here
        // For now, we'll just update the balance
        wallet.balance += amount;
        await wallet.save();

        // Create transaction record
        const transaction = await Transaction.create({
            userId: req.user._id,
            walletId: wallet._id,
            type: 'wallet_add',
            amount: amount,
            description: `Added money via ${paymentMethod}`,
            status: 'completed'
        });

        res.json({
            message: 'Money added successfully',
            newBalance: wallet.balance,
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding money', error: error.message });
    }
});

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        const transactions = await Transaction.find({
            walletId: wallet._id
        })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
});

// Transfer money to another wallet
router.post('/transfer', auth, async (req, res) => {
    try {
        const { recipientUpiId, amount, description } = req.body;
        if (!recipientUpiId || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid recipient or amount' });
        }

        const senderWallet = await Wallet.findOne({ userId: req.user._id });
        if (!senderWallet) {
            return res.status(404).json({ message: 'Sender wallet not found' });
        }

        if (senderWallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const recipientWallet = await Wallet.findOne({ upiId: recipientUpiId });
        if (!recipientWallet) {
            return res.status(404).json({ message: 'Recipient wallet not found' });
        }

        // Start a session for transaction safety
        const session = await Wallet.startSession();
        session.startTransaction();

        try {
            // Update sender's balance
            senderWallet.balance -= amount;
            await senderWallet.save({ session });

            // Update recipient's balance
            recipientWallet.balance += amount;
            await recipientWallet.save({ session });

            // Create transaction records for both sender and recipient
            const senderTransaction = await Transaction.create({
                userId: req.user._id,
                walletId: senderWallet._id,
                type: 'wallet_transfer',
                amount: -amount,
                description: description || `Transfer to ${recipientUpiId}`,
                status: 'completed',
                recipientDetails: {
                    upiId: recipientUpiId
                }
            });

            const recipientTransaction = await Transaction.create({
                userId: recipientWallet.userId,
                walletId: recipientWallet._id,
                type: 'wallet_transfer',
                amount: amount,
                description: description || `Received from ${senderWallet.upiId}`,
                status: 'completed',
                recipientDetails: {
                    upiId: senderWallet.upiId
                }
            });

            await session.commitTransaction();
            session.endSession();

            res.json({
                message: 'Transfer successful',
                newBalance: senderWallet.balance,
                transaction: senderTransaction
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: 'Error processing transfer', error: error.message });
    }
});

module.exports = router;