const BankAccount = require('../models/bankAccount.model');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const Notification = require('../models/notification.model');
const User = require('../models/user.model');
const mockBankService = require('../services/mockBankService'); // Import the mock external bank service

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
        currency,
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

    // Simulate initial verification with the mock bank service
    // In a real scenario, this would involve a bank's API to verify account existence
    const externalAccountStatus = await mockBankService.getExternalBalance(accountNumber);
    let initialBalanceAtBank = 0;
    let isAccountVerified = false;

    if (externalAccountStatus.success) {
        initialBalanceAtBank = externalAccountStatus.balance;
        isAccountVerified = true; // Mark as verified if found in mock bank
    } else {
        // If not found in mock bank, we can optionally add it for demonstration
        // In a real system, unverified accounts would require manual review or a proper bank linking process.
        mockBankService._addMockAccount(accountNumber, 0, currency); // Add with 0 balance
        isAccountVerified = true; // Assume it's now 'linked' for demo purposes
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
        isVerified: isAccountVerified, // Set based on mock bank check
        balance: initialBalanceAtBank // Set initial balance from mock bank
    });

    // The pre-save hook in bankAccount.model.js will handle setting other accounts to non-default
    await bankAccount.save();

    res.status(201).json({
        status: 'success',
        message: `Bank account added successfully. Status: ${isAccountVerified ? 'Verified' : 'Pending Verification'}.`,
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

    // Optionally, fetch real-time balances from the mock external bank for each account
    const accountsWithLiveBalances = await Promise.all(bankAccounts.map(async (account) => {
        if (account.isVerified) {
            const externalBalanceResult = await mockBankService.getExternalBalance(account.accountNumber);
            if (externalBalanceResult.success) {
                // Update the internal record with the latest external balance
                account.balance = externalBalanceResult.balance;
                await account.save(); // Save the updated balance to your DB
                return account.toObject(); // Return a plain object
            }
        }
        return account.toObject(); // Return existing object if not verified or external fetch fails
    }));

    res.status(200).json({
        status: 'success',
        message: 'Bank accounts retrieved successfully.',
        data: {
            bankAccounts: accountsWithLiveBalances,
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

    // Optionally, fetch real-time balance from the mock external bank
    if (bankAccount.isVerified) {
        const externalBalanceResult = await mockBankService.getExternalBalance(bankAccount.accountNumber);
        if (externalBalanceResult.success) {
            bankAccount.balance = externalBalanceResult.balance;
            await bankAccount.save(); // Save the updated balance to your DB
        }
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
    const { isDefault, status, isVerified } = req.body; // isVerified can be updated by admin/internal system

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
    // Only allow isVerified to be set to true if it's currently false (simulating an admin verification)
    // Or, you might have a dedicated admin route for this.
    if (typeof isVerified === 'boolean' && isVerified === true && bankAccount.isVerified === false) {
        // In a real system, this would be triggered by an external verification process
        bankAccount.isVerified = true;
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

    // Before deleting, check if there's any balance at the external bank (simulated)
    if (bankAccount.isVerified) {
        const externalBalanceResult = await mockBankService.getExternalBalance(bankAccount.accountNumber);
        if (externalBalanceResult.success && externalBalanceResult.balance > 0) {
            return res.status(400).json({
                status: 'error',
                message: `Cannot delete this bank account. It still has a balance of ${externalBalanceResult.balance} at the external bank. Please withdraw funds first.`,
            });
        }
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

// @desc    Transfer money from wallet to external bank account (Withdrawal from wallet)
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
                message: 'Valid and verified bank account not found for this user.',
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

        // --- Simulate transfer to external bank ---
        const externalDepositResult = await mockBankService.externalDeposit(bankAccount.accountNumber, amount);

        if (!externalDepositResult.success) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                status: 'error',
                message: externalDepositResult.message || 'Failed to deposit money to external bank.',
            });
        }
        // --- End external bank simulation ---

        // Update internal wallet balance
        wallet.balance -= amount;
        await wallet.save({ session });

        // Update the internally tracked bank account balance to reflect external change
        bankAccount.balance = externalDepositResult.newBalance;
        await bankAccount.save({ session });

        // Create transaction record
        const transaction = await Transaction.create(
            [{
                userId: req.user._id,
                type: 'withdrawal',
                amount: amount, // Amount is positive for withdrawal from wallet perspective
                currency: wallet.currency,
                description: `Transfer to external bank account ${bankAccount.accountNumber.slice(-4)} (${bankAccount.bankName})`,
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
                message: `₹${amount} transferred from your wallet to your ${bankAccount.bankName} account (${bankAccount.accountNumber.slice(-4)}).`,
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
            message: 'Money transferred to external bank successfully.',
            data: {
                newWalletBalance: wallet.balance,
                newBankAccountBalance: bankAccount.balance, // This is the updated external balance
                transaction: transaction[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// @desc    Transfer money from external bank account to wallet (Deposit to wallet)
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
                message: 'Valid and verified bank account not found for this user.',
            });
        }

        // --- Simulate withdrawal from external bank ---
        const externalWithdrawalResult = await mockBankService.externalWithdrawal(bankAccount.accountNumber, amount);

        if (!externalWithdrawalResult.success) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({
                status: 'error',
                message: externalWithdrawalResult.message || 'Failed to withdraw money from external bank.',
            });
        }
        // --- End external bank simulation ---

        const wallet = await Wallet.findOne({ userId: req.user._id }).session(session);

        if (!wallet) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                status: 'error',
                message: 'Wallet not found for the user.',
            });
        }

        // Update internal wallet balance
        wallet.balance += amount;
        await wallet.save({ session });

        // Update the internally tracked bank account balance to reflect external change
        bankAccount.balance = externalWithdrawalResult.newBalance;
        await bankAccount.save({ session });

        // Create transaction record
        const transaction = await Transaction.create(
            [{
                userId: req.user._id,
                type: 'deposit',
                amount: amount,
                currency: wallet.currency,
                description: `Transfer from external bank account ${bankAccount.accountNumber.slice(-4)} (${bankAccount.bankName})`,
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
                message: `₹${amount} added to your wallet from your ${bankAccount.bankName} account (${bankAccount.accountNumber.slice(-4)}).`,
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
            message: 'Money transferred from external bank to wallet successfully.',
            data: {
                newWalletBalance: wallet.balance,
                newBankAccountBalance: bankAccount.balance, // This is the updated external balance
                transaction: transaction[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});
