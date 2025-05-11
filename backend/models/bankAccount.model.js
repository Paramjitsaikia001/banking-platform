// backend/models/bankAccount.model.js
const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    accountType: {
      type: String,
      enum: ['savings', 'current', 'other'],
      default: 'savings',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    // For mock data
    mockBalance: {
      type: Number,
      default: 10000,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one primary account per user
bankAccountSchema.pre('save', async function (next) {
  if (this.isPrimary) {
    // Set all other accounts to non-primary
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { $set: { isPrimary: false } }
    );
  }
  next();
});

// Create a compound index for userId and accountNumber
bankAccountSchema.index({ userId: 1, accountNumber: 1 }, { unique: true });

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;