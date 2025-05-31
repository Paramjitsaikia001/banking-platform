"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useUser } from "@/context/UserContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const billTypes = [
  { id: "electricity", name: "Electricity Bill", icon: "⚡" },
  { id: "mobile", name: "Mobile Recharge", icon: "📱" },
  { id: "broadband", name: "Broadband Bill", icon: "🌐" },
  { id: "dth", name: "DTH Recharge", icon: "📺" },
  { id: "water", name: "Water Bill", icon: "💧" },
]

export default function BillPayments() {
  const { user } = useUser()
  const [selectedBillType, setSelectedBillType] = useState("")
  const [billDetails, setBillDetails] = useState({
    consumerNumber: "",
    amount: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayBill = async () => {
    if (!selectedBillType || !billDetails.consumerNumber || !billDetails.amount) {
      toast.error("Please fill in all fields")
      return
    }

    setIsProcessing(true)
    try {
      // Here you would typically make an API call to process the bill payment
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      
      toast.success("Bill payment successful!")
      setBillDetails({
        consumerNumber: "",
        amount: "",
      })
      setSelectedBillType("")
    } catch (error) {
      toast.error("Failed to process bill payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Bills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {billTypes.map((bill) => (
              <Button
                key={bill.id}
                variant={selectedBillType === bill.id ? "default" : "outline"}
                className="h-auto flex-col gap-2 py-4"
                onClick={() => setSelectedBillType(bill.id)}
              >
                <span className="text-2xl">{bill.icon}</span>
                <span className="text-sm">{bill.name}</span>
              </Button>
            ))}
          </div>

          {selectedBillType && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="consumerNumber">Consumer Number</Label>
                <Input
                  id="consumerNumber"
                  value={billDetails.consumerNumber}
                  onChange={(e) =>
                    setBillDetails({
                      ...billDetails,
                      consumerNumber: e.target.value,
                    })
                  }
                  placeholder="Enter consumer number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={billDetails.amount}
                  onChange={(e) =>
                    setBillDetails({
                      ...billDetails,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Enter amount"
                />
              </div>

              <Button
                className="w-full"
                onClick={handlePayBill}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay Bill"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 