import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, CheckCircle2, AlertCircle } from "lucide-react"

export default function SupportTickets() {
  const tickets = [
    {
      id: "T-1234",
      subject: "Payment not received",
      status: "open",
      date: "Today, 10:24 AM",
      lastUpdate: "2 hours ago",
    },
    {
      id: "T-1233",
      subject: "Account verification issue",
      status: "in-progress",
      date: "Yesterday",
      lastUpdate: "1 day ago",
    },
    {
      id: "T-1232",
      subject: "App crashing on startup",
      status: "resolved",
      date: "May 15, 2023",
      lastUpdate: "1 week ago",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="h-4 w-4" />
      case "in-progress":
        return <AlertCircle className="h-4 w-4" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-500"
      case "in-progress":
        return "bg-blue-500"
      case "resolved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tickets</CardTitle>
        <CardDescription>Track your support requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.length > 0 ? (
            <>
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(ticket.status)}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{ticket.subject}</p>
                        <Badge variant="outline" className="text-xs">
                          {ticket.id}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created: {ticket.date} • Updated: {ticket.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={ticket.status === "resolved" ? "outline" : "secondary"}
                      className="capitalize flex items-center gap-1"
                    >
                      {getStatusIcon(ticket.status)}
                      <span>{ticket.status.replace("-", " ")}</span>
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`#ticket-${ticket.id}`}>View</a>
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Tickets
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No support tickets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have any active support tickets at the moment.
              </p>
              <Button>Create New Ticket</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
