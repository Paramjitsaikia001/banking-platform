"use client"

import { useState } from "react"
import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Banknote, 
  Building2,
  CheckCircle,
  Plus,
  Eye,
  EyeOff
} from "lucide-react"
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

interface BankAccountSelectorProps {
  selectedAccountId?: string
  onAccountSelect: (account: BankAccount) => void
  onManualEntry: () => void
  title?: string
  description?: string
}

export default function BankAccountSelector({ 
  selectedAccountId,
  onAccountSelect,
  onManualEntry,
  title = "Select Bank Account",
  description = "Choose a linked bank account or enter details manually"
}: BankAccountSelectorProps) {
  const { user, getBankAccounts } = useUser()
  const [showBalances, setShowBalances] = useState<{ [key: string]: boolean }>({})
  
  const linkedAccounts = getBankAccounts()

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

  const handleAccountSelect = (account: BankAccount) => {
    onAccountSelect(account)
    toast.success(`Selected ${account.bankName} account`)
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
            <p className="text-muted-foreground">Please log in to select bank accounts</p>
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
          {linkedAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Banknote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No linked bank accounts found</p>
              <p className="text-sm text-muted-foreground mt-2 mb-4">
                Link a bank account or enter details manually
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild variant="outline">
                  <Link href="/banks">
                    <Plus className="h-4 w-4 mr-2" />
                    Link Bank Account
                  </Link>
                </Button>
                <Button onClick={onManualEntry}>
                  Enter Manually
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Linked Accounts */}
              <div className="space-y-3">
                {linkedAccounts.map((account) => {
                  const isVisible = showBalances[account.id] || false
                  const isSelected = selectedAccountId === account.id
                  
                  return (
                    <div 
                      key={account.id} 
                      className={`border rounded-lg p-4 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleAccountSelect(account)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Banknote className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{account.bankName}</h3>
                              {isSelected && <CheckCircle className="h-4 w-4 text-green-500" />}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {account.accountHolderName} • {account.accountNumber.slice(-4)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Balance: {formatBalance(account.balance, isVisible)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={account.status === 'verified' ? 'secondary' : 'outline'}>
                            {account.status}
                          </Badge>
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
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator />

              {/* Manual Entry Option */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Don't see your account? Enter details manually
                </p>
                <Button variant="outline" onClick={onManualEntry}>
                  Enter Bank Details Manually
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 