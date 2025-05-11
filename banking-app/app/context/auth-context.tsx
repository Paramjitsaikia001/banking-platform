"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, isOtp = false) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: "John Doe",
        email: email,
        phone: isOtp ? email : "+1 (555) 000-0000",
      }

      setUser(userData)
      localStorage.setItem("bankapp_user", JSON.stringify(userData))
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
