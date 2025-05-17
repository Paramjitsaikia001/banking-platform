const Transaction = require('../models/transaction.model');
const BankAccount = require('../models/bankAccount.model');

// Create new transaction
exports.createTransaction = async (req, res) => {
    try {
        const { accountId, type, amount, description, recipientDetails } = req.body;

        // Find the account
        const account = await BankAccount.findOne({
            _id: accountId,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        // Check sufficient balance for withdrawals and transfers
        if (['withdrawal', 'transfer'].includes(type) && account.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create transaction
        const transaction = new Transaction({
            userId: req.user._id,
            accountId,
            type,
            amount,
            description,
            recipientDetails,
            reference: Math.random().toString(36).substring(2, 15)
        });

        // Update account balance
        if (type === 'deposit') {
            account.balance += amount;
        } else if (type === 'withdrawal') {
            account.balance -= amount;
        }

        // Save both transaction and updated account balance
        await Promise.all([transaction.save(), account.save()]);

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
};

// Get all transactions for current user
exports.getTransactions = async (req, res) => {
    try {
        const { accountId, type, startDate, endDate } = req.query;

        const query = { userId: req.user._id };

        if (accountId) query.accountId = accountId;
        if (type) query.type = type;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .populate('accountId', 'accountNumber accountType');

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
};

// Get single transaction
exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('accountId', 'accountNumber accountType');

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction', error: error.message });
    }
};

// Get transaction statistics
exports.getTransactionStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = { userId: req.user._id };
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const stats = await Transaction.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction statistics', error: error.message });
    }
}; 