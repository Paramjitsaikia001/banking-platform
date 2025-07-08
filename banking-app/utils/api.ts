/**
 * API Client Configuration
 * 
 * This file contains the centralized API client for the banking platform.
 * It provides a consistent interface for all backend API calls with:
 * - Automatic error handling
 * - Request/response formatting
 * - Authentication headers
 * - Environment-based configuration
 * 
 * The API client is used throughout the application for:
 * - User authentication and registration
 * - Banking operations
 * - Data fetching and updates
 */

// API base URL - configurable via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// TypeScript interface for API request options
interface ApiOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}

/**
 * Generic API function that handles all HTTP requests
 * 
 * @param endpoint - API endpoint path (e.g., '/auth/login')
 * @param options - Request options (method, body, headers)
 * @returns Promise with API response data
 */
async function api(endpoint: string, options: ApiOptions = {}) {
    // Get authentication token
    const token = typeof window !== 'undefined' ? localStorage.getItem('bankapp_token') : null;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        // Automatically stringify request body for JSON API
        body: options.body ? JSON.stringify(options.body) : undefined,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
        // Include cookies for session-based authentication
        credentials: 'include',
    });

    // Handle API errors consistently
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }

    return response.json();
}

/**
 * Authentication API endpoints
 * 
 * This object contains all authentication-related API calls:
 * - Registration flow (phone verification, email verification)
 * - Login/logout functionality
 * - KYC (Know Your Customer) submission
 * - Account verification processes
 */
export const authApi = {
    /**
     * Start the registration process by sending OTP to phone number
     * @param phoneNumber - User's phone number
     */
    startRegistration: (phoneNumber: string) =>
        api('/auth/start-registration', {
            method: 'POST',
            body: { phoneNumber: phoneNumber.replace(/\D/g, '') } // Remove non-digits
        }),

    /**
     * Verify phone number with OTP code
     * @param phoneNumber - User's phone number
     * @param otp - One-time password received via SMS
     */
    verifyPhone: (phoneNumber: string, otp: string) =>
        api('/auth/verify-phone', {
            method: 'POST',
            body: {
                phoneNumber: phoneNumber.replace(/\D/g, ''),
                otp
            }
        }),

    /**
     * Complete user registration with all required data
     * @param data - Complete user registration data
     */
    register: (data: any) =>
        api('/auth/register', { method: 'POST', body: data }),

    /**
     * Send email verification OTP
     * @param email - User's email address
     * @param phoneNumber - User's verified phone number
     */
    sendEmailVerification: (email: string, phoneNumber: string) =>
        api('/auth/send-email-verification', {
            method: 'POST',
            body: { email, phoneNumber }
        }),

    /**
     * Verify email address with OTP code
     * @param email - User's email address
     * @param otp - One-time password received via email
     */
    verifyEmail: (email: string, otp: string) =>
        api('/auth/verify-email', { method: 'POST', body: { email, otp } }),

    /**
     * Submit KYC (Know Your Customer) documents and information
     * @param kycDetails - KYC documents and personal information
     */
    submitKyc: (kycDetails: any) =>
        api('/auth/kyc', { method: 'POST', body: kycDetails }),

    /**
     * Submit KYC during registration (no auth required)
     * @param kycDetails - KYC documents and personal information
     */
    submitKycRegistration: (kycDetails: any) =>
        api('/auth/kyc-registration', { method: 'POST', body: kycDetails }),
};

/**
 * Wallet API endpoints
 * 
 * This object contains all wallet-related API calls:
 * - Wallet balance management
 * - Transaction history
 * - Money transfers
 * - Wallet initialization
 */
export const walletApi = {
    /**
     * Get current wallet balance
     */
    getBalance: () =>
        api('/wallet/balance', { method: 'GET' }),

    /**
     * Initialize wallet for new user (called after login)
     */
    initializeWallet: () =>
        api('/wallet/initialize', { method: 'POST' }),

    /**
     * Add money to wallet
     * @param amount - Amount to add
     * @param paymentMethod - Payment method used
     */
    addMoney: (amount: number, paymentMethod: string) =>
        api('/wallet/add-money', {
            method: 'POST',
            body: { amount, paymentMethod }
        }),

    /**
     * Get transaction history
     */
    getTransactions: () =>
        api('/wallet/transactions', { method: 'GET' }),

    /**
     * Transfer money to another wallet
     * @param recipientUpiId - Recipient's UPI ID
     * @param amount - Amount to transfer
     * @param description - Transfer description
     */
    transfer: (recipientUpiId: string, amount: number, description?: string) =>
        api('/wallet/transfer', {
            method: 'POST',
            body: { recipientUpiId, amount, description }
        }),
};