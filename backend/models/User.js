const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    kycDetails: {
        fullName: String,
        panNumber: String,
        aadharNumber: String,
        panCardImage: String,
        aadharCardImage: String,
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING'
        }
    },
    wallet: {
        balance: {
            type: Number,
            default: 0
        },
        upiId: {
            type: String,
            unique: true
        }
    },
    bankAccounts: [{
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        accountHolderName: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Prevent model overwriting
module.exports = mongoose.models.User || mongoose.model('User', userSchema); 