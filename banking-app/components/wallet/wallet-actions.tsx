"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, ArrowUpRight, ArrowDownRight, CreditCard, Building } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { walletApi } from "@/utils/api"
import Link from "next/link"

export default function WalletActions() {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddMoney = async () => {
    if (!amount || !paymentMethod) {
      toast.error("Please fill in all fields")
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    try {
      const response = await walletApi.addMoney(numAmount, paymentMethod)
      toast.success(`Successfully added ₹${numAmount} to your wallet`)
      setAmount("")
      setPaymentMethod("")
      setIsDialogOpen(false)
      
      // Refresh the page to update balance
      window.location.reload()
    } catch (error: any) {
      toast.error(error?.message || "Failed to add money")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Wallet Actions</CardTitle>
        <CardDescription>Manage your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center justify-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Add Money</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Money to Wallet</DialogTitle>
                <DialogDescription>
                  Add money to your wallet using your preferred payment method.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMoney} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Money"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button className="flex items-center justify-center gap-2">
            <ArrowUpRight className="h-4 w-4" />
            <span>Send Money</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <ArrowDownRight className="h-4 w-4" />
            <span>Request Money</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Link Card</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2 col-span-2" asChild>
            <Link href="/bank-accounts">
              <Building className="h-4 w-4 mr-2" />
              <span>Manage Bank Accounts</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
