// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Import for persistent sessions

// --- Route Imports ---
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const walletRoutes = require('./routes/wallet.routes');
const bankRoutes = require('./routes/bank.routes');
const paymentRoutes = require('./routes/payment.routes');

// --- Initialize Express App ---
const app = express();

// --- Core Middleware ---

// Set the environment (defaults to 'development' if not set)
const isProduction = process.env.NODE_ENV === 'production';

// CORS configuration for allowing frontend requests
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// Set security-related HTTP headers
app.use(helmet());

// Log HTTP requests in development
if (!isProduction) {
    app.use(morgan('dev'));
}

// Parse JSON and URL-encoded request bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- Session Management ---
// Configure sessions to be stored in MongoDB for persistence and production stability
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-very-strong-secret-key-that-is-at-least-32-chars-long',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions', // Optional: name of the collection to store sessions
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: isProduction, // Use secure cookies in production (requires HTTPS)
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        sameSite: 'lax',
    }
}));

// --- API Routes ---

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Mount the main application routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/payments', paymentRoutes);

// --- Error Handling Middleware ---
// Catch-all for handling errors that occur in the application
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred.',
        // Only show detailed error in development
        error: !isProduction ? err : {}
    });
});

// --- Server Startup ---
const startServer = async () => {
    if (!process.env.MONGODB_URI || !process.env.SESSION_SECRET) {
        console.error('FATAL ERROR: MONGODB_URI and SESSION_SECRET environment variables are required.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB.');

        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB or start server:', error);
        process.exit(1);
    }
};

startServer();