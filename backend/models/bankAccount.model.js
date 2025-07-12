const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bankName: {
        type: String,
        required: true,
        trim: true
    },
    accountHolderName: {
        type: String,
        required: true,
        trim: true
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    ifscCode: {
        type: String,
        required: true,
        trim: true
    },
    accountType: {
        type: String,
        enum: ['savings', 'checking', 'business', 'current'],
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        required: true
    },
    currency: {
        type: String,
        default: 'INR', // Changed default to INR based on your other models
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'frozen', 'closed'],
        default: 'active'
    },
    isDefault: { // Renamed from isPrimary for consistency
        type: Boolean,
        default: false
    },
    isVerified: { // Added
        type: Boolean,
        default: false // Accounts should typically be verified by an admin or a process
    }
}, {
    timestamps: true // Keeps createdAt and updatedAt
});

// Pre-save hook to ensure only one default account per user
bankAccountSchema.pre('save', async function(next) {
    if (this.isModified('isDefault') && this.isDefault) {
        // Unset previous default accounts for this user, excluding the current one
        await this.constructor.updateMany(
            { userId: this.userId, _id: { $ne: this._id }, isDefault: true },
            { $set: { isDefault: false } }
        );
    }
    // Update updatedAt timestamp
    this.updatedAt = Date.now();
    next();
});

// Optional: Generate account number automatically if not provided (for new accounts)
// This is a simple example; a robust solution would involve checking for uniqueness
bankAccountSchema.pre('validate', function(next) {
    if (this.isNew && !this.accountNumber) {
        // Generate a random 12-digit number for demonstration
        this.accountNumber = 'ACC' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
    }
    next();
});

const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

module.exports = BankAccount;
