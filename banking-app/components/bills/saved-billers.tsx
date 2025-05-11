import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"

export default function SavedBillers() {
  const billers = [
    {
      name: "City Electric",
      category: "Electricity",
      accountId: "EL-12345678",
      dueDate: "May 25, 2023",
      amount: "$85.20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "FastNet ISP",
      category: "Internet",
      accountId: "IN-87654321",
      dueDate: "May 28, 2023",
      amount: "$59.99",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "ClearWater",
      category: "Water",
      accountId: "WT-98765432",
      dueDate: "June 2, 2023",
      amount: "$42.50",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "MobileNet",
      category: "Mobile",
      accountId: "MB-56781234",
      dueDate: "June 5, 2023",
      amount: "$35.00",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Saved Billers</CardTitle>
            <CardDescription>Your registered billers for quick payments</CardDescription>
          </div>
          <Button variant="outline" size="icon">
            <UserPlus className="h-4 w-4" />
            <span className="sr-only">Add Biller</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {billers.map((biller, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={biller.avatar || "/placeholder.svg"} alt={biller.name} />
                  <AvatarFallback>{biller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{biller.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {biller.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">ID: {biller.accountId}</p>
                  <p className="text-xs text-muted-foreground">Due: {biller.dueDate}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="font-bold">{biller.amount}</p>
                <Button size="sm">Pay Now</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            Add New Biller
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
