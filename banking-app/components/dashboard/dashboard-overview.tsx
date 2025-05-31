"use client"

import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, Send, QrCode } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardOverview() {
  const { user } = useUser()
  const router = useRouter()

  const quickActions = [
    {
      title: "Add Money",
      icon: <CreditCard className="h-5 w-5" />,
      onClick: () => router.push("/add-money"),
    },
    {
      title: "Send Money",
      icon: <ArrowUpRight className="h-5 w-5" />,
      onClick: () => router.push("/send-money"),
    },
    {
      title: "Receive Money",
      icon: <ArrowDownLeft className="h-5 w-5" />,
      onClick: () => router.push("/receive-money"),
    },
    {
      title: "QR Pay",
      icon: <QrCode className="h-5 w-5" />,
      onClick: () => router.push("/qr-pay"),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">₹{user?.wallet?.balance || 0}</p>
              <p className="text-sm text-muted-foreground">Available Balance</p>
            </div>
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
                onClick={action.onClick}
              >
                {action.icon}
                <span className="text-sm">{action.title}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* This will be populated with actual transactions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Payment to John Doe</p>
                  <p className="text-sm text-muted-foreground">Today, 2:30 PM</p>
                </div>
              </div>
              <p className="font-medium text-destructive">-₹500</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <ArrowDownLeft className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Received from Jane Smith</p>
                  <p className="text-sm text-muted-foreground">Yesterday, 4:15 PM</p>
                </div>
              </div>
              <p className="font-medium text-green-600">+₹1,000</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 