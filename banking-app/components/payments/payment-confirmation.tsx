"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useUser } from "@/context/UserContext"

interface PaymentConfirmationProps {
  isOpen: boolean
  onClose: () => void
  paymentData: {
    amount: number
    upiId: string
    name: string
  }
}

export default function PaymentConfirmation({
  isOpen,
  onClose,
  paymentData,
}: PaymentConfirmationProps) {
  const { user } = useUser()
  const [pin, setPin] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = async () => {
    if (!pin || pin.length !== 4) {
      toast.error("Please enter a valid 4-digit PIN")
      return
    }

    setIsProcessing(true)
    try {
      // Here you would typically make an API call to process the payment
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      
      toast.success("Payment successful!")
      onClose()
    } catch (error) {
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>
            Please review the payment details and enter your PIN to confirm
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="text-2xl font-bold">₹{paymentData.amount}</div>
          </div>

          <div className="space-y-2">
            <Label>Recipient</Label>
            <div className="text-sm">
              <div className="font-medium">{paymentData.name}</div>
              <div className="text-muted-foreground">{paymentData.upiId}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">Enter PIN</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 4-digit PIN"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Confirm Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 