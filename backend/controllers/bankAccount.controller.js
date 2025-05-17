const BankAccount = require('../models/bankAccount.model');

// Create new bank account
exports.createAccount = async (req, res) => {
    try {
        const { accountType, currency } = req.body;

        // Generate a random account number (in production, use a more secure method)
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        const account = new BankAccount({
            userId: req.user._id,
            accountNumber,
            accountType,
            currency,
            balance: 0
        });

        await account.save();

        res.status(201).json({
            message: 'Bank account created successfully',
            account
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating bank account', error: error.message });
    }
};

// Get all accounts for current user
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await BankAccount.find({ userId: req.user._id });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching accounts', error: error.message });
    }
};

// Get single account
exports.getAccount = async (req, res) => {
    try {
        const account = await BankAccount.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.json(account);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching account', error: error.message });
    }
};

// Update account
exports.updateAccount = async (req, res) => {
    try {
        const { isDefault } = req.body;

        const account = await BankAccount.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (isDefault) {
            // Set all other accounts to non-default
            await BankAccount.updateMany(
                { userId: req.user._id, _id: { $ne: account._id } },
                { isDefault: false }
            );
        }

        account.isDefault = isDefault;
        await account.save();

        res.json({
            message: 'Account updated successfully',
            account
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating account', error: error.message });
    }
};

// Delete account
exports.deleteAccount = async (req, res) => {
    try {
        const account = await BankAccount.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        if (account.balance > 0) {
            return res.status(400).json({ message: 'Cannot delete account with remaining balance' });
        }

        await account.remove();

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error: error.message });
    }
}; 