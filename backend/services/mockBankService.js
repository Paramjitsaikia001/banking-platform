// backend/services/mockBankService.js

// This module simulates an external bank's operations.
// In a real application, this would be replaced by actual API calls
// to a banking partner's API (e.g., Plaid, Stripe, a direct bank API).

// In-memory "database" for mock external bank accounts.
// Key: accountNumber, Value: { balance: Number, currency: String, status: String }
const externalBankAccounts = new Map();

// Initialize with some mock accounts for testing
// In a real scenario, these would be created/managed by the external bank
// and linked to your users through an onboarding process.
const initializeMockAccounts = () => {
    if (externalBankAccounts.size === 0) {
        externalBankAccounts.set('EXT1234567890', { balance: 50000, currency: 'INR', status: 'active' });
        externalBankAccounts.set('EXT9876543210', { balance: 100000, currency: 'INR', status: 'active' });
        externalBankAccounts.set('EXT1122334455', { balance: 25000, currency: 'USD', status: 'active' });
    }
};
initializeMockAccounts(); // Call once on module load

/**
 * Simulates a deposit into an external bank account.
 * @param {string} accountNumber - The external bank account number.
 * @param {number} amount - The amount to deposit.
 * @returns {Promise<{success: boolean, newBalance?: number, message?: string}>}
 */
const externalDeposit = async (accountNumber, amount) => {
    return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            const account = externalBankAccounts.get(accountNumber);
            if (!account) {
                return resolve({ success: false, message: 'External bank account not found.' });
            }
            if (account.status !== 'active') {
                return resolve({ success: false, message: 'External bank account is not active.' });
            }
            if (amount <= 0) {
                return resolve({ success: false, message: 'Deposit amount must be positive.' });
            }

            account.balance += amount;
            externalBankAccounts.set(accountNumber, account); // Update map
            console.log(`[MockBank] Deposited ${amount} to ${accountNumber}. New balance: ${account.balance}`);
            resolve({ success: true, newBalance: account.balance });
        }, 500); // 500ms delay
    });
};

/**
 * Simulates a withdrawal from an external bank account.
 * @param {string} accountNumber - The external bank account number.
 * @param {number} amount - The amount to withdraw.
 * @returns {Promise<{success: boolean, newBalance?: number, message?: string}>}
 */
const externalWithdrawal = async (accountNumber, amount) => {
    return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            const account = externalBankAccounts.get(accountNumber);
            if (!account) {
                return resolve({ success: false, message: 'External bank account not found.' });
            }
            if (account.status !== 'active') {
                return resolve({ success: false, message: 'External bank account is not active.' });
            }
            if (amount <= 0) {
                return resolve({ success: false, message: 'Withdrawal amount must be positive.' });
            }
            if (account.balance < amount) {
                return resolve({ success: false, message: 'Insufficient funds in external bank account.' });
            }

            account.balance -= amount;
            externalBankAccounts.set(accountNumber, account); // Update map
            console.log(`[MockBank] Withdrew ${amount} from ${accountNumber}. New balance: ${account.balance}`);
            resolve({ success: true, newBalance: account.balance });
        }, 500); // 500ms delay
    });
};

/**
 * Simulates getting the balance of an external bank account.
 * @param {string} accountNumber - The external bank account number.
 * @returns {Promise<{success: boolean, balance?: number, message?: string}>}
 */
const getExternalBalance = async (accountNumber) => {
    return new Promise(resolve => {
        setTimeout(() => { // Simulate network delay
            const account = externalBankAccounts.get(accountNumber);
            if (!account) {
                return resolve({ success: false, message: 'External bank account not found.' });
            }
            resolve({ success: true, balance: account.balance });
        }, 200); // 200ms delay
    });
};

module.exports = {
    externalDeposit,
    externalWithdrawal,
    getExternalBalance,
    // For testing/demonstration, you might want to expose a way to add/reset mock accounts
    _addMockAccount: (accNum, initialBalance, currency = 'INR', status = 'active') => {
        externalBankAccounts.set(accNum, { balance: initialBalance, currency, status });
        console.log(`[MockBank] Added mock account: ${accNum} with balance ${initialBalance}`);
    },
    _resetMockAccounts: () => {
        externalBankAccounts.clear();
        initializeMockAccounts();
        console.log('[MockBank] Reset mock accounts.');
    }
};
