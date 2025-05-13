"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Bell, Mail, Smartphone, CreditCard, AlertTriangle, DollarSign } from "lucide-react"

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState({
    transactions: {
      push: true,
      email: true,
      sms: false,
    },
    bills: {
      push: true,
      email: true,
      sms: true,
    },
    security: {
      push: true,
      email: true,
      sms: true,
    },
    marketing: {
      push: false,
      email: false,
      sms: false,
    },
  })

  const updatePreference = (
    category: keyof typeof preferences,
    channel: keyof typeof preferences.transactions,
    value: boolean,
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: value,
      },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <p className="font-medium">Transaction Alerts</p>
          </div>
          <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
            <div className="flex flex-col items-center gap-2">
              <Bell className="h-5 w-5" />
              <p className="text-xs">Push</p>
              <Switch
                checked={preferences.transactions.push}
                onCheckedChange={(value) => updatePreference("transactions", "push", value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="h-5 w-5" />
              <p className="text-xs">Email</p>
              <Switch
                checked={preferences.transactions.email}
                onCheckedChange={(value) => updatePreference("transactions", "email", value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <p className="text-xs">SMS</p>
              <Switch
                checked={preferences.transactions.sms}
                onCheckedChange={(value) => updatePreference("transactions", "sms", value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <p className="font-medium">Bill Reminders</p>
          </div>
          <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
            <div className="flex flex-col items-center gap-2">
              <Bell className="h-5 w-5" />
              <p className="text-xs">Push</p>
              <Switch
                checked={preferences.bills.push}
                onCheckedChange={(value) => updatePreference("bills", "push", value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="h-5 w-5" />
              <p className="text-xs">Email</p>
              <Switch
                checked={preferences.bills.email}
                onCheckedChange={(value) => updatePreference("bills", "email", value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <p className="text-xs">SMS</p>
              <Switch
                checked={preferences.bills.sms}
                onCheckedChange={(value) => updatePreference("bills", "sms", value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <p className="font-medium">Security Alerts</p>
          </div>
          <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
            <div className="flex flex-col items-center gap-2">
              <Bell className="h-5 w-5" />
              <p className="text-xs">Push</p>
              <Switch
                checked={preferences.security.push}
                onCheckedChange={(value) => updatePreference("security", "push", value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="h-5 w-5" />
              <p className="text-xs">Email</p>
              <Switch
                checked={preferences.security.email}
                onCheckedChange={(value) => updatePreference("security", "email", value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <p className="text-xs">SMS</p>
              <Switch
                checked={preferences.security.sms}
                onCheckedChange={(value) => updatePreference("security", "sms", value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <p className="font-medium">Marketing & Promotions</p>
          </div>
          <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
            <div className="flex flex-col items-center gap-2">
              <Bell className="h-5 w-5" />
              <p className="text-xs">Push</p>
              <Switch
                checked={preferences.marketing.push}
                onCheckedChange={(value) => updatePreference("marketing", "push", value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Mail className="h-5 w-5" />
              <p className="text-xs">Email</p>
              <Switch
                checked={preferences.marketing.email}
                onCheckedChange={(value) => updatePreference("marketing", "email", value)}
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <p className="text-xs">SMS</p>
              <Switch
                checked={preferences.marketing.sms}
                onCheckedChange={(value) => updatePreference("marketing", "sms", value)}
              />
            </div>
          </div>
        </div>
        </CardContent>
    </Card>
  )
}
