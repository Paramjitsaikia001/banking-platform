// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

// Registration flow routes
router.post('/start-registration', authController.startRegistration);
router.post('/verify-phone', authController.verifyPhone);
router.post('/register', authController.registerWithEmail);
router.post('/verify-email', authController.verifyEmail);

// Login route
router.post('/login', authController.login);

// Protected routes
router.get('/me', auth, authController.getCurrentUser);
router.post('/kyc', auth, authController.submitKyc);

module.exports = router;