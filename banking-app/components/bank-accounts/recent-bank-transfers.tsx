import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function RecentBankTransfers() {
  const transfers = [
    {
      id: "1",
      bankName: "National Bank",
      accountNumber: "****4832",
      date: "Today, 10:24 AM",
      amount: "+$500.00",
      status: "completed",
      type: "to-wallet",
      description: "Transfer to wallet",
    },
    {
      id: "2",
      bankName: "City Credit Union",
      accountNumber: "****7291",
      date: "Yesterday, 3:15 PM",
      amount: "-$1,200.00",
      status: "completed",
      type: "to-bank",
      description: "Rent payment",
    },
    {
      id: "3",
      bankName: "National Bank",
      accountNumber: "****4832",
      date: "May 15, 2023",
      amount: "+$2,000.00",
      status: "completed",
      type: "to-wallet",
      description: "Monthly budget",
    },
    {
      id: "4",
      bankName: "Global Finance",
      accountNumber: "****1548",
      date: "May 10, 2023",
      amount: "-$350.00",
      status: "completed",
      type: "to-bank",
      description: "Savings transfer",
    },
    {
      id: "5",
      bankName: "City Credit Union",
      accountNumber: "****7291",
      date: "May 5, 2023",
      amount: "+$750.00",
      status: "completed",
      type: "to-wallet",
      description: "Emergency fund",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Recent Bank Transfers</CardTitle>
            <CardDescription>History of transfers between your wallet and bank accounts</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search transfers..." className="w-full sm:w-[200px] pl-8" />
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
          {transfers.map((transfer) => (
            <div
              key={transfer.id}
              className="flex items-center justify-between space-x-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-muted p-2">
                  {transfer.type === "to-wallet" ? (
                    <ArrowDownRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{transfer.bankName}</p>
                  <p className="text-sm text-muted-foreground">{transfer.accountNumber}</p>
                  <p className="text-xs text-muted-foreground">{transfer.date}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={transfer.type === "to-wallet" ? "outline" : "secondary"}
                  className="capitalize hidden sm:inline-flex"
                >
                  {transfer.type === "to-wallet" ? "To Wallet" : "To Bank"}
                </Badge>
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-medium ${transfer.type === "to-wallet" ? "text-green-500" : ""}`}>
                    {transfer.amount}
                  </span>
                  <span className="text-xs text-muted-foreground">{transfer.description}</span>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Transfers
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
