'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface Transaction {
  id: string | number;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  updateBalance: (newBalance: number) => void;
  addTransaction: (transaction: Transaction) => void;
  refreshData: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(1000); // Default balance
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load initial data from localStorage
  useEffect(() => {
    const storedBalance = localStorage.getItem('walletBalance');
    const storedTransactions = localStorage.getItem('recentTransactions');

    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setBalance(newBalance);
    localStorage.setItem('walletBalance', newBalance.toString());
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prevTransactions => {
      const newTransactions = [transaction, ...prevTransactions].slice(0, 10); // Keep only 10 most recent
      localStorage.setItem('recentTransactions', JSON.stringify(newTransactions));
      return newTransactions;
    });
  }, []);

  const refreshData = useCallback(() => {
    const storedBalance = localStorage.getItem('walletBalance');
    const storedTransactions = localStorage.getItem('recentTransactions');

    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      balance,
      transactions,
      updateBalance,
      addTransaction,
      refreshData
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
} 