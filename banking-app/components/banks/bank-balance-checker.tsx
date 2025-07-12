"use client"

import { useState } from "react"
import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Banknote, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"
import BankAccountsList from "./bank-accounts-list"

interface BankAccount {
  id: string
  bankName: string
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  accountType: string
  balance: number
  status: 'pending' | 'verified' | 'rejected'
  kycStatus: 'pending' | 'verified' | 'rejected'
  linkedAt: string
  lastUpdated?: string
}

export default function BankBalanceChecker() {
  const { user, updateBankAccount, getBankAccounts } = useUser()
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null)

  const linkedAccounts = getBankAccounts()

  const handleRefreshBalance = async (accountId: string) => {
    setIsRefreshing(accountId)
    
    try {
      // Simulate API call to fetch latest balance
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock balance update (in real app, this would come from bank API)
      const currentAccount = linkedAccounts.find(acc => acc.id === accountId)
      if (currentAccount) {
        const balanceChange = Math.floor(Math.random() * 10000) - 5000 // Random change between -5000 and +5000
        const newBalance = Math.max(0, currentAccount.balance + balanceChange)
        
        // Update in UserContext
        updateBankAccount(accountId, {
          balance: newBalance,
          lastUpdated: new Date().toISOString()
        })
        
        toast.success(`Balance updated for ${currentAccount.bankName}`)
      }
    } catch (error) {
      toast.error('Failed to refresh balance. Please try again.')
    } finally {
      setIsRefreshing(null)
    }
  }

  const getBalanceChange = (account: BankAccount) => {
    // Mock balance change for demonstration
    const change = Math.floor(Math.random() * 2000) - 1000
    return change
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Bank Balance Checker
          </CardTitle>
          <CardDescription>
            Check real-time balances of your linked bank accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please log in to check bank balances</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <BankAccountsList
      title="Bank Balance Checker"
      description="Check real-time balances of your linked bank accounts"
      showActions={false}
      compact={false}
    />
  )
} 