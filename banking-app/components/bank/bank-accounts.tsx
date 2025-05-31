"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useUser } from "@/context/UserContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BankAccounts() {
  const { user } = useUser()
  const [isAddingAccount, setIsAddingAccount] = useState(false)
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  })

  const handleAddAccount = async () => {
    if (!accountDetails.accountNumber || !accountDetails.ifscCode || !accountDetails.accountHolderName) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      // Here you would typically make an API call to link the bank account
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
      
      toast.success("Bank account linked successfully!")
      setIsAddingAccount(false)
      setAccountDetails({
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
      })
    } catch (error) {
      toast.error("Failed to link bank account. Please try again.")
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Linked Bank Accounts</CardTitle>
          <Button onClick={() => setIsAddingAccount(true)}>Add Account</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock bank account */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">HDFC Bank</p>
                <p className="text-sm text-muted-foreground">
                  Account ending in 1234
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹25,000</p>
                <p className="text-sm text-muted-foreground">Available Balance</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddingAccount} onOpenChange={setIsAddingAccount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Bank Account</DialogTitle>
            <DialogDescription>
              Enter your bank account details to link it with your wallet
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={accountDetails.accountNumber}
                onChange={(e) =>
                  setAccountDetails({
                    ...accountDetails,
                    accountNumber: e.target.value,
                  })
                }
                placeholder="Enter account number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                value={accountDetails.ifscCode}
                onChange={(e) =>
                  setAccountDetails({
                    ...accountDetails,
                    ifscCode: e.target.value,
                  })
                }
                placeholder="Enter IFSC code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountHolderName">Account Holder Name</Label>
              <Input
                id="accountHolderName"
                value={accountDetails.accountHolderName}
                onChange={(e) =>
                  setAccountDetails({
                    ...accountDetails,
                    accountHolderName: e.target.value,
                  })
                }
                placeholder="Enter account holder name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingAccount(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAccount}>Link Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 