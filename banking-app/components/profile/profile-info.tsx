"use client"

import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { QrReader } from '@blackbox-vision/react-qr-reader'

export default function ProfileInfo() {
  const { user } = useUser()

  if (!user) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profilePicture} alt={user.firstName} />
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-1">
                <Badge variant="secondary">{user.role}</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <h4 className="text-sm font-medium">Contact Information</h4>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {user.phoneNumber}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Wallet Information</h4>
              <div className="mt-2 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Balance:</span> ₹{user.wallet?.balance || 0}
                </p>
                <p className="text-sm">
                  <span className="font-medium">UPI ID:</span> {user.upiId}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">KYC Status</h4>
              <div className="mt-2">
                <Badge
                  variant={
                    user.kycDetails?.status === "verified"
                      ? "secondary"
                      : user.kycDetails?.status === "pending"
                      ? "outline"
                      : "destructive"
                  }
                >
                  {user.kycDetails?.status?.toUpperCase() || "NOT SUBMITTED"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  upiId?: string;
  role?: string;
  profilePicture?: string;
  wallet?: { balance: number };
  kycDetails?: { status?: string };
};
