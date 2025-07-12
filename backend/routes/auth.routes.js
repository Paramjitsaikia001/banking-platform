// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');
const { generateOTP, sendSMSOTP, sendEmailOTP } = require('../utils/otpUtils');
const Otp = require('../models/otp.model');

// Registration flow routes
router.post('/start-registration', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Check if phone number already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Generate OTP
        const otp = generateOTP();
        console.log(`\n🔐 [PHONE VERIFICATION] Generated OTP for ${phoneNumber}: ${otp}`);
        console.log(`📱 [PHONE VERIFICATION] Use this OTP: ${otp}`);

        // Store OTP in DB
        await Otp.create({ identifier: phoneNumber, otp, type: 'phone' });
        console.log(`✅ [PHONE VERIFICATION] OTP stored in database for ${phoneNumber}`);

        // Send OTP via SMS
        const sent = await sendSMSOTP(phoneNumber, otp);
        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in start-registration:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
});

router.post('/verify-phone', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        console.log(`\n🔍 Verifying OTP for ${phoneNumber}: ${otp}`);

        // Get stored OTP from DB
        const otpDoc = await Otp.findOne({ identifier: phoneNumber, type: 'phone' });
        if (!otpDoc) {
            console.log(`❌ No OTP found for ${phoneNumber}`);
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        console.log(`📋 [PHONE VERIFICATION] Stored OTP for ${phoneNumber}: ${otpDoc.otp}`);
        console.log(`📝 [PHONE VERIFICATION] Received OTP: ${otp}`);
        console.log(`🔍 [PHONE VERIFICATION] OTP Match: ${otp === otpDoc.otp}`);

        // Verify OTP
        if (otp !== otpDoc.otp) {
            console.log(`❌ Invalid OTP for ${phoneNumber}`);
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear OTP from DB
        await Otp.deleteOne({ _id: otpDoc._id });

        res.status(200).json({ message: 'Phone number verified successfully' });
    } catch (error) {
        console.error('Error in verify-phone:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
});

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phoneNumber, dateOfBirth, pin } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phoneNumber }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email or phone number already exists'
            });
        }

        // Create new user
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
            pin,
            isPhoneVerified: true,
            isEmailVerified: true
        });


        // Create wallet for user with zero balance
        const wallet = await Wallet.createWalletForUser(user._id);
        console.log(`✅ Created wallet for user ${user._id} with balance: ${wallet.balance}`);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                _id: user._id,
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                upiId: user.upiId,
                isPhoneVerified: user.isPhoneVerified,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
            stack: error.stack
        });
    }
});

// Send email verification
router.post('/send-email-verification', async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Generate OTP
        const otp = generateOTP();
        console.log(`\n📧 [EMAIL VERIFICATION] Generated OTP for ${email}: ${otp}`);
        console.log(`✉️ [EMAIL VERIFICATION] Use this OTP: ${otp}`);

        // Store OTP in DB
        await Otp.create({ identifier: email, otp, type: 'email' });
        console.log(`✅ [EMAIL VERIFICATION] OTP stored in database for ${email}`);

        // Send OTP via email
        const sent = await sendEmailOTP(email, otp);
        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in send-email-verification:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
});

// Verify email
router.post('/verify-email', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Get stored OTP from DB
        const otpDoc = await Otp.findOne({ identifier: email, type: 'email' });
        if (!otpDoc) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        // Verify OTP
        if (otp !== otpDoc.otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // --- Removed user lookup and update logic here ---
        // Previously: Find user by phoneNumber, update email and isEmailVerified

        // Clear OTP from DB
        await Otp.deleteOne({ _id: otpDoc._id });

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error in verify-email:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message, stack: error.stack });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                upiId: user.upiId,
                isPhoneVerified: user.isPhoneVerified,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
});

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.post('/kyc', auth, authController.submitKyc);

// Registration KYC route (no auth required)
router.post('/kyc-registration', async (req, res) => {
    try {
        console.log('KYC registration request body:', req.body);

        const { fullName, panNumber, aadharNumber, panCardImage, aadharCardImage, phoneNumber } = req.body;

        // Validate required fields
        if (!fullName || !panNumber || !aadharNumber || !phoneNumber) {
            return res.status(400).json({
                message: 'Missing required KYC fields',
                required: ['fullName', 'panNumber', 'aadharNumber', 'phoneNumber']
            });
        }

        // Find user by phone number
        console.log('Looking for user with phone number:', phoneNumber);
        const user = await User.findOne({ phoneNumber });

        if (!user) {
            console.log('User not found for phone number:', phoneNumber);
            return res.status(404).json({
                message: 'User not found. Please complete registration first.',
                phoneNumber
            });
        }

        console.log('Found user:', user._id);

        // Update user's KYC details
        user.kycDetails = {
            fullName,
            panNumber,
            aadharNumber,
            panCardImage,
            aadharCardImage,
            status: 'pending'
        };

        await user.save();
        console.log('KYC details saved successfully');

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'KYC details submitted successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                wallet: user.wallet
            }
        });
    } catch (error) {
        console.error('Error in kyc-registration:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
            stack: error.stack
        });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                upiId: user.upiId,
                kycDetails: user.kycDetails
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching user details',
            error: error.message
        });
    }
});

// Submit KYC details
router.post('/kyc', auth, async (req, res) => {
    try {
        const { fullName, panNumber, aadharNumber, panCardImage, aadharCardImage } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        user.kycDetails = {
            fullName,
            panNumber,
            aadharNumber,
            panCardImage,
            aadharCardImage,
            status: 'pending'
        };

        await user.save();

        res.json({
            message: 'KYC details submitted successfully',
            kycDetails: user.kycDetails
        });
    } catch (error) {
        console.error('Error submitting KYC details:', error);
        res.status(500).json({
            message: 'Error submitting KYC details',
            error: error.message,
            stack: error.stack
        });
    }
});

module.exports = router;