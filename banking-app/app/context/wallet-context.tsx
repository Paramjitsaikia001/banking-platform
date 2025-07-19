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
  const [balance, setBalance] = useState<number>(1000); // Default balance
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Reset wallet state and localStorage (for new users)
  const resetWallet = useCallback(() => {
    setBalance(0);
    setTransactions([]);
    localStorage.setItem("walletBalance", "0");
    localStorage.setItem("recentTransactions", JSON.stringify([]));
  }, []);

  // Load initial data from backend API after login/registration
  useEffect(() => {
    async function fetchWalletData() {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("bankapp_token")
            : null;
        if (!token) {
          // No user logged in, reset wallet state
          setBalance(0);
          setTransactions([]);
          localStorage.setItem("walletBalance", "0");
          localStorage.setItem("recentTransactions", JSON.stringify([]));
          return;
        }
        const fetchOptions = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch wallet balance
        const balanceRes = await fetch("/api/wallet/balance", fetchOptions);
        if (balanceRes.ok) {
          const balanceData = await balanceRes.json();
          setBalance(balanceData.data?.balance ?? 0);
          localStorage.setItem(
            "walletBalance",
            String(balanceData.data?.balance ?? 0)
          );
        } else {
          setBalance(0);
          localStorage.setItem("walletBalance", "0");
        }

        // Fetch transactions
        const txRes = await fetch("/api/wallet/transactions", fetchOptions);
        if (txRes.ok) {
          const txData = await txRes.json();
          setTransactions(txData.data ?? []);
          localStorage.setItem(
            "recentTransactions",
            JSON.stringify(txData.data ?? [])
          );
        } else {
          setTransactions([]);
          localStorage.setItem("recentTransactions", JSON.stringify([]));
        }
      } catch (err) {
        setBalance(0);
        setTransactions([]);
        localStorage.setItem("walletBalance", "0");
        localStorage.setItem("recentTransactions", JSON.stringify([]));
      }
    }
    fetchWalletData();
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    setBalance(newBalance);
    localStorage.setItem("walletBalance", newBalance.toString());
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prevTransactions) => {
      const newTransactions = [transaction, ...prevTransactions].slice(0, 10); // Keep only 10 most recent
      localStorage.setItem(
        "recentTransactions",
        JSON.stringify(newTransactions)
      );
      return newTransactions;
    });
  }, []);

  const refreshData = useCallback(() => {
    const storedBalance = localStorage.getItem("walletBalance");
    const storedTransactions = localStorage.getItem("recentTransactions");

    if (storedBalance) {
      setBalance(parseFloat(storedBalance));
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
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
