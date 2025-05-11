// backend/models/transaction.model.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'transfer', 'billPayment', 'recharge'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    reference: {
      type: String,
      unique: true,
    },
    metadata: {
      // For transfers
      recipient: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: String,
        phone: String,
        email: String,
      },
      
      // For bill payments
      billType: {
        type: String,
        enum: ['electricity', 'mobile', 'broadband', 'DTH', 'water', 'other'],
      },
      billProvider: String,
      billerId: String,
      billNumber: String,
      
      // For bank transfers
      bankAccount: {
        bankName: String,
        accountNumber: String,
        ifscCode: String,
      },
      
      // For payment methods
      paymentMethod: {
        type: String,
        enum: ['wallet', 'bank', 'card', 'upi'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique reference number before saving
transactionSchema.pre('save', function (next) {
  if (!this.reference) {
    // Generate a unique reference number: TX-{TIMESTAMP}-{RANDOM_ALPHANUMERIC}
    const timestamp = new Date().getTime();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.reference = `TX-${timestamp}-${random}`;
  }
  next();
});

// Create indexes for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ reference: 1 }, { unique: true });
transactionSchema.index({ 'metadata.recipient.userId': 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;