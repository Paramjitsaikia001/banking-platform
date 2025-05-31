const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth.middleware');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');

// Process QR code payment
router.post('/qr', auth, async (req, res) => {
    try {
        const { recipientId, amount, pin } = req.body;

        if (!recipientId || !amount || !pin) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify PIN (in a real application, this would be more secure)
        const user = await User.findById(req.user._id).select('+pin');
        if (!user || !(await user.verifyPin(pin))) {
            return res.status(401).json({ message: 'Invalid PIN' });
        }

        // Find sender's wallet
        const senderWallet = await Wallet.findOne({ userId: req.user._id });
        if (!senderWallet) {
            return res.status(404).json({ message: 'Sender wallet not found' });
        }

        if (senderWallet.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Find recipient and their wallet
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const recipientWallet = await Wallet.findOne({ userId: recipientId });
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
                type: 'qr_payment',
                amount: -amount,
                description: `Payment to ${recipient.firstName} ${recipient.lastName}`,
                status: 'completed',
                recipientDetails: {
                    name: `${recipient.firstName} ${recipient.lastName}`,
                    upiId: recipientWallet.upiId
                }
            });

            const recipientTransaction = await Transaction.create({
                userId: recipientId,
                walletId: recipientWallet._id,
                type: 'qr_payment',
                amount: amount,
                description: `Received from ${user.firstName} ${user.lastName}`,
                status: 'completed',
                recipientDetails: {
                    name: `${user.firstName} ${user.lastName}`,
                    upiId: senderWallet.upiId
                }
            });

            await session.commitTransaction();
            session.endSession();

            res.json({
                message: 'Payment successful',
                newBalance: senderWallet.balance,
                transaction: senderTransaction
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
});

module.exports = router; 