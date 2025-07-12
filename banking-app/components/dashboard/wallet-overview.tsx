"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Loader2 } from "lucide-react"
import { walletApi } from "@/utils/api"

export default function WalletOverview() {
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true)
        const response = await walletApi.getBalance()
        setBalance(response.balance)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch wallet balance:", err)
        setError("Failed to load wallet balance")
        // Set default balance for demo purposes
        setBalance(0)
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  // Mock data for income and expenses (in a real app, this would come from API)
  const income = 8240.00
  const expenses = 5894.33
  const totalBalance = balance ?? 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Wallet Overview</CardTitle>
        <CardDescription>Your current balance and spending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-muted-foreground">Total Balance</div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading balance...</span>
              </div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : (
              <div className="text-3xl font-bold">₹{totalBalance.toLocaleString()}</div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span>Income</span>
              </div>
              <span>₹{income.toLocaleString()}</span>
            </div>
            <Progress value={70} className="h-2 bg-muted" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <div className="flex items-center">
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                <span>Expenses</span>
              </div>
              <span>₹{expenses.toLocaleString()}</span>
            </div>
            <Progress value={45} className="h-2 bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
