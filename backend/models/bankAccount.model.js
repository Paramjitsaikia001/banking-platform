// backend/models/bankAccount.model.js
const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    enum: ['savings', 'checking', 'business'],
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    required: true
  },
  currency: {
    type: String,
    default: 'USD',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'frozen'],
    default: 'active'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;