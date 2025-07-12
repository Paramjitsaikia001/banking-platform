const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model'); // Added User model for recipient details

// Helper function for consistent error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Get wallet balance for the authenticated user
// @route   GET /api/wallet/balance
// @access  Private (auth required)
exports.getBalance = asyncHandler(async (req, res) => {
    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
        return res.status(404).json({
            status: 'error',
            message: 'Wallet not found for this user.',
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Wallet balance retrieved successfully.',
        data: {
            balance: wallet.balance,
            currency: wallet.currency,
        },
    });
});

// @desc    Add money to wallet (mock card/bank/UPI payment)
// @route   POST /api/wallet/add-money
// @access  Private (auth required)
exports.addMoney = asyncHandler(async (req, res) => {
    const { amount, paymentMethod, transactionRef } = req.body; // Added transactionRef for external payments

    if (!amount || amount <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide a valid amount.',
        });
    }

    if (!paymentMethod) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide a payment method (e.g., card, bank, UPI).',
        });
    }

    // In a real application, you would integrate with a payment gateway here
    // and verify the transactionRef. For now, we'll simulate success.

    const session = await Wallet.startSession();
    session.startTransaction();

    try {
        const wallet = await Wallet.findOne({ userId: req.user._id }).session(session);

        if (!wallet) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'error',
                message: 'Wallet not found for this user.',
            });
        }

        wallet.balance += amount;
        await wallet.save({ session });

        // Create transaction record
        const transaction = await Transaction.create(
            [{
                userId: req.user._id,
                type: 'deposit',
                amount: amount,
                currency: wallet.currency,
                description: `Added money to wallet via ${paymentMethod}`,
                status: 'completed',
                metadata: {
                    paymentMethod: paymentMethod,
                    externalTransactionRef: transactionRef // Store external reference if applicable
                },
            }],
            { session }
        );

        // Create notification
        await Notification.create(
            [{
                userId: req.user._id,
                title: 'Money Added',
                message: `₹${amount} has been added to your wallet successfully.`,
                type: 'transaction',
                metadata: {
                    transactionId: transaction[0]._id,
                    amount,
                    icon: 'money-plus',
                },
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            status: 'success',
            message: 'Money added to wallet successfully.',
            data: {
                newBalance: wallet.balance,
                transaction: transaction[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Re-throw to be caught by asyncHandler or global error handler
    }
});

// @desc    Transfer money from one wallet to another (user to user)
// @route   POST /api/wallet/transfer
// @access  Private (auth & verifyPin required)
// NOTE: This now handles general wallet-to-wallet transfers, including UPI-like.
// QR payments can also use this or be a wrapper around this.
exports.transferMoney = asyncHandler(async (req, res) => {
    const { recipientIdentifier, amount, description, pin } = req.body; // recipientIdentifier can be userId, phoneNumber, or upiId

    if (!recipientIdentifier || !amount || amount <= 0 || !pin) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide recipient, valid amount, and PIN.',
        });
    }

    // Verify PIN using the middleware's `req.user`
    const user = await User.findById(req.user._id).select('+pin'); // Select PIN explicitly
    if (!user || !(await user.verifyPin(pin))) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid PIN.',
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
                message: 'Sender wallet not found.',
            });
        }

        if (senderWallet.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient balance in your wallet.',
            });
        }

        // Find recipient's user and wallet based on identifier
        let recipientUser;
        if (mongoose.Types.ObjectId.isValid(recipientIdentifier)) {
            recipientUser = await User.findById(recipientIdentifier).session(session);
        } else if (recipientIdentifier.includes('@')) {
            recipientUser = await User.findOne({ upiId: recipientIdentifier }).session(session);
        } else {
            recipientUser = await User.findOne({ phoneNumber: recipientIdentifier }).session(session);
        }

        if (!recipientUser) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'error',
                message: 'Recipient not found. Please check the identifier.',
            });
        }

        // Prevent sending to self
        if (req.user._id.toString() === recipientUser._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                status: 'error',
                message: 'Cannot transfer money to yourself.',
            });
        }

        const recipientWallet = await Wallet.findOne({ userId: recipientUser._id }).session(session);
        if (!recipientWallet) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'error',
                message: 'Recipient wallet not found. Please ensure the recipient has an active wallet.',
            });
        }

        // Update wallets
        senderWallet.balance -= amount;
        recipientWallet.balance += amount;

        await senderWallet.save({ session });
        await recipientWallet.save({ session });

        // Create transaction record for sender
        const senderTransaction = await Transaction.create([{
            userId: req.user._id,
            type: 'transfer',
            amount: -amount, // Negative for outgoing
            currency: senderWallet.currency,
            description: description || `Transfer to ${recipientUser.firstName} ${recipientUser.lastName}`,
            status: 'completed',
            metadata: {
                recipient: {
                    userId: recipientUser._id,
                    name: `${recipientUser.firstName} ${recipientUser.lastName}`,
                    phone: recipientUser.phoneNumber,
                    email: recipientUser.email,
                },
                paymentMethod: 'wallet', // Or 'upi' if using upiId
            }
        }], { session });

        // Create transaction record for recipient
        const recipientTransaction = await Transaction.create([{
            userId: recipientUser._id,
            type: 'transfer',
            amount: amount, // Positive for incoming
            currency: recipientWallet.currency,
            description: description || `Received from ${req.user.firstName} ${req.user.lastName}`,
            status: 'completed',
            metadata: {
                recipient: { // This metadata describes the *sender* from the recipient's perspective
                    userId: req.user._id,
                    name: `${req.user.firstName} ${req.user.lastName}`,
                    phone: req.user.phoneNumber,
                    email: req.user.email,
                },
                paymentMethod: 'wallet', // Or 'upi' if using upiId
            }
        }], { session });

        // Create notifications
        await Notification.create([{
            userId: req.user._id,
            title: 'Money Sent',
            message: `₹${amount} sent to ${recipientUser.firstName} ${recipientUser.lastName}.`,
            type: 'transaction',
            metadata: {
                transactionId: senderTransaction[0]._id,
                amount,
                icon: 'money-send',
            },
        }], { session });

        await Notification.create([{
            userId: recipientUser._id,
            title: 'Money Received',
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
            message: 'Money transferred successfully.',
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
});
