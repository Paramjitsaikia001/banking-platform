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
 * 
 * The context is used throughout the app to:
 * - Display user information in components
 * - Check authentication status for protected routes
 * - Manage user wallet and banking operations
 * - Handle login/logout functionality
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

// Context interface defining available methods and state
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
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
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Handle user state updates with localStorage persistence
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    setIsAuthenticated(!!newUser);
    
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  // Logout function to clear user data and authentication
  const logout = () => {
    handleSetUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, isAuthenticated, logout }}>
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