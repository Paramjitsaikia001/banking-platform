import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CalendarClock, Bell } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function UpcomingPayments() {
  const bills = [
    {
      name: "Electricity Bill",
      amount: "$85.20",
      dueDate: "May 25, 2023",
      daysLeft: 5,
      progress: 80,
      reminder: true,
    },
    {
      name: "Internet Service",
      amount: "$59.99",
      dueDate: "May 28, 2023",
      daysLeft: 8,
      progress: 60,
      reminder: true,
    },
    {
      name: "Water Bill",
      amount: "$42.50",
      dueDate: "June 2, 2023",
      daysLeft: 13,
      progress: 40,
      reminder: false,
    },
    {
      name: "Mobile Postpaid",
      amount: "$35.00",
      dueDate: "June 5, 2023",
      daysLeft: 16,
      progress: 30,
      reminder: true,
    },
    {
      name: "Credit Card",
      amount: "$250.00",
      dueDate: "June 10, 2023",
      daysLeft: 21,
      progress: 20,
      reminder: true,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upcoming Payments</CardTitle>
        <CardDescription>Bills due in the next 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bills.map((bill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{bill.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <CalendarClock className="mr-1 h-3 w-3" />
                    <span>Due: {bill.dueDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={bill.reminder} />
                  <p className="text-sm font-bold">{bill.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={bill.progress} className="h-2 flex-1" />
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{bill.daysLeft} days</span>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-2">
            <Button className="w-full">Pay All Bills</Button>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Bell className="h-3 w-3" />
              <span>Reminders are enabled for selected bills</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
