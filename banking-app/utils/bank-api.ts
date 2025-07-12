/**
 * Mock Bank API Service
 * 
 * This service simulates backend operations for bank account linking,
 * KYC verification, and balance checking. In a real application,
 * these would be actual API calls to banking partners and regulatory systems.
 */

export interface BankAccount {
    id: string
    bankName: string
    accountHolderName: string
    accountNumber: string
    ifscCode: string
    accountType: string
    balance: number
    status: 'pending' | 'verified' | 'rejected'
    kycStatus: 'pending' | 'verified' | 'rejected'
    linkedAt: string
    lastUpdated?: string
}

export interface BankDetails {
    bankName: string
    accountHolderName: string
    accountNumber: string
    ifscCode: string
    accountType: string
}

export interface KYCDetails {
    panNumber: string
    aadharNumber: string
    photoIdFile: File | null
    photoIdFileName: string
}

class BankAPIService {
    private mockAccounts: BankAccount[] = []

    // Simulate bank account verification
    async verifyBankAccount(bankDetails: BankDetails): Promise<{ success: boolean; message: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock validation logic
        if (!bankDetails.bankName || !bankDetails.accountHolderName ||
            !bankDetails.accountNumber || !bankDetails.ifscCode) {
            return { success: false, message: 'All bank details are required' }
        }

        if (bankDetails.accountNumber.length < 10) {
            return { success: false, message: 'Invalid account number' }
        }

        if (bankDetails.ifscCode.length !== 11) {
            return { success: false, message: 'Invalid IFSC code' }
        }

        // Simulate 90% success rate for valid accounts
        const isVerified = Math.random() > 0.1

        if (isVerified) {
            return { success: true, message: 'Bank account verified successfully' }
        } else {
            return { success: false, message: 'Bank account verification failed' }
        }
    }

    // Simulate KYC verification
    async verifyKYC(kycDetails: KYCDetails): Promise<{ success: boolean; message: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Mock validation logic
        if (!kycDetails.panNumber || !kycDetails.aadharNumber) {
            return { success: false, message: 'PAN and Aadhar numbers are required' }
        }

        if (kycDetails.panNumber.length !== 10) {
            return { success: false, message: 'Invalid PAN number' }
        }

        if (kycDetails.aadharNumber.length !== 12) {
            return { success: false, message: 'Invalid Aadhar number' }
        }

        if (!kycDetails.photoIdFile) {
            return { success: false, message: 'Photo ID is required' }
        }

        // Simulate 85% success rate for KYC
        const isVerified = Math.random() > 0.15

        if (isVerified) {
            return { success: true, message: 'KYC verification successful' }
        } else {
            return { success: false, message: 'KYC verification failed' }
        }
    }

    // Simulate linking bank account
    async linkBankAccount(bankDetails: BankDetails, kycDetails: KYCDetails): Promise<BankAccount> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        const newAccount: BankAccount = {
            id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            bankName: bankDetails.bankName,
            accountHolderName: bankDetails.accountHolderName,
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifscCode,
            accountType: bankDetails.accountType,
            balance: Math.floor(Math.random() * 100000) + 10000, // Random initial balance
            status: 'verified',
            kycStatus: 'verified',
            linkedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        }

        this.mockAccounts.push(newAccount)
        return newAccount
    }

    // Simulate fetching bank balance
    async getBankBalance(accountId: string): Promise<{ balance: number; lastUpdated: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const account = this.mockAccounts.find(acc => acc.id === accountId)
        if (!account) {
            throw new Error('Account not found')
        }

        // Simulate balance change
        const balanceChange = Math.floor(Math.random() * 10000) - 5000
        const newBalance = Math.max(0, account.balance + balanceChange)

        // Update the account balance
        account.balance = newBalance
        account.lastUpdated = new Date().toISOString()

        return {
            balance: newBalance,
            lastUpdated: account.lastUpdated
        }
    }

    // Get all linked accounts
    async getLinkedAccounts(): Promise<BankAccount[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        return [...this.mockAccounts]
    }

    // Simulate account deletion
    async unlinkBankAccount(accountId: string): Promise<{ success: boolean; message: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const index = this.mockAccounts.findIndex(acc => acc.id === accountId)
        if (index === -1) {
            return { success: false, message: 'Account not found' }
        }

        this.mockAccounts.splice(index, 1)
        return { success: true, message: 'Account unlinked successfully' }
    }

    // Simulate IFSC code validation
    async validateIFSCCode(ifscCode: string): Promise<{ valid: boolean; bankName?: string }> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock IFSC validation
        const validIFSCPatterns = [
            { code: 'SBIN0001234', bankName: 'State Bank of India' },
            { code: 'HDFC0001234', bankName: 'HDFC Bank' },
            { code: 'ICIC0001234', bankName: 'ICICI Bank' },
            { code: 'AXIS0001234', bankName: 'Axis Bank' },
            { code: 'KOTK0001234', bankName: 'Kotak Mahindra Bank' }
        ]

        const matchedBank = validIFSCPatterns.find(pattern =>
            ifscCode.toUpperCase().startsWith(pattern.code.substring(0, 4))
        )

        return {
            valid: !!matchedBank,
            bankName: matchedBank?.bankName
        }
    }
}

export const bankAPI = new BankAPIService() 