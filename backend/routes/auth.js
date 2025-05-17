const express = require('express');
const router = express.Router();
const { generateOTP, sendSMSOTP, sendEmailOTP, verifyOTP } = require('../utils/otpUtils');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');

// Start registration with phone number
router.post('/start-registration', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Check if phone number already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Generate and send OTP
        const otp = generateOTP();
        const otpSecret = speakeasy.generateSecret().base32;

        // Store OTP secret in session or temporary storage
        req.session.otpSecret = otpSecret;
        req.session.phoneNumber = phoneNumber;

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

// Verify phone number
router.post('/verify-phone', async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;

        // Verify OTP
        const isValid = verifyOTP(otp, req.session.otpSecret);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Clear OTP secret from session
        delete req.session.otpSecret;

        res.status(200).json({ message: 'Phone number verified successfully' });
    } catch (error) {
        console.error('Error in verify-phone:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Register user with personal details
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, dateOfBirth, password, phoneNumber } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with temporary email
        const user = new User({
            firstName,
            lastName,
            dateOfBirth,
            password: hashedPassword,
            phoneNumber,
            email: `${phoneNumber}@temp.com`, // Temporary email
            isEmailVerified: false,
            isPhoneVerified: true,
            wallet: {
                balance: 0
            }
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Send email verification
router.post('/send-email-verification', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Generate and send OTP
        const otp = generateOTP();
        const otpSecret = speakeasy.generateSecret().base32;

        // Store OTP secret in session
        req.session.emailOtpSecret = otpSecret;
        req.session.email = email;

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

        // Verify OTP
        const isValid = verifyOTP(otp, req.session.emailOtpSecret);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update user's email
        const user = await User.findOne({ phoneNumber: req.session.phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.email = email;
        user.isEmailVerified = true;
        await user.save();

        // Clear OTP secret from session
        delete req.session.emailOtpSecret;

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error in verify-email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Submit KYC details
router.post('/kyc', async (req, res) => {
    try {
        const { fullName, panNumber, aadharNumber, panCardImage, aadharCardImage } = req.body;

        // Update user's KYC details
        const user = await User.findOne({ phoneNumber: req.session.phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.kycDetails = {
            fullName,
            panNumber,
            aadharNumber,
            panCardImage,
            aadharCardImage,
            status: 'PENDING'
        };

        await user.save();

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
        console.error('Error in kyc:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router; 