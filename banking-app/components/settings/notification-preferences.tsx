"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useUser } from "@/context/UserContext"

export default function NotificationPreferences() {
  const { user } = useUser()
  const [preferences, setPreferences] = useState({
    transactionAlerts: true,
    securityAlerts: true,
    promotionalAlerts: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  })

  const handleToggle = async (key: keyof typeof preferences) => {
    try {
      // Here you would typically make an API call to update preferences
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      
      setPreferences((prev) => ({
        ...prev,
        [key]: !prev[key],
      }))
      
      toast.success("Preferences updated successfully!")
    } catch (error) {
      toast.error("Failed to update preferences. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Alert Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="transactionAlerts">Transaction Alerts</Label>
                <Switch
                  id="transactionAlerts"
                  checked={preferences.transactionAlerts}
                  onCheckedChange={() => handleToggle("transactionAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="securityAlerts">Security Alerts</Label>
                <Switch
                  id="securityAlerts"
                  checked={preferences.securityAlerts}
                  onCheckedChange={() => handleToggle("securityAlerts")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="promotionalAlerts">Promotional Alerts</Label>
                <Switch
                  id="promotionalAlerts"
                  checked={preferences.promotionalAlerts}
                  onCheckedChange={() => handleToggle("promotionalAlerts")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notification Channels</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={preferences.emailNotifications}
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <Switch
                  id="pushNotifications"
                  checked={preferences.pushNotifications}
                  onCheckedChange={() => handleToggle("pushNotifications")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <Switch
                  id="smsNotifications"
                  checked={preferences.smsNotifications}
                  onCheckedChange={() => handleToggle("smsNotifications")}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 