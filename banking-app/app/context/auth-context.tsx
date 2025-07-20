"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { walletApi } from "@/utils/api";
import { useUser } from "@/context/UserContext";

// API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, isOtp?: boolean) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("bankapp_user");
    const storedToken = localStorage.getItem("bankapp_token");

    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        const user: User = {
          id: userData._id || userData.id,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phoneNumber,
        };
        setUser(user);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("bankapp_user");
        localStorage.removeItem("bankapp_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, isOtp = false) => {
    setIsLoading(true);
    try {
      // Call the real login API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem("bankapp_token", data.token);
      localStorage.setItem("bankapp_user", JSON.stringify(data.user));

      // Update user state with fallbacks for missing fields
      const userData: User = {
        id: data.user._id || data.user.id || "",
        name:
          `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() ||
          data.user.name ||
          "User",
        email: data.user.email || "",
        phone: data.user.phoneNumber || data.user.phone || "",
      };

      setUser(userData);

      // Initialize wallet after successful login
      try {
        await walletApi.initializeWallet();
        console.log("Wallet initialized successfully");
      } catch (walletError) {
        let errorMsg = "Wallet initialization failed: ";
        if (
          walletError &&
          typeof walletError === "object" &&
          ("message" in walletError ||
            "error" in walletError ||
            "stack" in walletError)
        ) {
          if (
            "message" in walletError &&
            typeof (walletError as any).message === "string"
          ) {
            errorMsg += (walletError as any).message;
          } else if (
            "error" in walletError &&
            typeof (walletError as any).error === "string"
          ) {
            errorMsg += (walletError as any).error;
          } else {
            errorMsg += JSON.stringify(walletError);
          }
          if (
            "stack" in walletError &&
            typeof (walletError as any).stack === "string"
          ) {
            errorMsg += "\nStack: " + (walletError as any).stack;
          }
        } else {
          errorMsg += String(walletError);
        }
        console.error(errorMsg);
        // Don't throw error here as login was successful
        // Wallet can be initialized later
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    setIsLoading(true);
    try {
      // Split name into first and last (or prompt for both in your form)
      const [firstName, ...rest] = name.split(" ");
      const lastName = rest.join(" ") || "User";
      // You should collect dateOfBirth and pin from your registration form!
      const dateOfBirth = "1990-01-01"; // Replace with real value from form
      const pin = "1234"; // Replace with real value from form

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phoneNumber: phone,
          dateOfBirth,
          pin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      const data = await response.json();

      // Store token and user data
      localStorage.setItem("bankapp_token", data.token);
      localStorage.setItem("bankapp_user", JSON.stringify(data.user));

      // Update user state with fallbacks for missing fields
      const userData: User = {
        id: data.user._id || data.user.id || "",
        name:
          `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() ||
          data.user.name ||
          "User",
        email: data.user.email || "",
        phone: data.user.phoneNumber || data.user.phone || "",
      };
      setUser(userData);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bankapp_user");
    localStorage.removeItem("bankapp_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
