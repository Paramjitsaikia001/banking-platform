const express = require('express');
const router = express.Router();
const { auth, verifyPin } = require('../middleware/auth.middleware'); // Import verifyPin
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model'); // Added Notification model

// Process card payment
router.post('/card-payment', auth, async (req, res) => {
    try {
        const { cardNumber, cardType, amount } = req.body;

        if (!cardNumber || !cardType || !amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find user's wallet
        const wallet = await Wallet.findOne({ userId: req.user._id });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }

        // In a real application, you would validate the card and process payment
        // For now, we'll just create a transaction record
        const transaction = await Transaction.create({
            userId: req.user._id,
            walletId: wallet._id,
            type: 'card_payment',
            amount: -amount,
            description: `Card payment - ${cardType} ending in ${cardNumber.slice(-4)}`,
            status: 'completed',
            paymentDetails: {
                cardType,
                cardNumber: cardNumber.slice(-4), // Only store last 4 digits
                amount
            }
        });

        res.json({
            message: 'Card payment processed successfully',
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing card payment', error: error.message });
    }
});

// Process QR code payment
router.post('/qr', auth, verifyPin, async (req, res) => { // Added verifyPin middleware
    try {
        const { recipientId, amount } = req.body; // PIN is now verified by middleware

        if (!recipientId || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Missing required fields: recipientId, amount' });
        }

        // Start a session for transaction safety
        const session = await Wallet.startSession();
        session.startTransaction();

        try {
            // Find sender's wallet
            const senderWallet = await Wallet.findOne({ userId: req.user._id }).session(session);
            if (!senderWallet) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Sender wallet not found' });
            }

            if (senderWallet.balance < amount) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Insufficient balance in wallet' });
            }

            // Find recipient and their wallet
            const recipient = await User.findById(recipientId).session(session);
            if (!recipient) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Recipient user not found' });
            }

            const recipientWallet = await Wallet.findOne({ userId: recipientId }).session(session);
            if (!recipientWallet) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: 'Recipient wallet not found' });
            }

            // Update sender's balance
            senderWallet.balance -= amount;
            await senderWallet.save({ session });

            // Update recipient's balance
            recipientWallet.balance += amount;
            await recipientWallet.save({ session });

            // Create transaction records for both sender and recipient
            const senderTransaction = await Transaction.create([{
                userId: req.user._id,
                type: 'transfer', // Changed from qr_payment to general 'transfer'
                amount: -amount,
                currency: senderWallet.currency,
                description: `QR Payment to ${recipient.firstName} ${recipient.lastName}`,
                status: 'completed',
                metadata: {
                    recipient: {
                        userId: recipient._id,
                        name: `${recipient.firstName} ${recipient.lastName}`,
                        phone: recipient.phoneNumber,
                        email: recipient.email,
                    },
                    paymentMethod: 'upi', // Changed from 'qr' to 'upi' as it's a UPI-like transfer
                }
            }], { session });

            const recipientTransaction = await Transaction.create([{
                userId: recipientId,
                type: 'transfer', // Changed from qr_payment to general 'transfer'
                amount: amount,
                currency: recipientWallet.currency,
                description: `Received from ${req.user.firstName} ${req.user.lastName}`,
                status: 'completed',
                metadata: {
                    recipient: { // This metadata describes the *sender* from the recipient's perspective
                        userId: req.user._id,
                        name: `${req.user.firstName} ${req.user.lastName}`,
                        phone: req.user.phoneNumber,
                        email: req.user.email,
                    },
                    paymentMethod: 'upi', // Changed from 'qr' to 'upi'
                }
            }], { session });

            // Create notifications
            await Notification.create([{
                userId: req.user._id,
                title: 'Payment Sent',
                message: `₹${amount} sent to ${recipient.firstName} ${recipient.lastName}.`,
                type: 'transaction',
                metadata: {
                    transactionId: senderTransaction[0]._id,
                    amount,
                    icon: 'money-send',
                },
            }], { session });

            await Notification.create([{
                userId: recipient._id,
                title: 'Payment Received',
                message: `₹${amount} received from ${req.user.firstName} ${req.user.lastName}.`,
                type: 'transaction',
                metadata: {
                    transactionId: recipientTransaction[0]._id,
                    amount,
                    icon: 'money-receive',
                },
            }], { session });

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({
                status: 'success',
                message: 'QR Payment processed successfully.',
                data: {
                    newBalance: senderWallet.balance,
                    transaction: senderTransaction[0],
                },
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error; // Re-throw to be caught by outer try-catch
        }
    } catch (error) {
        res.status(500).json({ message: 'Error processing QR payment', error: error.message });
    }
});

module.exports = router;
