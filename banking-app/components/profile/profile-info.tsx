"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/UserContext"
import { useAuth } from "@/app/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Camera, User, Mail, Phone, CreditCard, Settings, HelpCircle, LogOut, Smile } from "lucide-react"
import Link from "next/link"
import EmojiPicker from 'emoji-picker-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function ProfileInfo() {
  const { user } = useUser()
  const { logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState("👤")

  // Debug: Log user data
  console.log('ProfileInfo - User data:', user)

  // Load saved emoji from localStorage on component mount
  useEffect(() => {
    if (user?.id) {
      const savedEmoji = localStorage.getItem(`user_emoji_${user.id}`)
      if (savedEmoji) {
        setSelectedEmoji(savedEmoji)
      } else if (user.profileEmoji) {
        setSelectedEmoji(user.profileEmoji)
        // Save to localStorage for future use
        localStorage.setItem(`user_emoji_${user.id}`, user.profileEmoji)
      }
    }
  }, [user?.id, user?.profileEmoji])

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No user data available</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please make sure you are logged in and user data is properly loaded.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleLogout = () => {
    logout()
  }

  const handleEmojiSelect = (emojiObject: any) => {
    const newEmoji = emojiObject.emoji
    setSelectedEmoji(newEmoji)
    setShowEmojiPicker(false)
    
    // Save emoji to localStorage for this specific user
    if (user?.id) {
      localStorage.setItem(`user_emoji_${user.id}`, newEmoji)
    }
    
    // Mock API call to save emoji to backend
    // In a real app, you would make an API call here
    // Example: await updateUserProfile({ profileEmoji: newEmoji })
    
    toast.success('Profile emoji updated and saved!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-24 w-24 text-4xl">
                <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-4xl">
                  {selectedEmoji}
                </AvatarFallback>
              </Avatar>
              
              <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Choose Profile Emoji</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-auto">
                    <EmojiPicker
                      onEmojiClick={handleEmojiSelect}
                      autoFocusSearch={false}
                      searchPlaceholder="Search emoji..."
                      width="100%"
                      height={400}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <div className="space-y-1 mt-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phoneNumber}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Navigation Links */}
          <div className="space-y-2">
            <Link href="/banks" className="block">
              <Button variant="ghost" className="w-full justify-start h-12">
                <CreditCard className="h-5 w-5 mr-3" />
                <span>Banks</span>
              </Button>
            </Link>

            <Link href="/profile/settings" className="block">
              <Button variant="ghost" className="w-full justify-start h-12">
                <Settings className="h-5 w-5 mr-3" />
                <span>Account Settings</span>
              </Button>
            </Link>

            <Link href="/support" className="block">
              <Button variant="ghost" className="w-full justify-start h-12">
                <HelpCircle className="h-5 w-5 mr-3" />
                <span>Help & Support</span>
              </Button>
            </Link>

            <Separator />

            <Button 
              variant="ghost" 
              className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Logout</span>
            </Button>
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
  profileEmoji?: string;
  wallet?: { balance: number };
  kycDetails?: { status?: string };
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  occupation?: string;
  company?: string;
  bio?: string;
};
