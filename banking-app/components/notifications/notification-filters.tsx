"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Shield, Calendar, Bell, DollarSign } from "lucide-react"

export default function NotificationFilters() {
  const [filters, setFilters] = useState({
    transactions: true,
    security: true,
    bills: true,
    system: true,
    promotions: false,
  })

  const [timeRange, setTimeRange] = useState("all-time")

  const updateFilter = (filter: keyof typeof filters, value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Customize your notification view</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <Label htmlFor="filter-transactions">Transactions</Label>
            </div>
            <Switch
              id="filter-transactions"
              checked={filters.transactions}
              onCheckedChange={(value) => updateFilter("transactions", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-primary" />
              <Label htmlFor="filter-security">Security</Label>
            </div>
            <Switch
              id="filter-security"
              checked={filters.security}
              onCheckedChange={(value) => updateFilter("security", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <Label htmlFor="filter-bills">Bills & Payments</Label>
            </div>
            <Switch
              id="filter-bills"
              checked={filters.bills}
              onCheckedChange={(value) => updateFilter("bills", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-primary" />
              <Label htmlFor="filter-system">System Updates</Label>
            </div>
            <Switch
              id="filter-system"
              checked={filters.system}
              onCheckedChange={(value) => updateFilter("system", value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <Label htmlFor="filter-promotions">Promotions</Label>
            </div>
            <Switch
              id="filter-promotions"
              checked={filters.promotions}
              onCheckedChange={(value) => updateFilter("promotions", value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time-range">Time Range</Label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger id="time-range">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}
