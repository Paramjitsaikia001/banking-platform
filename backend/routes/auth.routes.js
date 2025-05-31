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

// In-memory storage for testing
const otpStore = new Map();

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

        // Store OTP in memory
        otpStore.set(phoneNumber, otp);

        // Send OTP via SMS
        const sent = await sendSMSOTP(phoneNumber, otp);
        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in start-registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/verify-phone', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        // Get stored OTP
        const storedOTP = otpStore.get(phoneNumber);
        if (!storedOTP) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        // Verify OTP
        if (otp !== storedOTP) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear OTP from memory
        otpStore.delete(phoneNumber);

        res.status(200).json({ message: 'Phone number verified successfully' });
    } catch (error) {
        console.error('Error in verify-phone:', error);
        res.status(500).json({ message: 'Internal server error' });
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
            isPhoneVerified: true
        });

        // Create wallet for user
        await Wallet.createWalletForUser(user._id);

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
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                upiId: user.upiId
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
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

        // Store OTP and phone number in memory
        otpStore.set(email, {
            otp,
            phoneNumber
        });

        // Send OTP via email
        const sent = await sendEmailOTP(email, otp);
        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error in send-email-verification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Verify email
router.post('/verify-email', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Get stored OTP and phone number
        const storedData = otpStore.get(email);
        if (!storedData) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        // Verify OTP
        if (otp !== storedData.otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update user's email
        const user = await User.findOne({ phoneNumber: storedData.phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email;
        user.isEmailVerified = true;
        await user.save();

        // Clear OTP from memory
        otpStore.delete(email);

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error in verify-email:', error);
        res.status(500).json({ message: 'Internal server error' });
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
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                upiId: user.upiId
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
        res.status(500).json({
            message: 'Error submitting KYC details',
            error: error.message
        });
    }
});

module.exports = router;