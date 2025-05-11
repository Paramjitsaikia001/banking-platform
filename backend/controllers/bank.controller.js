// backend/controllers/bank.controller.js
const BankAccount = require('../models/bankAccount.model');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const Notification = require('../models/notification.model');

// Add a bank account
exports.addBankAccount = async (req, res) => {
  try {
    const { 
      bankName, 
      accountHolderName, 
      accountNumber, 
      ifscCode, 
      accountType,
      isPrimary = false 
    } = req.body;

    // Validate input
    if (!bankName || !accountHolderName || !accountNumber || !ifscCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    // Check if account already exists
    const existingAccount = await BankAccount.findOne({
      userId: req.user._id,
      accountNumber,
    });

    if (existingAccount) {
      return res.status(400).json({
        status: 'error',
        message: 'Bank account already exists',
      });
    }

    // Create bank account
    const bankAccount = await BankAccount.create({
      userId: req.user._id,
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      accountType: accountType || 'savings',
      isPrimary,
      // For mock purposes, account is auto-verified
      isVerified: true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Bank account added successfully',
      data: {
        bankAccount,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get all bank accounts
exports.getBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.find({ userId: req.user._id });

    res.status(200).json({
      status: 'success',
      data: {
        bankAccounts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Set bank account as primary
exports.setPrimaryAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    // Check if account exists and belongs to user
    const bankAccount = await BankAccount.findOne({
      _id: accountId,
      userId: req.user._id,
    });

    if (!bankAccount) {
      return res.status(404).json({
        status: 'error',
        message: 'Bank account not found',
      });
    }

    // Set as primary (the pre-save hook will handle setting others to non-primary)
    bankAccount.isPrimary = true;
    await bankAccount.save();

    res.status(200).json({
      status: 'success',
      message: 'Bank account set as primary',
      data: {
        bankAccount,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Delete bank account
exports.deleteBankAccount = async (req, res) => {
  try {
    const { accountId } = req.params;

    // Check if account exists and belongs to user
    const bankAccount = await BankAccount.findOne({
      _id: accountId,
      userId: req.user._id,
    });

    if (!bankAccount) {
      return res.status(404).json({
        status: 'error',
        message: 'Bank account not found',
      });
    }

    // Cannot delete primary account if there are other accounts
    if (bankAccount.isPrimary) {
      const otherAccounts = await BankAccount.countDocuments({
        userId: req.user._id,
        _id: { $ne: accountId },
      });

      if (otherAccounts > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Please set another account as primary before deleting this one',
        });
      }
    }

    await BankAccount.deleteOne({ _id: accountId });

    res.status(200).json({
      status: 'success',
      message: 'Bank account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Transfer from wallet to bank (withdrawal)
exports.transferToBank = async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    if (!accountId || !amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide account ID and valid amount',
      });
    }

    // Check if account exists and belongs to user
    const bankAccount = await BankAccount.findOne({
      _id: accountId,
      userId: req.user._id,
    });

    if (!bankAccount || !bankAccount.isVerified) {
      return res.status(404).json({
        status: 'error',
        message: 'Valid bank account not found',
      });
    }

    // Start a session for transaction safety
    const session = await BankAccount.startSession();
    session.startTransaction();

    try {
      // Find user wallet
      const wallet = await Wallet.findOne({ userId: req.user._id }).session(session);

      if (!wallet) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          status: 'error',
          message: 'Wallet not found',
        });
      }

      // Check if user has sufficient balance
      if (wallet.balance < amount) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient balance',
        });
      }

      // Update wallet balance
      wallet.balance -= amount;
      await wallet.save({ session });

      // Update mock bank balance
      bankAccount.mockBalance += amount;
      await bankAccount.save({ session });

      // Create transaction record
      const transaction = await Transaction.create(
        [
          {
            userId: req.user._id,
            type: 'withdrawal',
            amount: -amount,
            currency: wallet.currency,
            description: `Transfer to bank account ${bankAccount.accountNumber.slice(-4)}`,
            status: 'completed',
            metadata: {
              bankAccount: {
                bankName: bankAccount.bankName,
                accountNumber: bankAccount.accountNumber,
                ifscCode: bankAccount.ifscCode,
              },
              paymentMethod: 'wallet',
            },
          },
        ],
        { session }
      );

      // Create notification
      await Notification.create(
        [
          {
            userId: req.user._id,
            title: 'Money Transferred to Bank',
            message: `₹${amount} transferred to your ${bankAccount.bankName} account`,
            type: 'transaction',
            metadata: {
              transactionId: transaction[0]._id,
              amount,
              icon: 'bank-transfer',
            },
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        status: 'success',
        message: 'Money transferred to bank successfully',
        data: {
          newWalletBalance: wallet.balance,
          transaction: transaction[0],
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

// Transfer from bank to wallet (deposit)
exports.transferFromBank = async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    if (!accountId || !amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide account ID and valid amount',
      });
    }

    // Check if account exists and belongs to user
    const bankAccount = await BankAccount.findOne({
      _id: accountId,
      userId: req.user._id,
    });

    if (!bankAccount || !bankAccount.isVerified) {
      return res.status(404).json({
        status: 'error',
        message: 'Valid bank account not found',
      });
    }

    // Check if mock bank account has sufficient balance
    if (bankAccount.mockBalance < amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient bank balance',
      });
    }

    // Start a session for transaction safety
    const session = await BankAccount.startSession();
    session.startTransaction();

    try {
      // Find user wallet
      const wallet = await Wallet.findOne({ userId: req.user._id }).session(session);

      if (!wallet) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          status: 'error',
          message: 'Wallet not found',
        });
      }

      // Update wallet balance
      wallet.balance += amount;
      await wallet.save({ session });

      // Update mock bank balance
      bankAccount.mockBalance -= amount;
      await bankAccount.save({ session });

      // Create transaction record
      const transaction = await Transaction.create(
        [
          {
            userId: req.user._id,
            type: 'deposit',
            amount,
            currency: wallet.currency,
            description: `Transfer from bank account ${bankAccount.accountNumber.slice(-4)}`,
            status: 'completed',
            metadata: {
              bankAccount: {
                bankName: bankAccount.bankName,
                accountNumber: bankAccount.accountNumber,
                ifscCode: bankAccount.ifscCode,
              },
              paymentMethod: 'bank',
            },
          },
        ],
        { session }
      );

      // Create notification
      await Notification.create(
        [
          {
            userId: req.user._id,
            title: 'Money Added from Bank',
            message: `₹${amount} added from your ${bankAccount.bankName} account`,
            type: 'transaction',
            metadata: {
              transactionId: transaction[0]._id,
              amount,
              icon: 'money-plus',
            },
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        status: 'success',
        message: 'Money transferred from bank successfully',
        data: {
          newWalletBalance: wallet.balance,
          newBankBalance: bankAccount.mockBalance,
          transaction: transaction[0],
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