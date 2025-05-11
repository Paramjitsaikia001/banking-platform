// backend/controllers/wallet.controller.js
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const Notification = require('../models/notification.model');

// Get wallet balance
exports.getBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user._id });

    if (!wallet) {
      return res.status(404).json({
        status: 'error',
        message: 'Wallet not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Add money to wallet (mock card/bank payment)
exports.addMoney = async (req, res) => {
  try {
    const { amount, paymentMethod, cardDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid amount',
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a payment method',
      });
    }

    // Start a session for transaction safety
    const session = await Wallet.startSession();
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

      // Create transaction record
      const transaction = await Transaction.create(
        [
          {
            userId: req.user._id,
            type: 'deposit',
            amount,
            currency: wallet.currency,
            description: `Added money via ${paymentMethod}`,
            status: 'completed',
            metadata: {
              paymentMethod,
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
            title: 'Money Added',
            message: `₹${amount} has been added to your wallet`,
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
        message: 'Money added successfully',
        data: {
          newBalance: wallet.balance,
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

// Transfer money to another user
exports.transferMoney = async (req, res) => {
  try {
    const { recipientId, amount, description } = req.body;

    if (!recipientId || !amount || amount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide recipient and valid amount',
      });
    }

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipient not found',
      });
    }

    // Check if sending to self
    if (req.user._id.toString() === recipientId) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot transfer money to yourself',
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
            description: description || `Transfer to ${recipient.name}`,
            status: 'completed',
            metadata: {
              recipient: {
                userId: recipient._id,
                name: recipient.name,
                phone: recipient.phone,
                email: recipient.email,
              },
              paymentMethod: 'wallet',
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
            description: `Received from ${req.user.name}`,
            status: 'completed',
            metadata: {
              recipient: {
                userId: req.user._id,
                name: req.user.name,
                phone: req.user.phone,
                email: req.user.email,
              },
              paymentMethod: 'wallet',
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
            title: 'Money Sent',
            message: `₹${amount} sent to ${recipient.name}`,
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
            title: 'Money Received',
            message: `₹${amount} received from ${req.user.name}`,
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
        message: 'Money transferred successfully',
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

// Get transaction history
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    
    const query = { userId: req.user._id };
    
    if (type) {
      query.type = type;
    }
    
    const options = {
      sort: { createdAt: -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      populate: {
        path: 'metadata.recipient.userId',
        select: 'name profilePicture',
      },
    };
    
    const transactions = await Transaction.find(query, null, options);
    const totalCount = await Transaction.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        transactions,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};