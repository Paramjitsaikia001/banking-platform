"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Laptop, Smartphone, Tablet, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DeviceSettings() {
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [autoLockEnabled, setAutoLockEnabled] = useState(true)
  const [rememberDevices, setRememberDevices] = useState(true)

  const devices = [
    {
      id: "1",
      name: "iPhone 13 Pro",
      type: "mobile",
      lastActive: "Active now",
      isCurrentDevice: true,
    },
    {
      id: "2",
      name: "MacBook Pro",
      type: "desktop",
      lastActive: "2 hours ago",
      isCurrentDevice: false,
    },
    {
      id: "3",
      name: "iPad Air",
      type: "tablet",
      lastActive: "3 days ago",
      isCurrentDevice: false,
    },
    {
      id: "4",
      name: "Windows PC",
      type: "desktop",
      lastActive: "1 week ago",
      isCurrentDevice: false,
    },
  ]

  const handleRemoveDevice = (id: string) => {
    // In a real app, this would call an API to remove the device
    console.log(`Removing device ${id}`)
    setConfirmRemove(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices & Security</CardTitle>
        <CardDescription>Manage your devices and security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Connected Devices</h3>
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  {device.type === "mobile" ? (
                    <Smartphone className="h-5 w-5" />
                  ) : device.type === "tablet" ? (
                    <Tablet className="h-5 w-5" />
                  ) : (
                    <Laptop className="h-5 w-5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{device.name}</p>
                      {device.isCurrentDevice && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{device.lastActive}</p>
                  </div>
                </div>
                {!device.isCurrentDevice && (
                  <Dialog open={confirmRemove === device.id} onOpenChange={(open) => !open && setConfirmRemove(null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmRemove(device.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove device</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Remove Device</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to remove this device? You will need to log in again on this device.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmRemove(null)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={() => handleRemoveDevice(device.id)}>
                          Remove Device
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Security Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="biometric">Biometric Authentication</Label>
                <p className="text-xs text-muted-foreground">Use fingerprint or face recognition to log in</p>
              </div>
              <Switch id="biometric" checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-lock">Auto-Lock</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically lock the app after 5 minutes of inactivity
                </p>
              </div>
              <Switch id="auto-lock" checked={autoLockEnabled} onCheckedChange={setAutoLockEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="remember-devices">Remember Devices</Label>
                <p className="text-xs text-muted-foreground">Stay logged in on trusted devices</p>
              </div>
              <Switch id="remember-devices" checked={rememberDevices} onCheckedChange={setRememberDevices} />
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full">
          Log Out From All Devices
        </Button>
      </CardContent>
    </Card>
  )
}
