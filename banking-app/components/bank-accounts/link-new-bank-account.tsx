"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Plus, Building } from "lucide-react"

export default function LinkNewBankAccount() {
  const [isLinking, setIsLinking] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    bankName: "",
    accountType: "",
    accountNumber: "",
    routingNumber: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLinking(true)

    // Validate form
    if (!formData.bankName || !formData.accountType || !formData.accountNumber || !formData.routingNumber) {
      setError("All fields are required")
      setIsLinking(false)
      return
    }

    // In a real app, this would call an API to link the bank account
    setTimeout(() => {
      setIsLinking(false)
      setSuccess("Bank account linked successfully!")
      setFormData({
        bankName: "",
        accountType: "",
        accountNumber: "",
        routingNumber: "",
      })
      setShowForm(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link Bank Account</CardTitle>
        <CardDescription>Connect your bank account to transfer funds</CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Building className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">Add a New Bank Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Link your bank account to easily transfer funds between your wallet and bank.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Link New Account
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                placeholder="Enter bank name"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type</Label>
              <Select value={formData.accountType} onValueChange={(value) => handleSelectChange("accountType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="checking">Checking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                placeholder="Enter account number"
                value={formData.accountNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number</Label>
              <Input
                id="routingNumber"
                name="routingNumber"
                placeholder="Enter routing number"
                value={formData.routingNumber}
                onChange={handleChange}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </form>
        )}
      </CardContent>
      {showForm && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLinking}>
            {isLinking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Link Account"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
