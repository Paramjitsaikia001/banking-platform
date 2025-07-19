require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const Transaction = require('../models/transaction.model');
const BankAccount = require('../models/bankAccount.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/banking-platform';

async function initUserByEmail(email) {
    await mongoose.connect(MONGO_URI);
    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found:', email);
        await mongoose.disconnect();
        return;
    }
    // Wallet
    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
        wallet = await Wallet.createWalletForUser(user._id);
        console.log('Wallet initialized for', email);
    } else {
        console.log('Wallet already exists for', email);
    }
    // Transaction
    const txCount = await Transaction.countDocuments({ userId: user._id });
    if (txCount === 0) {
        await Transaction.create({ userId: user._id, type: 'init', amount: 0, status: 'initialized', description: 'Initial transaction history' });
        console.log('Transaction history initialized for', email);
    } else {
        console.log('Transaction history already exists for', email);
    }
    // Bank Account
    const baCount = await BankAccount.countDocuments({ userId: user._id });
    if (baCount === 0) {
        await BankAccount.create({ userId: user._id, bankName: '', accountHolderName: '', accountNumber: '', ifscCode: '', accountType: '', balance: 0, isDefault: true, isVerified: false });
        console.log('Bank account initialized for', email);
    } else {
        console.log('Bank account already exists for', email);
    }
    await mongoose.disconnect();
    console.log('Done.');
}

// Usage: node scripts/clear-user.js param@gmail.com
const email = process.argv[2];
if (!email) {
    console.log('Please provide an email as an argument');
    process.exit(1);
}
initUserByEmail(email).catch(err => { console.error(err); process.exit(1); }); 