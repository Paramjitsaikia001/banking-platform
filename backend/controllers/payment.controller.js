const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

// Process QR code payment
exports.processQRPayment = async (req, res) => {
    try {
        const { recipientId, amount, pin } = req.body;

        if (!recipientId || !amount || !pin) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide recipient ID, amount, and PIN',
            });
        }

        // Verify PIN (in a real app, this would be more secure)
        if (pin !== '1234') { // Replace with actual PIN verification
            return res.status(401).json({
                status: 'error',
                message: 'Invalid PIN',
            });
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
                return res.status(404).json({
                    status: 'error',
                    message: 'Sender wallet not found',
                });
            }

            // Check if sender has sufficient balance
            if (senderWallet.balance < amount) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    status: 'error',
                    message: 'Insufficient balance',
                });
            }

            // Find recipient
            const recipient = await User.findById(recipientId).session(session);
            if (!recipient) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    status: 'error',
                    message: 'Recipient not found',
                });
            }

            // Find recipient's wallet
            const recipientWallet = await Wallet.findOne({ userId: recipientId }).session(session);

            if (!recipientWallet) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    status: 'error',
                    message: 'Recipient wallet not found',
                });
            }

            // Update wallets
            senderWallet.balance -= amount;
            recipientWallet.balance += amount;

            await senderWallet.save({ session });
            await recipientWallet.save({ session });

            // Create transaction record for sender
            const senderTransaction = await Transaction.create(
                [
                    {
                        userId: req.user._id,
                        type: 'transfer',
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
                            paymentMethod: 'qr',
                        },
                    },
                ],
                { session }
            );

            // Create transaction record for recipient
            const recipientTransaction = await Transaction.create(
                [
                    {
                        userId: recipient._id,
                        type: 'transfer',
                        amount,
                        currency: recipientWallet.currency,
                        description: `QR Payment from ${req.user.firstName} ${req.user.lastName}`,
                        status: 'completed',
                        metadata: {
                            recipient: {
                                userId: req.user._id,
                                name: `${req.user.firstName} ${req.user.lastName}`,
                                phone: req.user.phoneNumber,
                                email: req.user.email,
                            },
                            paymentMethod: 'qr',
                        },
                    },
                ],
                { session }
            );

            // Create notifications
            await Notification.create(
                [
                    {
                        userId: req.user._id,
                        title: 'Payment Sent',
                        message: `₹${amount} sent to ${recipient.firstName} ${recipient.lastName}`,
                        type: 'transaction',
                        metadata: {
                            transactionId: senderTransaction[0]._id,
                            amount,
                            icon: 'money-send',
                        },
                    },
                ],
                { session }
            );

            await Notification.create(
                [
                    {
                        userId: recipient._id,
                        title: 'Payment Received',
                        message: `₹${amount} received from ${req.user.firstName} ${req.user.lastName}`,
                        type: 'transaction',
                        metadata: {
                            transactionId: recipientTransaction[0]._id,
                            amount,
                            icon: 'money-receive',
                        },
                    },
                ],
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({
                status: 'success',
                message: 'Payment processed successfully',
                data: {
                    newBalance: senderWallet.balance,
                    transaction: senderTransaction[0],
                },
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
}; 