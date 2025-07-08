const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true
    }, // phone number or email
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['phone', 'email'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    } // expires after 5 minutes
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp; 