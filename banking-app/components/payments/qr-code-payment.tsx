"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QrCode, Camera, Copy, Download, CreditCard } from "lucide-react"
import ReactDOM from 'react-dom';
import {QRCodeSVG} from 'qrcode.react';
import { useState, useEffect } from 'react';

export default function QRCodePayment() {
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Payments</CardTitle>
        <CardDescription>Generate or scan QR codes for quick payments</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="generate">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate QR</TabsTrigger>
            <TabsTrigger value="scan">Scan QR</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (Optional)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input id="note" placeholder="Add a note" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </div>

            <div className="flex justify-center py-6">
              <div className="relative bg-white p-4 rounded-lg">
                <QrCode className="h-48 w-48 text-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary rounded-full p-2">
                    <CreditCard className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button className="flex-1">
                <QrCode className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="scan" className="space-y-4 pt-4">
            <div className="flex justify-center py-6 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Camera className="h-24 w-24 mx-auto text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">Camera access is required to scan QR codes</p>
                <Button className="mt-4">Enable Camera</Button>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Point your camera at a QR code to make a payment
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


