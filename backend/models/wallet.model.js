// backend/models/wallet.model.js
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  upiId: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
walletSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Generate UPI ID if not exists
walletSchema.pre('save', async function (next) {
  if (!this.upiId) {
    const user = await mongoose.model('User').findById(this.userId);
    if (user) {
      const baseUpi = `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`;
      let upiId = `${baseUpi}@bankingapp`;
      let counter = 1;

      // Keep trying until we find a unique UPI ID
      while (await this.constructor.findOne({ upiId })) {
        upiId = `${baseUpi}${counter}@bankingapp`;
        counter++;
      }

      this.upiId = upiId;
    }
  }
  next();
});

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