const BankAccount = require('../models/bankAccount.model');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model'); // Added User model for PIN verification

// Helper function for consistent error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// @desc    Add a new bank account
// @route   POST /api/bank/accounts
// @access  Private (auth required)
exports.addBankAccount = asyncHandler(async (req, res) => {
    const {
        bankName,
        accountHolderName,
        accountNumber,
        ifscCode,
        accountType,
        currency, // Added currency to input
        isDefault = false
    } = req.body;

    // Basic input validation
    if (!bankName || !accountHolderName || !accountNumber || !ifscCode || !accountType || !currency) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide all required fields: bankName, accountHolderName, accountNumber, ifscCode, accountType, currency.',
        });
    }

    // Check if account number already exists for this user
    const existingAccount = await BankAccount.findOne({
        userId: req.user._id,
        accountNumber,
    });

    if (existingAccount) {
        return res.status(400).json({
            status: 'error',
            message: 'Bank account with this number already exists for your user.',
        });
    }

    // Create bank account
    const bankAccount = new BankAccount({
        userId: req.user._id,
        bankName,
        accountHolderName,
        accountNumber,
        ifscCode,
        accountType,
        currency,
        isDefault,
        isVerified: false, // New accounts should typically be unverified until a process confirms them
        balance: 0 // Initial balance should be 0 unless explicitly deposited
    });

    // The pre-save hook in bankAccount.model.js will handle setting other accounts to non-default
    await bankAccount.save();

    res.status(201).json({
        status: 'success',
        message: 'Bank account added successfully. It is pending verification.',
        data: {
            bankAccount,
        },
    });
});

// @desc    Get all bank accounts for the authenticated user
// @route   GET /api/bank/accounts
// @access  Private (auth required)
exports.getBankAccounts = asyncHandler(async (req, res) => {
    const bankAccounts = await BankAccount.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        message: 'Bank accounts retrieved successfully.',
        data: {
            bankAccounts,
        },
    });
});

// @desc    Get a single bank account by ID for the authenticated user
// @route   GET /api/bank/accounts/:accountId
// @access  Private (auth required)
exports.getBankAccountById = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const bankAccount = await BankAccount.findOne({
        _id: accountId,
        userId: req.user._id
    });

    if (!bankAccount) {
        return res.status(404).json({
            status: 'error',
            message: 'Bank account not found or you do not have access to it.',
        });
    }

    res.status(200).json({
        status: 'success',
        message: 'Bank account retrieved successfully.',
        data: {
            bankAccount,
        },
    });
});

// @desc    Update a bank account (e.g., set as default, change status)
// @route   PATCH /api/bank/accounts/:accountId
// @access  Private (auth required)
exports.updateBankAccount = asyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const { isDefault, status, isVerified } = req.body; // Allow updating status and isVerified (admin might use this)

    const bankAccount = await BankAccount.findOne({
        _id: accountId,
        userId: req.user._id
    });

    if (!bankAccount) {
        return res.status(404).json({
            status: 'error',
            message: 'Bank account not found or you do not have access to it.',
        });
    }

    // Update fields if provided
    if (typeof isDefault === 'boolean') {
        bankAccount.isDefault = isDefault;
    }
    if (status && ['active', 'inactive', 'frozen', 'closed'].includes(status)) {
        bankAccount.status = status;
    }
    if (typeof isVerified === 'boolean') { // This might be used by an admin route or an internal system
        bankAccount.isVerified = isVerified;
    }

    // The pre-save hook in bankAccount.model.js will handle setting other accounts to non-default
    await bankAccount.save();

    res.status(200).json({
        status: 'success',
        message: 'Bank account updated successfully.',
        data: {
            bankAccount,
        },
    });
});

// @desc    Delete a bank account
// @route   DELETE /api/bank/accounts/:accountId
// @access  Private (auth required)
exports.deleteBankAccount = asyncHandler(async (req, res) => {
    const { accountId } = req.params;

    const bankAccount = await BankAccount.findOne({
        _id: accountId,
        userId: req.user._id,
    });

    if (!bankAccount) {
        return res.status(404).json({
            status: 'error',
            message: 'Bank account not found or you do not have access to it.',
        });
    }

    // Prevent deletion if account has a balance
    if (bankAccount.balance > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Cannot delete a bank account with a remaining balance. Please withdraw funds first.',
        });
    }

    // If it's the default account and there are other accounts, prevent deletion
    if (bankAccount.isDefault) {
        const otherAccountsCount = await BankAccount.countDocuments({
            userId: req.user._id,
            _id: { $ne: accountId },
            status: 'active'
        });

        if (otherAccountsCount > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'This is your default account. Please set another account as default before deleting this one.',
            });
        }
    }

    await BankAccount.deleteOne({ _id: accountId });

    res.status(200).json({
        status: 'success',
        message: 'Bank account deleted successfully.',
    });
});

// @desc    Transfer money from wallet to bank account (Withdrawal)
// @route   POST /api/bank/transfer-to-bank
// @access  Private (auth & verifyPin required)
exports.transferToBank = asyncHandler(async (req, res) => {
    const { accountId, amount } = req.body;

    if (!accountId || !amount || amount <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide account ID and a valid amount.',
        });
    }

    const session = await BankAccount.startSession();
    session.startTransaction();

    try {
        const bankAccount = await BankAccount.findOne({
            _id: accountId,
            userId: req.user._id,
        }).session(session);

        if (!bankAccount || !bankAccount.isVerified) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'error',
                message: 'Valid and verified bank account not found.',
            });
        }

        const wallet = await Wallet.findOne({ userId: req.user._id }).session(session);

        if (!wallet) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'error',
                message: 'Wallet not found for the user.',
            });
        }

        if (wallet.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient wallet balance for this transfer.',
            });
        }

        // Update balances
        wallet.balance -= amount;
        bankAccount.balance += amount; // Using 'balance' field as per model

        await wallet.save({ session });
        await bankAccount.save({ session });

        // Create transaction record
        const transaction = await Transaction.create(
            [{
                userId: req.user._id,
                type: 'withdrawal',
                amount: amount, // Amount is positive for withdrawal from wallet perspective
                currency: wallet.currency,
                description: `Transfer to bank account ${bankAccount.accountNumber.slice(-4)} (${bankAccount.bankName})`,
                status: 'completed',
                metadata: {
                    bankAccount: {
                        bankName: bankAccount.bankName,
                        accountNumber: bankAccount.accountNumber,
                        ifscCode: bankAccount.ifscCode,
                    },
                    paymentMethod: 'wallet',
                },
            }],
            { session }
        );

        // Create notification
        await Notification.create(
            [{
                userId: req.user._id,
                title: 'Money Transferred to Bank',
                message: `₹${amount} transferred to your ${bankAccount.bankName} account (${bankAccount.accountNumber.slice(-4)})`,
                type: 'transaction',
                metadata: {
                    transactionId: transaction[0]._id,
                    amount,
                    icon: 'bank-transfer',
                },
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            status: 'success',
            message: 'Money transferred to bank successfully.',
            data: {
                newWalletBalance: wallet.balance,
                newBankAccountBalance: bankAccount.balance,
                transaction: transaction[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Re-throw to be caught by the asyncHandler or global error handler
    }
});

// @desc    Transfer money from bank account to wallet (Deposit)
// @route   POST /api/bank/transfer-from-bank
// @access  Private (auth & verifyPin required)
exports.transferFromBank = asyncHandler(async (req, res) => {
    const { accountId, amount } = req.body;

    if (!accountId || !amount || amount <= 0) {
        return res.status(400).json({
            status: 'error',
            message: 'Please provide account ID and a valid amount.',
        });
    }

    const session = await BankAccount.startSession();
    session.startTransaction();

    try {
        const bankAccount = await BankAccount.findOne({
            _id: accountId,
            userId: req.user._id,
        }).session(session);

        if (!bankAccount || !bankAccount.isVerified) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'error',
                message: 'Valid and verified bank account not found.',
            });
        }

        // This is a mock balance for the bank account. In a real system, this would involve a payment gateway.
        if (bankAccount.balance < amount) { // Using 'balance' field as per model
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient bank account balance for this transfer (mock).',
            });
        }

        const wallet = await Wallet.findOne({ userId: req.user._id }).session(session);

        if (!wallet) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'error',
                message: 'Wallet not found for the user.',
            });
        }

        // Update balances
        wallet.balance += amount;
        bankAccount.balance -= amount; // Using 'balance' field as per model

        await wallet.save({ session });
        await bankAccount.save({ session });

        // Create transaction record
        const transaction = await Transaction.create(
            [{
                userId: req.user._id,
                type: 'deposit',
                amount: amount,
                currency: wallet.currency,
                description: `Transfer from bank account ${bankAccount.accountNumber.slice(-4)} (${bankAccount.bankName})`,
                status: 'completed',
                metadata: {
                    bankAccount: {
                        bankName: bankAccount.bankName,
                        accountNumber: bankAccount.accountNumber,
                        ifscCode: bankAccount.ifscCode,
                    },
                    paymentMethod: 'bank',
                },
            }],
            { session }
        );

        // Create notification
        await Notification.create(
            [{
                userId: req.user._id,
                title: 'Money Added from Bank',
                message: `₹${amount} added to your wallet from ${bankAccount.bankName} account (${bankAccount.accountNumber.slice(-4)})`,
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
            message: 'Money transferred from bank successfully.',
            data: {
                newWalletBalance: wallet.balance,
                newBankAccountBalance: bankAccount.balance,
                transaction: transaction[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});
