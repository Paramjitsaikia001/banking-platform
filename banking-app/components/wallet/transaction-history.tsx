"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Search, Filter, Download } from "lucide-react"
import { useWallet } from "@/app/context/wallet-context"

interface Transaction {
  id: string | number;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const { transactions } = useWallet()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Today, " + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffDays === 2) {
      return "Yesterday, " + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    }
  }

  const getTransactionType = (transaction: Transaction) => {
    if (transaction.type === 'wallet_add') return 'income'
    if (transaction.type === 'wallet_transfer' && transaction.amount > 0) return 'income'
    if (transaction.type === 'qr_payment') return 'expense'
    if (transaction.type === 'money_request') return 'pending'
    return 'expense'
  }

  const getTransactionCategory = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'wallet_add':
        return 'Wallet Add'
      case 'wallet_transfer':
        return transaction.amount > 0 ? 'Received' : 'Sent'
      case 'qr_payment':
        return 'QR Payment'
      case 'money_request':
        return 'Money Request'
      default:
        return 'Transaction'
    }
  }

  const getTransactionName = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'wallet_add':
        return transaction.description || 'Added Money'
      case 'wallet_transfer':
        return transaction.description || (transaction.amount > 0 ? 'Money Received' : 'Money Sent')
      case 'qr_payment':
        return transaction.description || 'QR Payment'
      case 'money_request':
        return transaction.description || 'Money Request'
      default:
        return transaction.description || 'Transaction'
    }
  }

  const filteredTransactions = transactions.filter(
    (transaction) =>
      getTransactionName(transaction).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTransactionCategory(transaction).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const incomeTransactions = filteredTransactions.filter(
    (transaction) => getTransactionType(transaction) === 'income'
  )

  const expenseTransactions = filteredTransactions.filter(
    (transaction) => getTransactionType(transaction) === 'expense'
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View and filter your transaction history</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-full sm:w-[200px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expense</TabsTrigger>
            </TabsList>
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Amount</SelectItem>
                <SelectItem value="lowest">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="all" className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const type = getTransactionType(transaction)
                const amount = Math.abs(transaction.amount)
                const formattedAmount = type === 'income' ? `+${formatCurrency(amount)}` : `-${formatCurrency(amount)}`
                
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{getTransactionName(transaction).charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{getTransactionName(transaction)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={type === "income" ? "outline" : "secondary"} className="capitalize">
                        {getTransactionCategory(transaction)}
                      </Badge>
                      <div className="flex items-center">
                        {type === "income" ? (
                          <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                        )}
                        <span className={`font-medium ${type === "income" ? "text-green-500" : "text-red-500"}`}>
                          {formattedAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try adjusting your search to find what you're looking for." : "Start by adding money to your wallet to see transactions here."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            {incomeTransactions.length > 0 ? (
              incomeTransactions.map((transaction) => {
                const amount = Math.abs(transaction.amount)
                const formattedAmount = `+${formatCurrency(amount)}`
                
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{getTransactionName(transaction).charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{getTransactionName(transaction)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {getTransactionCategory(transaction)}
                      </Badge>
                      <div className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        <span className="font-medium text-green-500">
                          {formattedAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ArrowUpRight className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No income transactions</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try adjusting your search to find income transactions." : "Add money to your wallet to see income transactions here."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="expense" className="space-y-4">
            {expenseTransactions.length > 0 ? (
              expenseTransactions.map((transaction) => {
                const amount = Math.abs(transaction.amount)
                const formattedAmount = `-${formatCurrency(amount)}`
                
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{getTransactionName(transaction).charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{getTransactionName(transaction)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">
                        {getTransactionCategory(transaction)}
                      </Badge>
                      <div className="flex items-center">
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                        <span className="font-medium text-red-500">
                          {formattedAmount}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <ArrowDownRight className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No expense transactions</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Try adjusting your search to find expense transactions." : "Send money or make payments to see expense transactions here."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
