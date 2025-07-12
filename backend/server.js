require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');

// Import routes
const authRoutes = require('./routes/auth.routes');
// Removed: const bankAccountRoutes = require('./routes/bankAccount.routes'); // This route file is now redundant
const transactionRoutes = require('./routes/transaction.routes');
const walletRoutes = require('./routes/wallet.routes');
const bankRoutes = require('./routes/bank.routes'); // This now handles all bank account operations
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Configure helmet for security
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "unsafe-none" },
    crossOriginEmbedderPolicy: false
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to false for development
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax',
        httpOnly: false // Set to false for Postman testing
    }
}));

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API documentation route
app.get('/api-docs', (req, res) => {
    res.json({
        message: 'Banking Platform API Documentation',
        endpoints: {
            auth: {
                register: {
                    method: 'POST',
                    path: '/api/auth/register',
                    body: {
                        email: 'string',
                        password: 'string',
                        firstName: 'string',
                        lastName: 'string',
                        phoneNumber: 'string'
                    }
                },
                login: {
                    method: 'POST',
                    path: '/api/auth/login',
                    body: {
                        email: 'string',
                        password: 'string'
                    }
                },
                getCurrentUser: {
                    method: 'GET',
                    path: '/api/auth/me',
                    auth: 'required'
                }
            },
            // Updated 'accounts' documentation to reflect consolidated '/api/bank/accounts' routes
            bankAccounts: { // Renamed from 'accounts' for clarity
                create: {
                    method: 'POST',
                    path: '/api/bank/accounts', // Updated path
                    auth: 'required',
                    body: {
                        bankName: 'string',
                        accountHolderName: 'string',
                        accountNumber: 'string',
                        ifscCode: 'string',
                        accountType: 'savings|checking|business|current', // Updated enum
                        currency: 'string',
                        isDefault: 'boolean (optional)'
                    }
                },
                list: {
                    method: 'GET',
                    path: '/api/bank/accounts', // Updated path
                    auth: 'required'
                },
                get: {
                    method: 'GET',
                    path: '/api/bank/accounts/:accountId', // Updated path and param name
                    auth: 'required'
                },
                update: {
                    method: 'PATCH',
                    path: '/api/bank/accounts/:accountId', // Updated path and param name
                    auth: 'required',
                    body: {
                        isDefault: 'boolean (optional)',
                        status: 'active|inactive|frozen|closed (optional)', // Updated enum
                        isVerified: 'boolean (optional, for admin/internal use)'
                    }
                },
                delete: {
                    method: 'DELETE',
                    path: '/api/bank/accounts/:accountId', // Updated path and param name
                    auth: 'required'
                },
                transferToBank: {
                    method: 'POST',
                    path: '/api/bank/transfer-to-bank',
                    auth: 'required',
                    body: {
                        accountId: 'string',
                        amount: 'number',
                        pin: 'string'
                    }
                },
                transferFromBank: {
                    method: 'POST',
                    path: '/api/bank/transfer-from-bank',
                    auth: 'required',
                    body: {
                        accountId: 'string',
                        amount: 'number',
                        pin: 'string'
                    }
                }
            },
            transactions: {
                create: {
                    method: 'POST',
                    path: '/api/transactions',
                    auth: 'required',
                    body: {
                        type: 'deposit|withdrawal|transfer|billPayment|recharge',
                        amount: 'number',
                        description: 'string',
                        paymentMethod: 'wallet|bank|card|upi',
                        recipientDetails: {
                            userId: 'string (optional, for transfers)',
                            name: 'string',
                            phone: 'string',
                            email: 'string'
                        },
                        bankAccount: {
                            bankName: 'string (optional, for bank-related transactions)',
                            accountNumber: 'string',
                            ifscCode: 'string'
                        }
                    }
                },
                list: {
                    method: 'GET',
                    path: '/api/transactions',
                    auth: 'required',
                    query: {
                        type: 'string (optional)',
                        startDate: 'date (optional)',
                        endDate: 'date (optional)',
                        limit: 'number (optional, default 10)',
                        skip: 'number (optional, default 0)'
                    }
                },
                stats: {
                    method: 'GET',
                    path: '/api/transactions/stats',
                    auth: 'required',
                    query: {
                        startDate: 'date (optional)',
                        endDate: 'date (optional)'
                    }
                },
                get: {
                    method: 'GET',
                    path: '/api/transactions/:id',
                    auth: 'required'
                }
            },
            wallet: {
                getBalance: {
                    method: 'GET',
                    path: '/api/wallet/balance',
                    auth: 'required'
                },
                addMoney: {
                    method: 'POST',
                    path: '/api/wallet/add-money',
                    auth: 'required',
                    body: {
                        amount: 'number',
                        paymentMethod: 'card|bank|upi',
                        transactionRef: 'string (optional, for external ref)'
                    }
                },
                transfer: {
                    method: 'POST',
                    path: '/api/wallet/transfer',
                    auth: 'required',
                    body: {
                        recipientIdentifier: 'string (userId, phoneNumber, or upiId)',
                        amount: 'number',
                        description: 'string (optional)',
                        pin: 'string'
                    }
                }
            },
            payments: {
                qrPayment: {
                    method: 'POST',
                    path: '/api/payments/qr',
                    auth: 'required',
                    body: {
                        recipientId: 'string (user ID)',
                        amount: 'number',
                        pin: 'string'
                    }
                }
            }
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
// Removed: app.use('/api/accounts', bankAccountRoutes); // This route is now handled by /api/bank
app.use('/api/transactions', transactionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/bank', bankRoutes); // All bank account operations are now under /api/bank
app.use('/api/payments', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/banking-platform');
        console.log('Connected to MongoDB');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
