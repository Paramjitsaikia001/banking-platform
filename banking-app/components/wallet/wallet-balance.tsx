"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Eye, EyeOff, Building } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { walletApi } from "@/utils/api"
import { toast } from "sonner"

export default function WalletBalance() {
  const [showBalance, setShowBalance] = useState(true)
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await walletApi.getBalance()
        setBalance(response.balance || 0)
      } catch (error: any) {
        console.error("Failed to fetch balance:", error)
        toast.error("Failed to load wallet balance")
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your current financial status</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wallet">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="bank">Bank Account</TabsTrigger>
          </TabsList>
          <TabsContent value="wallet" className="space-y-4 pt-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Available Balance</div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold">
                {loading ? "Loading..." : (showBalance ? formatCurrency(balance) : "••••••••")}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="flex items-center text-sm font-medium">
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  <span>Income</span>
                </div>
                <div className="mt-1 text-xl font-bold">
                  {showBalance ? formatCurrency(balance) : "••••••"}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center text-sm font-medium">
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  <span>Expenses</span>
                </div>
                <div className="mt-1 text-xl font-bold">
                  {showBalance ? "₹0.00" : "••••••"}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="bank" className="space-y-4 pt-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Bank Balance</div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-3xl font-bold">{showBalance ? "₹0.00" : "••••••••"}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">No Bank Account</p>
                  <p className="text-xs text-muted-foreground">Link your bank account</p>
                </div>
                <div className="text-sm font-bold">{showBalance ? "₹0.00" : "••••••"}</div>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/bank-accounts">
                <Building className="mr-2 h-4 w-4" />
                Link Bank Account
              </Link>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
