"use client"

import { useUser } from "@/context/UserContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { QRCodeSVG } from "qrcode.react"

export default function UserQRCode() {
  const { user } = useUser()

  if (!user) return null

  const qrValue = JSON.stringify({
    type: "user",
    name: `${user.firstName} ${user.lastName}`,
    email: user.email
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <QRCodeSVG value={qrValue} size={200} level="H" />
        <div className="mt-4 text-center">
          <div>{user.firstName} {user.lastName}</div>
          <div className="text-muted-foreground">{user.email}</div>
        </div>
      </CardContent>
    </Card>
  )
} 