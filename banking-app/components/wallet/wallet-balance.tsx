"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Eye, EyeOff, Building, Banknote } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useWallet } from "@/app/context/wallet-context"
import { useUser } from "@/context/UserContext"

export default function WalletBalance() {
  const [showBalance, setShowBalance] = useState(true)
  const { balance } = useWallet()
  const { getBankAccounts } = useUser()
  const bankAccounts = getBankAccounts()

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
                {showBalance ? formatCurrency(balance) : "••••••••"}
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
            {bankAccounts.length === 0 ? (
              <>
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
              </>
            ) : (
              <div className="space-y-3">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="rounded-lg border p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-primary/10 rounded-full">
                        <Banknote className="h-5 w-5 text-primary" />
                      </span>
                      <div>
                        <div className="font-medium">{account.bankName}</div>
                        <div className="text-xs text-muted-foreground">
                          {account.accountHolderName} • {account.accountNumber.slice(-4)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {showBalance ? formatCurrency(account.balance) : "••••••••"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {account.accountType} • IFSC: {account.ifscCode}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
