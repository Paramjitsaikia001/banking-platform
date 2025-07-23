// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const listEndpoints = require('express-list-endpoints'); // <-- Added for debugging

// --- Route Imports ---
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');
const walletRoutes = require('./routes/wallet.routes');
const bankRoutes = require('./routes/bank.routes');
const paymentRoutes = require('./routes/payment.routes');

// --- Initialize Express App ---
const app = express();

// --- Core Middleware ---
const isProduction = process.env.NODE_ENV === 'production';


// app.use(cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     origin:'https://banking-platform-paramjitsaikia001s-projects.vercel.app',
//     credentials: true,
// }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://banking-platform-paramjitsaikia001s-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(helmet());
if (!isProduction) {
    app.use(morgan('dev'));
}
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// --- Session Management ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'a-very-strong-secret-key-that-is-at-least-32-chars-long',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collectionName: 'sessions',
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: isProduction,
        httpOnly: true,
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

// --- ADD THIS DEBUG ROUTE ---
// This endpoint will show a list of all registered routes.
app.get('/debug-routes', (req, res) => {
    console.log('Fetching debug routes...');
    res.status(200).json(listEndpoints(app));
});
// -----------------------------

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred.',
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