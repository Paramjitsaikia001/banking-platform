"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, CreditCard, Building, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function LinkedBankAccounts() {
  const [showBalance, setShowBalance] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const bankAccounts = [
    {
      id: "1",
      bankName: "National Bank",
      accountType: "Savings",
      accountNumber: "****4832",
      balance: "$24,680.42",
      isDefault: true,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      bankName: "City Credit Union",
      accountType: "Checking",
      accountNumber: "****7291",
      balance: "$5,210.75",
      isDefault: false,
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      bankName: "Global Finance",
      accountType: "Savings",
      accountNumber: "****1548",
      balance: "$12,350.00",
      isDefault: false,
      logo: "/placeholder.svg?height=40&width=40",
    },
  ]

  const handleDeleteAccount = (id: string) => {
    // In a real app, this would call an API to delete the account
    console.log(`Deleting account ${id}`)
    setConfirmDelete(null)
  }

  const handleSetDefault = (id: string) => {
    // In a real app, this would call an API to set the default account
    console.log(`Setting account ${id} as default`)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Linked Bank Accounts</CardTitle>
            <CardDescription>Manage your connected bank accounts</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Accounts</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="checking">Checking</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {bankAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-muted p-2">
                    {account.bankName.includes("Credit") ? (
                      <CreditCard className="h-6 w-6" />
                    ) : (
                      <Building className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{account.bankName}</p>
                      {account.isDefault && (
                        <Badge variant="outline" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {account.accountType} • {account.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">{showBalance ? account.balance : "••••••"}</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSetDefault(account.id)} disabled={account.isDefault}>
                        Set as Default
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/bank-accounts/${account.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <Dialog
                        open={confirmDelete === account.id}
                        onOpenChange={(open) => !open && setConfirmDelete(null)}
                      >
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault()
                              setConfirmDelete(account.id)
                            }}
                          >
                            Remove Account
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Remove Bank Account</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to remove this bank account? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                              Cancel
                            </Button>
                            <Button variant="destructive" onClick={() => handleDeleteAccount(account.id)}>
                              Remove Account
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="savings" className="space-y-4">
            {bankAccounts
              .filter((account) => account.accountType === "Savings")
              .map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      {account.bankName.includes("Credit") ? (
                        <CreditCard className="h-6 w-6" />
                      ) : (
                        <Building className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{account.bankName}</p>
                        {account.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.accountType} • {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold">{showBalance ? account.balance : "••••••"}</p>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="checking" className="space-y-4">
            {bankAccounts
              .filter((account) => account.accountType === "Checking")
              .map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      {account.bankName.includes("Credit") ? (
                        <CreditCard className="h-6 w-6" />
                      ) : (
                        <Building className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{account.bankName}</p>
                        {account.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.accountType} • {account.accountNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold">{showBalance ? account.balance : "••••••"}</p>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

import Link from "next/link"
