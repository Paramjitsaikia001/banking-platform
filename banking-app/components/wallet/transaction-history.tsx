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

export default function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")

  const transactions = [
    {
      id: "1",
      name: "Grocery Store",
      date: "Today, 2:34 PM",
      amount: "-$65.75",
      status: "completed",
      type: "expense",
      category: "Shopping",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "2",
      name: "Salary Deposit",
      date: "Yesterday, 9:00 AM",
      amount: "+$3,000.00",
      status: "completed",
      type: "income",
      category: "Income",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "3",
      name: "Coffee Shop",
      date: "Yesterday, 11:45 AM",
      amount: "-$4.50",
      status: "completed",
      type: "expense",
      category: "Food & Drink",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "4",
      name: "Electric Bill",
      date: "May 10, 2023",
      amount: "-$85.20",
      status: "completed",
      type: "expense",
      category: "Utilities",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "5",
      name: "Freelance Payment",
      date: "May 8, 2023",
      amount: "+$750.00",
      status: "completed",
      type: "income",
      category: "Income",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "6",
      name: "Gas Station",
      date: "May 7, 2023",
      amount: "-$45.30",
      status: "completed",
      type: "expense",
      category: "Transportation",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "7",
      name: "Online Shopping",
      date: "May 5, 2023",
      amount: "-$129.99",
      status: "completed",
      type: "expense",
      category: "Shopping",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: "8",
      name: "Dividend Payment",
      date: "May 1, 2023",
      amount: "+$32.50",
      status: "completed",
      type: "income",
      category: "Investment",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
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
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={transaction.avatar || "/placeholder.svg"} alt={transaction.name} />
                      <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium leading-none">{transaction.name}</p>
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
                      <span className={`font-medium ${transaction.type === "income" ? "text-green-500" : ""}`}>
                        {transaction.amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            {filteredTransactions
              .filter((transaction) => transaction.type === "income")
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={transaction.avatar || "/placeholder.svg"} alt={transaction.name} />
                      <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium leading-none">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                      {transaction.category}
                    </Badge>
                    <div className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-500">{transaction.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="expense" className="space-y-4">
            {filteredTransactions
              .filter((transaction) => transaction.type === "expense")
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={transaction.avatar || "/placeholder.svg"} alt={transaction.name} />
                      <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium leading-none">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="capitalize">
                      {transaction.category}
                    </Badge>
                    <div className="flex items-center">
                      <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      <span className="font-medium">{transaction.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
