"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, CreditCard, Bell, Shield, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsList() {
  const [searchTerm, setSearchTerm] = useState("")

  const notifications = [
    {
      id: "1",
      title: "Payment Received",
      description: "You received $500.00 from John Smith",
      time: "Just now",
      type: "transaction",
      isRead: false,
      icon: <ArrowDownRight className="h-4 w-4 text-green-500" />,
    },
    {
      id: "2",
      title: "Security Alert",
      description: "New login detected from Chicago, IL",
      time: "10 minutes ago",
      type: "security",
      isRead: false,
      icon: <Shield className="h-4 w-4 text-red-500" />,
    },
    {
      id: "3",
      title: "Bill Due Soon",
      description: "Your electricity bill of $85.20 is due in 3 days",
      time: "2 hours ago",
      type: "bill",
      isRead: false,
      icon: <Calendar className="h-4 w-4 text-orange-500" />,
    },
    {
      id: "4",
      title: "Money Sent",
      description: "You sent $120.00 to Sarah Johnson",
      time: "Yesterday",
      type: "transaction",
      isRead: true,
      icon: <ArrowUpRight className="h-4 w-4 text-red-500" />,
    },
    {
      id: "5",
      title: "New Feature Available",
      description: "QR code payments are now available in your app",
      time: "2 days ago",
      type: "system",
      isRead: true,
      icon: <Bell className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "6",
      title: "Account Linked",
      description: "Your National Bank account has been successfully linked",
      time: "3 days ago",
      type: "account",
      isRead: true,
      icon: <CreditCard className="h-4 w-4 text-purple-500" />,
    },
    {
      id: "7",
      title: "Special Offer",
      description: "Get 2% cashback on all transactions this weekend",
      time: "5 days ago",
      type: "promotion",
      isRead: true,
      icon: <DollarSign className="h-4 w-4 text-yellow-500" />,
    },
  ]

  const filteredNotifications = notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Stay updated with your account activity</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notifications..."
              className="w-full md:w-[250px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                    !notification.isRead ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="rounded-full bg-muted p-2 mt-0.5">{notification.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {!notification.isRead && (
                          <Badge variant="default" className="h-2 w-2 rounded-full p-0">
                            <span className="sr-only">Unread</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notifications found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {filteredNotifications.filter((notification) => !notification.isRead).length > 0 ? (
              filteredNotifications
                .filter((notification) => !notification.isRead)
                .map((notification) => (
                  <div key={notification.id} className="flex items-start gap-4 rounded-lg border p-4 bg-muted/50">
                    <div className="rounded-full bg-muted p-2 mt-0.5">{notification.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                          <Badge variant="default" className="h-2 w-2 rounded-full p-0">
                            <span className="sr-only">Unread</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No unread notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! Check back later for new notifications.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            {filteredNotifications.filter((notification) => notification.type === "transaction").length > 0 ? (
              filteredNotifications
                .filter((notification) => notification.type === "transaction")
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                      !notification.isRead ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="rounded-full bg-muted p-2 mt-0.5">{notification.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                          {!notification.isRead && (
                            <Badge variant="default" className="h-2 w-2 rounded-full p-0">
                              <span className="sr-only">Unread</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No transaction notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any transaction notifications at the moment.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            {filteredNotifications.filter((notification) => notification.type === "security").length > 0 ? (
              filteredNotifications
                .filter((notification) => notification.type === "security")
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                      !notification.isRead ? "bg-muted/50" : ""
                    }`}
                  >
                    <div className="rounded-full bg-muted p-2 mt-0.5">{notification.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                          {!notification.isRead && (
                            <Badge variant="default" className="h-2 w-2 rounded-full p-0">
                              <span className="sr-only">Unread</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No security notifications</h3>
                <p className="text-sm text-muted-foreground">
                  You don't have any security notifications at the moment.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-between">
          <Button variant="outline">Mark All as Read</Button>
          <Button variant="outline">Clear All</Button>
        </div>
      </CardContent>
    </Card>
  )
}
