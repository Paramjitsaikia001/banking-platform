import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Shield, Calendar, Bell, DollarSign } from "lucide-react"

export default function NotificationSummary() {
  const summary = [
    {
      type: "Transactions",
      count: 12,
      percentage: 40,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      type: "Security",
      count: 5,
      percentage: 17,
      icon: <Shield className="h-4 w-4" />,
    },
    {
      type: "Bills & Payments",
      count: 8,
      percentage: 27,
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      type: "System Updates",
      count: 3,
      percentage: 10,
      icon: <Bell className="h-4 w-4" />,
    },
    {
      type: "Promotions",
      count: 2,
      percentage: 6,
      icon: <DollarSign className="h-4 w-4" />,
    },
  ]

  const totalNotifications = summary.reduce((acc, item) => acc + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>Notification breakdown by type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">Total Notifications</p>
          <p className="text-3xl font-bold">{totalNotifications}</p>
        </div>

        <div className="space-y-3">
          {summary.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="text-sm">{item.type}</span>
                </div>
                <span className="text-sm font-medium">{item.count}</span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
