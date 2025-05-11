// backend/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.use(protect); // All routes below will use this middleware
router.get('/me', authController.getCurrentUser);
router.post('/pin', authController.setPin);
router.post('/kyc', authController.submitKyc);

module.exports = router;