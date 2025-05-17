// backend/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Step 1: Start registration with phone number
exports.startRegistration = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Check if phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // In a real application, you would send an OTP here
    // For now, we'll just return a success message
    res.json({
      message: 'OTP sent successfully',
      phoneNumber
    });
  } catch (error) {
    res.status(500).json({ message: 'Error starting registration', error: error.message });
  }
};

// Step 2: Verify phone number
exports.verifyPhone = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // In a real application, you would verify the OTP here
    // For now, we'll just return a success message
    res.json({
      message: 'Phone number verified successfully',
      phoneNumber
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying phone number', error: error.message });
  }
};

// Step 3: Register with email
exports.registerWithEmail = async (req, res) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth, phoneNumber } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      phoneNumber,
      isPhoneVerified: true // Since we verified in step 2
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        upiId: user.upiId,
        wallet: user.wallet
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Step 4: Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real application, you would verify the OTP here
    user.isEmailVerified = true;
    await user.save();

    res.json({
      message: 'Email verified successfully',
      user: {
        id: user._id,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
};

// Step 5: Submit KYC details
exports.submitKyc = async (req, res) => {
  try {
    const { fullName, panNumber, aadharNumber, panCardImage, aadharCardImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
      kycStatus: user.kycDetails.status
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting KYC details', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        upiId: user.upiId,
        wallet: user.wallet,
        kycDetails: user.kycDetails
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};