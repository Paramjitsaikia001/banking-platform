"use client"

import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Banknote, 
  Building2,
  Trash2,
  Plus,
  Eye,
  EyeOff
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

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

interface BankAccountsListProps {
  title?: string
  description?: string
  showActions?: boolean
  onAccountSelect?: (account: BankAccount) => void
  selectedAccountId?: string
  compact?: boolean
}

export default function BankAccountsList({ 
  title = "Linked Bank Accounts",
  description = "Your connected bank accounts and their current status",
  showActions = true,
  onAccountSelect,
  selectedAccountId,
  compact = false
}: BankAccountsListProps) {
  const { user, removeBankAccount, getBankAccounts } = useUser()
  const [showBalances, setShowBalances] = useState<{ [key: string]: boolean }>({})
  
  const linkedAccounts = getBankAccounts()

  const handleRemoveAccount = (accountId: string) => {
    removeBankAccount(accountId)
    toast.success('Bank account removed successfully')
  }

  const toggleBalanceVisibility = (accountId: string) => {
    setShowBalances(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }))
  }

  const formatBalance = (balance: number, isVisible: boolean) => {
    if (!isVisible) {
      return '••••••••'
    }
    return `₹${balance.toLocaleString()}`
  }

  const handleAccountClick = (account: BankAccount) => {
    if (onAccountSelect) {
      onAccountSelect(account)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please log in to view bank accounts</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (linkedAccounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Banknote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No linked bank accounts found</p>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Link a bank account to get started
            </p>
            <Button asChild>
              <Link href="/banks">
                <Plus className="h-4 w-4 mr-2" />
                Link Bank Account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {linkedAccounts.map((account) => {
            const isVisible = showBalances[account.id] || false
            const isSelected = selectedAccountId === account.id
            
            return (
              <div 
                key={account.id} 
                className={`border rounded-lg p-4 transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                } ${onAccountSelect ? 'cursor-pointer' : ''}`}
                onClick={() => handleAccountClick(account)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Banknote className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{account.bankName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {account.accountHolderName} • {account.accountNumber.slice(-4)}
                      </p>
                      {!compact && (
                        <p className="text-sm text-muted-foreground">
                          Balance: {formatBalance(account.balance, isVisible)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={account.status === 'verified' ? 'secondary' : 'outline'}>
                      {account.status}
                    </Badge>
                    {showActions && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBalanceVisibility(account.id)
                          }}
                        >
                          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveAccount(account.id)
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {!compact && (
                  <>
                    <Separator className="mb-3" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">
                            {formatBalance(account.balance, isVisible)}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                        <p className="font-medium capitalize">{account.accountType}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">IFSC Code</p>
                        <p className="font-mono text-sm">{account.ifscCode}</p>
                      </div>
                    </div>
                    
                    {account.lastUpdated && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Last updated: {new Date(account.lastUpdated).toLocaleString()}
                      </p>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
        
        {showActions && (
          <div className="mt-6 pt-4 border-t">
            <Button asChild className="w-full">
              <Link href="/banks">
                <Plus className="h-4 w-4 mr-2" />
                Link Another Bank Account
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 