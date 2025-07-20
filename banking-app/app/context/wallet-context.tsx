"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

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
  resetWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Reset wallet state for new users
  const resetWallet = useCallback(() => {
    setBalance(0);
    setTransactions([]);
  }, []);

  // Load wallet data from backend for the current user
  useEffect(() => {
    async function fetchWalletData() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("bankapp_token")
            : null;
        const storedUser =
          typeof window !== "undefined"
            ? localStorage.getItem("bankapp_user")
            : null;
        let userId = "";
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            userId = userObj._id || userObj.id || "";
          } catch {}
        }
        if (!token || !userId) {
          setBalance(0);
          setTransactions([]);
          return;
        }
        const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch wallet balance
        const balanceRes = await fetch(
          "http://localhost:5000/api/wallet/balance",
          fetchOptions
        );
        if (balanceRes.ok) {
          const balanceData = await balanceRes.json();
          setBalance(balanceData.data?.balance ?? 0);
        } else {
          setBalance(0);
        }

        // Fetch transactions
        const txRes = await fetch(
          "http://localhost:5000/api/transactions",
          fetchOptions
        );
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData.data ?? []);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        setBalance(0);
        setTransactions([]);
      }
    }
    fetchWalletData();
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setBalance(newBalance);
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prevTransactions) => {
      const newTransactions = [transaction, ...prevTransactions].slice(0, 10); // Keep only 10 most recent
      return newTransactions;
    });
  }, []);

  const refreshData = useCallback(() => {
    // Always fetch from backend for current user
    // ...existing code...
  }, []);

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        updateBalance,
        addTransaction,
        refreshData,
        resetWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
