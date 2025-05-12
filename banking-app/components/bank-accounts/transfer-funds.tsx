"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransferFunds() {
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferType, setTransferType] = useState("to-wallet")
  const [formData, setFormData] = useState({
    amount: "",
    bankAccount: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const bankAccounts = [
    {
      id: "1",
      name: "National Bank - Savings ****4832",
    },
    {
      id: "2",
      name: "City Credit Union - Checking ****7291",
    },
    {
      id: "3",
      name: "Global Finance - Savings ****1548",
    },
  ]

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
    setIsTransferring(true)

    // Validate form
    if (!formData.amount || !formData.bankAccount) {
      setError("Amount and bank account are required")
      setIsTransferring(false)
      return
    }

    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      setError("Please enter a valid amount")
      setIsTransferring(false)
      return
    }

    // In a real app, this would call an API to transfer funds
    setTimeout(() => {
      setIsTransferring(false)
      setSuccess(
        `Successfully transferred $${formData.amount} ${
          transferType === "to-wallet" ? "to your wallet" : "to your bank account"
        }`,
      )
      setFormData({
        amount: "",
        bankAccount: "",
        description: "",
      })
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Funds</CardTitle>
        <CardDescription>Move money between your wallet and bank accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={transferType} onValueChange={setTransferType}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="to-wallet">
              <ArrowDownRight className="mr-2 h-4 w-4" />
              To Wallet
            </TabsTrigger>
            <TabsTrigger value="to-bank">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              To Bank
            </TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Select Bank Account</Label>
              <Select value={formData.bankAccount} onValueChange={(value) => handleSelectChange("bankAccount", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="amount"
                  name="amount"
                  className="pl-7"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                placeholder="Enter a description"
                value={formData.description}
                onChange={handleChange}
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
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit} disabled={isTransferring}>
          {isTransferring ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : transferType === "to-wallet" ? (
            "Transfer to Wallet"
          ) : (
            "Transfer to Bank"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
