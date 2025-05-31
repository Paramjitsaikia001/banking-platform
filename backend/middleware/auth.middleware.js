// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

// Middleware to verify transaction PIN
const verifyPin = async (req, res, next) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide your PIN',
      });
    }

    // Find user with PIN field (which is normally excluded)
    const user = await User.findById(req.user._id).select('+pin');

    if (!user || !(await user.verifyPin(pin))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect PIN',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error verifying PIN',
    });
  }
};

module.exports = {
  auth,
  verifyPin
};