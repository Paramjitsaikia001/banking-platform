import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CalendarClock } from "lucide-react"

export default function UpcomingBills() {
  const bills = [
    {
      name: "Electricity Bill",
      amount: "$85.20",
      dueDate: "May 25, 2023",
      daysLeft: 5,
      progress: 80,
    },
    {
      name: "Internet Service",
      amount: "$59.99",
      dueDate: "May 28, 2023",
      daysLeft: 8,
      progress: 60,
    },
    {
      name: "Water Bill",
      amount: "$42.50",
      dueDate: "June 2, 2023",
      daysLeft: 13,
      progress: 40,
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upcoming Bills</CardTitle>
        <CardDescription>Bills due in the next 2 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bills.map((bill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{bill.name}</p>
                  <p className="text-xs text-muted-foreground">{bill.dueDate}</p>
                </div>
                <p className="text-sm font-bold">{bill.amount}</p>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={bill.progress} className="h-2 flex-1" />
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarClock className="mr-1 h-3 w-3" />
                  <span>{bill.daysLeft} days</span>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full text-sm">
            View All Bills
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
