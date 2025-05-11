import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export default function RecentPayees() {
  const payees = [
    {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      lastPaid: "Yesterday",
    },
    {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastPaid: "2 days ago",
    },
    {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      lastPaid: "1 week ago",
    },
    {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      lastPaid: "2 weeks ago",
    },
    {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastPaid: "3 weeks ago",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Payees</CardTitle>
            <CardDescription>People you've paid recently</CardDescription>
          </div>
          <Button variant="outline" size="icon">
            <UserPlus className="h-4 w-4" />
            <span className="sr-only">Add Contact</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payees.map((payee, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={payee.avatar || "/placeholder.svg"} alt={payee.name} />
                  <AvatarFallback>{payee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{payee.name}</p>
                  <p className="text-xs text-muted-foreground">Last paid: {payee.lastPaid}</p>
                </div>
              </div>
              <Button size="sm">Pay</Button>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Contacts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
