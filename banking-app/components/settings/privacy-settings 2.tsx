"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function PrivacySettings() {
  const [locationTracking, setLocationTracking] = useState(false)
  const [dataCollection, setDataCollection] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [dataRetention, setDataRetention] = useState("1-year")
  const [confirmDelete, setConfirmDelete] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & Data</CardTitle>
        <CardDescription>Manage your privacy settings and data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="location-tracking">Location Tracking</Label>
              <p className="text-sm text-muted-foreground">Allow the app to track your location for better service</p>
            </div>
            <Switch id="location-tracking" checked={locationTracking} onCheckedChange={setLocationTracking} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="data-collection">Data Collection</Label>
              <p className="text-sm text-muted-foreground">Allow the app to collect usage data to improve services</p>
            </div>
            <Switch id="data-collection" checked={dataCollection} onCheckedChange={setDataCollection} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
            </div>
            <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data-retention">Data Retention Period</Label>
          <Select value={dataRetention} onValueChange={setDataRetention}>
            <SelectTrigger id="data-retention">
              <SelectValue placeholder="Select retention period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6-months">6 Months</SelectItem>
              <SelectItem value="1-year">1 Year</SelectItem>
              <SelectItem value="2-years">2 Years</SelectItem>
              <SelectItem value="indefinite">Indefinite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2">
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download My Data
          </Button>

          <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account & Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Account & Data</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from
                  our servers.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">Please note that:</p>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                  <li>All your transaction history will be deleted</li>
                  <li>Your wallet balance must be zero before deletion</li>
                  <li>Any linked accounts will be unlinked</li>
                  <li>You will not be able to recover your account</li>
                </ul>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button variant="destructive">Confirm Deletion</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
