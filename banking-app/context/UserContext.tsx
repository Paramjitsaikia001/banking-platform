/**
 * User Context Provider
 * 
 * This context manages user data and authentication state across the banking application.
 * It provides:
 * - User profile information (name, email, phone, wallet details)
 * - Authentication state management
 * - Persistent user data storage in localStorage
 * - KYC (Know Your Customer) status tracking
 * - Wallet balance and status
 * - Bank account management and storage
 * 
 * The context is used throughout the app to:
 * - Display user information in components
 * - Check authentication status for protected routes
 * - Manage user wallet and banking operations
 * - Handle login/logout functionality
 * - Store and retrieve bank account details
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Bank account interface
interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  balance: number;
  status: 'pending' | 'verified' | 'rejected';
  kycStatus: 'pending' | 'verified' | 'rejected';
  linkedAt: string;
  lastUpdated?: string;
  transactions?: any[]; // Add transactions array
}

// User interface defining the structure of user data
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  wallet: {
    balance: number;
    isActive: boolean;
  };
  kycDetails?: {
    status: 'pending' | 'verified' | 'rejected';
  };
  // Additional profile properties
  upiId?: string;
  role?: string;
  profilePicture?: string;
  profileEmoji?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  occupation?: string;
  company?: string;
  bio?: string;
  // Bank accounts
  bankAccounts?: BankAccount[];
}

// Context interface defining available methods and state
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  addBankAccount: (account: BankAccount) => void;
  updateBankAccount: (accountId: string, updates: Partial<BankAccount>) => void;
  removeBankAccount: (accountId: string) => void;
  getBankAccounts: () => BankAccount[];
  addBankTransaction: (accountId: string, transaction: any) => void; // Add function
}

// Create the context with undefined as default value
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // State management for user data and authentication
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize user data from localStorage on component mount
  useEffect(() => {
    // Check for token and user data in localStorage on mount
    const token = localStorage.getItem('bankapp_token');
    const storedUser = localStorage.getItem('bankapp_user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Convert AuthContext user format to UserContext format
        const userId = userData._id || userData.id
        const user: User = {
          id: userId,
          firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : ''),
          lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : ''),
          email: userData.email,
          phoneNumber: userData.phoneNumber || userData.phone,
          wallet: userData.wallet || { balance: 0, isActive: true },
          kycDetails: userData.kycDetails || { status: 'pending' },
          upiId: userData.upiId,
          role: userData.role || 'user',
          profilePicture: userData.profilePicture,
          profileEmoji: userData.profileEmoji,
          dateOfBirth: userData.dateOfBirth,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          pincode: userData.pincode,
          occupation: userData.occupation,
          company: userData.company,
          bio: userData.bio,
          bankAccounts: userData.bankAccounts || [],
        };

        // Load saved emoji from localStorage if available
        if (userId) {
          const savedEmoji = localStorage.getItem(`user_emoji_${userId}`)
          if (savedEmoji) {
            user.profileEmoji = savedEmoji
          }
          
          // Load saved bank accounts from localStorage
          const savedBankAccounts = localStorage.getItem(`user_bank_accounts_${userId}`)
          if (savedBankAccounts) {
            try {
              user.bankAccounts = JSON.parse(savedBankAccounts)
            } catch (error) {
              console.error('Error parsing saved bank accounts:', error)
              user.bankAccounts = []
            }
          }
        }
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('bankapp_user');
        localStorage.removeItem('bankapp_token');
      }
    }
  }, []);

  // Listen for changes in localStorage to sync with AuthContext
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('bankapp_token');
      const storedUser = localStorage.getItem('bankapp_user');
      
      if (!token || !storedUser) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      try {
        const userData = JSON.parse(storedUser);
        const userId = userData._id || userData.id
        const user: User = {
          id: userId,
          firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : ''),
          lastName: userData.lastName || (userData.name ? userData.name.split(' ').slice(1).join(' ') : ''),
          email: userData.email,
          phoneNumber: userData.phoneNumber || userData.phone,
          wallet: userData.wallet || { balance: 0, isActive: true },
          kycDetails: userData.kycDetails || { status: 'pending' },
          upiId: userData.upiId,
          role: userData.role || 'user',
          profilePicture: userData.profilePicture,
          profileEmoji: userData.profileEmoji,
          dateOfBirth: userData.dateOfBirth,
          address: userData.address,
          city: userData.city,
          state: userData.state,
          pincode: userData.pincode,
          occupation: userData.occupation,
          company: userData.company,
          bio: userData.bio,
          bankAccounts: userData.bankAccounts || [],
        };

        // Load saved emoji from localStorage if available
        if (userId) {
          const savedEmoji = localStorage.getItem(`user_emoji_${userId}`)
          if (savedEmoji) {
            user.profileEmoji = savedEmoji
          }
          
          // Load saved bank accounts from localStorage
          const savedBankAccounts = localStorage.getItem(`user_bank_accounts_${userId}`)
          if (savedBankAccounts) {
            try {
              user.bankAccounts = JSON.parse(savedBankAccounts)
            } catch (error) {
              console.error('Error parsing saved bank accounts:', error)
              user.bankAccounts = []
            }
          }
        }
        setUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    // Listen for storage events (when localStorage changes in other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Handle user state updates with localStorage persistence
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);
    
    if (newUser) {
      localStorage.setItem('bankapp_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('bankapp_user');
      localStorage.removeItem('bankapp_token');
    }
  };

  // Add bank account to user
  const addBankAccount = (account: BankAccount) => {
    if (user) {
      const updatedUser = {
        ...user,
        bankAccounts: [...(user.bankAccounts || []), account]
      };
      setUser(updatedUser);
      
      // Save to localStorage
      localStorage.setItem('bankapp_user', JSON.stringify(updatedUser));
      if (user.id) {
        localStorage.setItem(`user_bank_accounts_${user.id}`, JSON.stringify(updatedUser.bankAccounts));
      }
    }
  };

  // Update bank account
  const updateBankAccount = (accountId: string, updates: Partial<BankAccount>) => {
    if (user && user.bankAccounts) {
      const updatedAccounts = user.bankAccounts.map(account =>
        account.id === accountId ? { ...account, ...updates } : account
      );
      const updatedUser = { ...user, bankAccounts: updatedAccounts };
      setUser(updatedUser);
      
      // Save to localStorage
      localStorage.setItem('bankapp_user', JSON.stringify(updatedUser));
      if (user.id) {
        localStorage.setItem(`user_bank_accounts_${user.id}`, JSON.stringify(updatedAccounts));
      }
    }
  };

  // Remove bank account
  const removeBankAccount = (accountId: string) => {
    if (user && user.bankAccounts) {
      const updatedAccounts = user.bankAccounts.filter(account => account.id !== accountId);
      const updatedUser = { ...user, bankAccounts: updatedAccounts };
      setUser(updatedUser);
      
      // Save to localStorage
      localStorage.setItem('bankapp_user', JSON.stringify(updatedUser));
      if (user.id) {
        localStorage.setItem(`user_bank_accounts_${user.id}`, JSON.stringify(updatedAccounts));
      }
    }
  };

  // Add bank transaction to a specific bank account
  const addBankTransaction = (accountId: string, transaction: any) => {
    if (user && user.bankAccounts) {
      const updatedAccounts = user.bankAccounts.map(account => {
        if (account.id === accountId) {
          const updatedTransactions = [transaction, ...(account.transactions || [])].slice(0, 10);
          return { ...account, transactions: updatedTransactions };
        }
        return account;
      });
      const updatedUser = { ...user, bankAccounts: updatedAccounts };
      setUser(updatedUser);
      // Save to localStorage
      localStorage.setItem('bankapp_user', JSON.stringify(updatedUser));
      if (user.id) {
        localStorage.setItem(`user_bank_accounts_${user.id}`, JSON.stringify(updatedAccounts));
      }
    }
  };

  // Get bank accounts
  const getBankAccounts = (): BankAccount[] => {
    return user?.bankAccounts || [];
  };

  // Logout function to clear user data and authentication
  const logout = () => {
    handleSetUser(null);
    // Also clear auth context data
    localStorage.removeItem('bankapp_user');
    localStorage.removeItem('bankapp_token');
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser: handleSetUser, 
      isAuthenticated, 
      logout,
      addBankAccount,
      updateBankAccount,
      removeBankAccount,
      getBankAccounts,
      addBankTransaction // Provide function
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 