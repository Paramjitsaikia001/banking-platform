// backend/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  kycDetails: {
    fullName: String,
    panNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    aadharNumber: {
      type: String,
      trim: true
    },
    panCardImage: String,
    aadharCardImage: String,
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  upiId: {
    type: String,
    unique: true,
    sparse: true
  },
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate UPI ID before saving if not exists
userSchema.pre('save', async function (next) {
  if (!this.upiId) {
    const baseUpi = `${this.firstName.toLowerCase()}${this.lastName.toLowerCase()}`;
    let upiId = `${baseUpi}@bank`;
    let counter = 1;

    // Keep trying until we find a unique UPI ID
    while (await this.constructor.findOne({ upiId })) {
      upiId = `${baseUpi}${counter}@bank`;
      counter++;
    }

    this.upiId = upiId;
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;