// backend/models/biller.model.js
const mongoose = require('mongoose');

const billerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    billType: {
      type: String,
      enum: ['electricity', 'mobile', 'broadband', 'DTH', 'water', 'other'],
      required: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    consumerId: {
      type: String,
      required: true,
      trim: true,
    },
    nickname: {
      type: String,
      trim: true,
    },
    autoPayEnabled: {
      type: Boolean,
      default: false,
    },
    autoPayLimit: {
      type: Number,
      default: 0,
    },
    lastPaid: {
      date: Date,
      amount: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for userId and a combination of billType, provider, and consumerId
billerSchema.index({ userId: 1, billType: 1, provider: 1, consumerId: 1 }, { unique: true });

const Biller = mongoose.model('Biller', billerSchema);

module.exports = Biller;