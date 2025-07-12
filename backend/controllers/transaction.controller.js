const Transaction = require('../models/transaction.model');
const BankAccount = require('../models/bankAccount.model');
const Wallet = require('../models/wallet.model'); // Added Wallet model
const Notification = require('../models/notification.model'); // Added Notification model

// Helper function for consistent error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private (auth required)
// NOTE: This controller is for general transaction creation.
// For bank-to-wallet or wallet-to-bank transfers, use bank.controller.js.
exports.createTransaction = asyncHandler(async (req, res) => {
    const { type, amount, description, recipientDetails, paymentMethod, bankAccount: bankAccountMetadata } = req.body;
    const userId = req.user._id;

    if (!type || !amount || amount <= 0 || !paymentMethod) {
        return res.status(400).json({ message: 'Missing required fields: type, amount, paymentMethod.' });
    }

    // Determine the source/target for balance update based on paymentMethod
    let sourceEntity;
    let targetEntity;
    let currentBalanceField; // To hold 'balance' or 'mockBalance' if it existed

    const session = await Transaction.startSession();
    session.startTransaction();

    try {
        if (paymentMethod === 'wallet') {
            sourceEntity = await Wallet.findOne({ userId }).session(session);
            if (!sourceEntity) {
                return res.status(404).json({ message: 'Wallet not found for this user.' });
            }
            currentBalanceField = 'balance';
        } else if (paymentMethod === 'bank' && bankAccountMetadata && bankAccountMetadata.accountNumber) {
            // If transacting directly with a bank account (e.g., a direct deposit/withdrawal not via wallet)
            sourceEntity = await BankAccount.findOne({ userId, accountNumber: bankAccountMetadata.accountNumber }).session(session);
            if (!sourceEntity) {
                return res.status(404).json({ message: 'Bank account not found for this user.' });
            }
            currentBalanceField = 'balance'; // Using 'balance' as per updated model
        } else {
            // Handle other payment methods or missing bank account details
            return res.status(400).json({ message: 'Invalid payment method or missing bank account details for bank payment.' });
        }

        // Check sufficient balance for withdrawals and transfers from the source entity
        if (['withdrawal', 'transfer', 'billPayment', 'recharge'].includes(type) && sourceEntity[currentBalanceField] < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Insufficient balance for this transaction.' });
        }

        // Update source entity balance
        if (type === 'deposit') {
            sourceEntity[currentBalanceField] += amount;
        } else if (['withdrawal', 'transfer', 'billPayment', 'recharge'].includes(type)) {
            sourceEntity[currentBalanceField] -= amount;
        }
        await sourceEntity.save({ session });

        // Handle recipient balance for transfers (if applicable, e.g., wallet to wallet)
        if (type === 'transfer' && recipientDetails && recipientDetails.userId) {
            targetEntity = await Wallet.findOne({ userId: recipientDetails.userId }).session(session);
            if (targetEntity) {
                targetEntity.balance += amount;
                await targetEntity.save({ session });
            }
        }

        // Create transaction
        const transaction = new Transaction({
            userId,
            type,
            amount: (['withdrawal', 'transfer', 'billPayment', 'recharge'].includes(type) ? -amount : amount), // Store as negative for outgoing
            currency: sourceEntity.currency,
            description,
            status: 'completed', // Assuming immediate completion for simplicity
            metadata: {
                recipient: recipientDetails,
                bankAccount: bankAccountMetadata,
                paymentMethod: paymentMethod,
                // Add other metadata fields as needed for bill payments, recharge etc.
            }
        });

        await transaction.save({ session });

        // Create notification for the user who initiated the transaction
        await Notification.create(
            [{
                userId: req.user._id,
                title: `Transaction ${type.charAt(0).toUpperCase() + type.slice(1)} Completed`,
                message: `Your transaction of ₹${amount} for ${description || type} was successful.`,
                type: 'transaction',
                metadata: {
                    transactionId: transaction._id,
                    amount,
                    icon: type === 'deposit' ? 'money-plus' : 'money-minus', // Dynamic icon
                },
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            status: 'success',
            message: 'Transaction created successfully.',
            data: {
                transaction,
                newBalance: sourceEntity[currentBalanceField]
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Re-throw to be caught by global error handler
    }
});

// @desc    Get all transactions for the current user
// @route   GET /api/transactions
// @access  Private (auth required)
exports.getTransactions = asyncHandler(async (req, res) => {
    const { type, startDate, endDate, limit = 10, skip = 0 } = req.query;

    const query = { userId: req.user._id };

    if (type) query.type = type;
    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

    const totalTransactions = await Transaction.countDocuments(query);

    res.status(200).json({
        status: 'success',
        message: 'Transactions retrieved successfully.',
        data: {
            transactions,
            total: totalTransactions,
            limit: parseInt(limit),
            skip: parseInt(skip)
        }
    });
});

// @desc    Get a single transaction by ID for the current user
// @route   GET /api/transactions/:id
// @access  Private (auth required)
exports.getTransaction = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
        _id: id,
        userId: req.user._id
    });

    if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found or you do not have access to it.' });
    }

    res.status(200).json({
        status: 'success',
        message: 'Transaction retrieved successfully.',
        data: {
            transaction
        }
    });
});

// @desc    Get transaction statistics for the current user
// @route   GET /api/transactions/stats
// @access  Private (auth required)
exports.getTransactionStats = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const matchQuery = { userId: req.user._id };
    if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
        if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }

    const stats = await Transaction.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$type',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0, // Exclude _id
                type: '$_id',
                totalAmount: 1,
                count: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        message: 'Transaction statistics retrieved successfully.',
        data: {
            stats
        }
    });
});
