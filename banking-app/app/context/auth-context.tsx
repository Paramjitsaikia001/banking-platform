"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { walletApi } from "@/utils/api"

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

type User = {
  id: string
  name: string
  email: string
  phone: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string, isOtp?: boolean) => Promise<void>
  register: (email: string, password: string, name: string, phone: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("bankapp_user")
    const storedToken = localStorage.getItem("bankapp_token")
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        const user: User = {
          id: userData._id || userData.id,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phoneNumber,
        }
        setUser(user)
      } catch (error) {
        console.error("Error parsing stored user data:", error)
        // Clear invalid data
        localStorage.removeItem("bankapp_user")
        localStorage.removeItem("bankapp_token")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, isOtp = false) => {
    setIsLoading(true)
    try {
      // Call the real login API
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      localStorage.setItem("bankapp_token", data.token);
      localStorage.setItem("bankapp_user", JSON.stringify(data.user));

      // Update user state
      const userData: User = {
        id: data.user._id || data.user.id,
        name: `${data.user.firstName} ${data.user.lastName}`,
        email: data.user.email,
        phone: data.user.phoneNumber,
      };

      setUser(userData);

      // Initialize wallet after successful login
      try {
        await walletApi.initializeWallet()
        console.log("Wallet initialized successfully")
      } catch (walletError) {
        console.error("Wallet initialization failed:", walletError)
        // Don't throw error here as login was successful
        // Wallet can be initialized later
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, phone: string) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        phone: phone,
      }

      // In a real app, we would not log in the user immediately after registration
      // but would instead redirect to a verification page or login page
      setUser(null)

      // Note: Wallet will be initialized when user logs in for the first time
    } catch (error) {
      console.error("Registration failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("bankapp_user")
    localStorage.removeItem("bankapp_token")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
