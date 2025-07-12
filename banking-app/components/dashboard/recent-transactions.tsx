"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/app/context/wallet-context"

interface Transaction {
  id: string | number
  name: string
  date: string
  amount: string
  status: string
  type: "income" | "expense" | "pending"
  category: string
  avatar?: string
}

export default function RecentTransactions() {
  const { transactions } = useWallet();

  const formatTransactions = (): Transaction[] => {
    if (transactions.length === 0) {
      // Return default transactions if none exist
      return [
        {
          id: "1",
          name: "Grocery Store",
          date: "Today, 2:34 PM",
          amount: "-₹65.75",
          status: "completed",
          type: "expense",
          category: "Shopping",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "2",
          name: "Salary Deposit",
          date: "Yesterday, 9:00 AM",
          amount: "+₹3,000.00",
          status: "completed",
          type: "income",
          category: "Income",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "3",
          name: "Coffee Shop",
          date: "Yesterday, 11:45 AM",
          amount: "-₹4.50",
          status: "completed",
          type: "expense",
          category: "Food & Drink",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ];
    }

    return transactions.map((tx: any) => ({
      id: tx.id,
      name: tx.description || 'Transaction',
      date: new Date(tx.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      amount: tx.type === 'money_request' ? `₹${tx.amount}` : tx.amount > 0 ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`,
      status: tx.status,
      type: tx.type === 'money_request' ? 'pending' : tx.amount > 0 ? "income" : "expense",
      category: tx.type === 'wallet_add' ? 'Wallet Add' : 
               tx.type === 'wallet_transfer' ? 'Transfer' : 
               tx.type === 'qr_payment' ? 'QR Payment' :
               tx.type === 'money_request' ? 'Money Request' : 'Transaction',
      avatar: "/placeholder.svg?height=32&width=32",
    }));
  };

  const formattedTransactions = formatTransactions();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your recent financial activity</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search transactions..." className="w-full sm:w-[200px] pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {formattedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between space-x-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={transaction.avatar || "/placeholder.svg"} alt={transaction.name} />
                  <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={transaction.type === "income" ? "outline" : "secondary"} className="capitalize">
                  {transaction.category}
                </Badge>
                <div className="flex items-center">
                  {transaction.type === "income" ? (
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${transaction.type === "income" ? "text-green-500" : ""}`}>
                    {transaction.amount}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
