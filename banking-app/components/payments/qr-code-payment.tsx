"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/context/UserContext"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"
import { QrReader } from "react-qr-reader"
import PaymentConfirmation from "./payment-confirmation"

export default function QRCodePayment() {
  const { user } = useUser()
  const [amount, setAmount] = useState("")
  const [activeTab, setActiveTab] = useState("generate")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    amount: number
    upiId: string
    name: string
  } | null>(null)

  const handleGenerateQR = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }
    // QR code will be generated automatically with the amount
  }

  const handleScan = (result: any) => {
    if (result) {
      try {
        const data = JSON.parse(result.text)
        if (data.type === "payment") {
          setPaymentData({
            amount: data.amount,
            upiId: data.upiId,
            name: data.name
          })
          setShowConfirmation(true)
        } else {
          toast.error("Invalid QR code")
        }
      } catch (error) {
        toast.error("Invalid QR code")
      }
    }
  }

  const handleError = (error: any) => {
    toast.error("Error accessing camera")
    console.error(error)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>QR Code Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate QR</TabsTrigger>
              <TabsTrigger value="scan">Scan QR</TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <Button onClick={handleGenerateQR}>Generate QR Code</Button>
                {amount && parseFloat(amount) > 0 && (
                  <div className="flex justify-center mt-4">
                    <QRCodeSVG
                      value={JSON.stringify({
                        type: "payment",
                        amount: parseFloat(amount),
                        upiId: user?.upiId,
                        name: `${user?.firstName} ${user?.lastName}`
                      })}
                      size={200}
                      level="H"
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="scan">
              <div className="space-y-4">
                <div className="aspect-square w-full max-w-sm mx-auto">
                  <QrReader
                    constraints={{ facingMode: "environment" }}
                    onResult={handleScan}
                    onError={handleError}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Position the QR code within the frame to scan
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {paymentData && (
        <PaymentConfirmation
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false)
            setPaymentData(null)
          }}
          paymentData={paymentData}
        />
      )}
    </>
  )
}


