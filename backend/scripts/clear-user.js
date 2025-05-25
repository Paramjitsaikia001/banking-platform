require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');

async function clearUser(phoneNumber) {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banking-platform');
        console.log('Connected to MongoDB');

        const result = await User.deleteOne({ phoneNumber });
        if (result.deletedCount > 0) {
            console.log(`User with phone number ${phoneNumber} has been deleted`);
        } else {
            console.log(`No user found with phone number ${phoneNumber}`);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Get phone number from command line argument
const phoneNumber = process.argv[2];
if (!phoneNumber) {
    console.log('Please provide a phone number as an argument');
    process.exit(1);
}

clearUser(phoneNumber); 