// backend/controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Wallet = require('../models/wallet.model');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { firebaseUid, name, email, phone } = req.body;

    // Check if all required fields are provided
    if (!firebaseUid || !name || !email || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }, { firebaseUid }] });
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with provided email, phone or Firebase UID',
      });
    }

    // Create user
    const newUser = await User.create({
      firebaseUid,
      name,
      email,
      phone,
    });

    // Create wallet for the user
    await Wallet.createWalletForUser(newUser._id);

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          kycVerified: newUser.kycVerified,
          profilePicture: newUser.profilePicture,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Login user with Firebase UID
exports.login = async (req, res) => {
  try {
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide Firebase UID',
      });
    }

    // Find user by Firebase UID
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          kycVerified: user.kycVerified,
          profilePicture: user.profilePicture,
          darkMode: user.darkMode,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Set transaction PIN
exports.setPin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid 4-digit PIN',
      });
    }

    // Update user with new PIN
    await User.findByIdAndUpdate(req.user._id, { pin });

    res.status(200).json({
      status: 'success',
      message: 'PIN set successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Submit KYC details
exports.submitKyc = async (req, res) => {
  try {
    const { pan, aadhar, photoIdUrl } = req.body;

    if (!pan || !aadhar || !photoIdUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required KYC details',
      });
    }

    // Update user with KYC details
    await User.findByIdAndUpdate(req.user._id, {
      kycDetails: {
        pan,
        aadhar,
        photoIdUrl,
        status: 'pending',
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'KYC details submitted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          kycVerified: user.kycVerified,
          kycDetails: user.kycDetails,
          profilePicture: user.profilePicture,
          notificationPreferences: user.notificationPreferences,
          darkMode: user.darkMode,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};