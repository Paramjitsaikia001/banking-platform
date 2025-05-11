// backend/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    kycVerified: {
      type: Boolean,
      default: false,
    },
    kycDetails: {
      pan: {
        type: String,
        trim: true,
      },
      aadhar: {
        type: String,
        trim: true,
      },
      photoIdUrl: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
      },
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: true,
      },
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    pin: {
      type: String,
      select: false, // The PIN won't be included in query results by default
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify transaction PIN
userSchema.methods.verifyPin = async function (pin) {
  return await bcrypt.compare(pin, this.pin);
};

// Hash the PIN before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('pin')) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;