require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');

async function testDatabase() {
    try {
        console.log('Testing MongoDB connection...');
        console.log('MONGODB_URI:', process.env.MONGODB_URI);

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB successfully!');

        // Check total users in database
        const totalUsers = await User.countDocuments();
        console.log(`\nTotal users in database: ${totalUsers}`);

        // List all users
        const allUsers = await User.find({}).select('email firstName lastName phoneNumber createdAt upiId');
        console.log('\nAll users in database:');
        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.phoneNumber} - UPI: ${user.upiId} - Created: ${user.createdAt}`);
        });

        // Test finding specific user
        const testUser = await User.findOne({ email: 'test@example.com' });
        if (testUser) {
            console.log('\n✅ Found test user:');
            console.log('ID:', testUser._id);
            console.log('Email:', testUser.email);
            console.log('Name:', testUser.firstName, testUser.lastName);
            console.log('Phone:', testUser.phoneNumber);
            console.log('UPI ID:', testUser.upiId);
        } else {
            console.log('\n❌ Test user not found');
        }

    } catch (error) {
        console.error('❌ Database test failed:', error);
        console.error('Error details:', error.message);
        console.error('Stack trace:', error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
}

testDatabase(); 