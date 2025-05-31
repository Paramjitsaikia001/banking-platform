"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useUser } from "@/context/UserContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function SecuritySettings() {
  const { user } = useUser()
  const [isChangingPin, setIsChangingPin] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [pinDetails, setPinDetails] = useState({
    currentPin: "",
    newPin: "",
    confirmPin: "",
  })
  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChangePin = async () => {
    if (!pinDetails.currentPin || !pinDetails.newPin || !pinDetails.confirmPin) {
      toast.error("Please fill in all fields")
      return
    }

    if (pinDetails.newPin !== pinDetails.confirmPin) {
      toast.error("New PINs do not match")
      return
    }

    if (pinDetails.newPin.length !== 4) {
      toast.error("PIN must be 4 digits")
      return
    }

    try {
      // Here you would typically make an API call to change the PIN
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      
      toast.success("PIN changed successfully!")
      setIsChangingPin(false)
      setPinDetails({
        currentPin: "",
        newPin: "",
        confirmPin: "",
      })
    } catch (error) {
      toast.error("Failed to change PIN. Please try again.")
    }
  }

  const handleChangePassword = async () => {
    if (!passwordDetails.currentPassword || !passwordDetails.newPassword || !passwordDetails.confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (passwordDetails.newPassword !== passwordDetails.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordDetails.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    try {
      // Here you would typically make an API call to change the password
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      
      toast.success("Password changed successfully!")
      setIsChangingPassword(false)
      setPasswordDetails({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast.error("Failed to change password. Please try again.")
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Transaction PIN</h3>
                  <p className="text-sm text-muted-foreground">
                    Change your 4-digit transaction PIN
                  </p>
                </div>
                <Button onClick={() => setIsChangingPin(true)}>Change PIN</Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Button onClick={() => setIsChangingPassword(true)}>
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isChangingPin} onOpenChange={setIsChangingPin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Transaction PIN</DialogTitle>
            <DialogDescription>
              Enter your current PIN and choose a new one
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPin">Current PIN</Label>
              <Input
                id="currentPin"
                type="password"
                maxLength={4}
                value={pinDetails.currentPin}
                onChange={(e) =>
                  setPinDetails({
                    ...pinDetails,
                    currentPin: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="Enter current PIN"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPin">New PIN</Label>
              <Input
                id="newPin"
                type="password"
                maxLength={4}
                value={pinDetails.newPin}
                onChange={(e) =>
                  setPinDetails({
                    ...pinDetails,
                    newPin: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="Enter new PIN"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm New PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                maxLength={4}
                value={pinDetails.confirmPin}
                onChange={(e) =>
                  setPinDetails({
                    ...pinDetails,
                    confirmPin: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="Confirm new PIN"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangingPin(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePin}>Change PIN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordDetails.currentPassword}
                onChange={(e) =>
                  setPasswordDetails({
                    ...passwordDetails,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordDetails.newPassword}
                onChange={(e) =>
                  setPasswordDetails({
                    ...passwordDetails,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordDetails.confirmPassword}
                onChange={(e) =>
                  setPasswordDetails({
                    ...passwordDetails,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 