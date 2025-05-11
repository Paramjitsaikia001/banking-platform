// backend/models/wallet.model.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  {
    timestamps: true,
  }
);

// Create wallet for user automatically when a new user is created
walletSchema.statics.createWalletForUser = async function (userId) {
  try {
    const wallet = await this.create({ userId, balance: 0 });
    return wallet;
  } catch (error) {
    throw new Error('Error creating wallet: ' + error.message);
  }
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;