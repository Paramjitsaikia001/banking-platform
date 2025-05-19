// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');

// Import routes
const authRoutes = require('./routes/auth');
const bankAccountRoutes = require('./routes/bankAccount.routes');
const transactionRoutes = require('./routes/transaction.routes');

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
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
    httpOnly: true
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
      accounts: {
        create: {
          method: 'POST',
          path: '/api/accounts',
          auth: 'required',
          body: {
            accountType: 'savings|checking|business',
            currency: 'string'
          }
        },
        list: {
          method: 'GET',
          path: '/api/accounts',
          auth: 'required'
        },
        get: {
          method: 'GET',
          path: '/api/accounts/:id',
          auth: 'required'
        },
        update: {
          method: 'PATCH',
          path: '/api/accounts/:id',
          auth: 'required',
          body: {
            isDefault: 'boolean'
          }
        },
        delete: {
          method: 'DELETE',
          path: '/api/accounts/:id',
          auth: 'required'
        }
      },
      transactions: {
        create: {
          method: 'POST',
          path: '/api/transactions',
          auth: 'required',
          body: {
            accountId: 'string',
            type: 'deposit|withdrawal|transfer|payment|bill',
            amount: 'number',
            description: 'string',
            recipientDetails: {
              name: 'string',
              accountNumber: 'string',
              bankName: 'string'
            }
          }
        },
        list: {
          method: 'GET',
          path: '/api/transactions',
          auth: 'required',
          query: {
            accountId: 'string',
            type: 'string',
            startDate: 'date',
            endDate: 'date'
          }
        },
        stats: {
          method: 'GET',
          path: '/api/transactions/stats',
          auth: 'required',
          query: {
            startDate: 'date',
            endDate: 'date'
          }
        },
        get: {
          method: 'GET',
          path: '/api/transactions/:id',
          auth: 'required'
        }
      }
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', bankAccountRoutes);
app.use('/api/transactions', transactionRoutes);

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