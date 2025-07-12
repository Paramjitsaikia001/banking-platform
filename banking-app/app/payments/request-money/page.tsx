'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Phone, DollarSign, MessageSquare, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { useWallet } from "@/app/context/wallet-context";
import { toast } from "sonner";

export default function RequestMoneyPage() {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userWalletId, setUserWalletId] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [isRequestSent, setIsRequestSent] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  const { addTransaction } = useWallet();

  // Mock user data - in real app this would come from API
  const mockUsers = [
    { 
      phone: '9876543210', 
      name: 'John Doe', 
      email: 'john.doe@example.com',
      walletId: 'WAL001' 
    },
    { 
      phone: '9876543211', 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com',
      walletId: 'WAL002' 
    },
    { 
      phone: '9876543212', 
      name: 'Mike Johnson', 
      email: 'mike.johnson@example.com',
      walletId: 'WAL003' 
    },
  ];

  const handlePhoneVerification = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    if (!amount) {
      toast.error('Please enter an amount first');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsVerifying(true);

    try {
      // Mock API call to verify phone number and fetch user data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.phone === phoneNumber);
      
      if (foundUser) {
        setUserName(foundUser.name);
        setUserEmail(foundUser.email);
        setUserWalletId(foundUser.walletId);
        setShowUserInfo(true);
        toast.success('User found! You can now send the request.');
      } else {
        toast.error('User not found. Please check the phone number and try again.');
      }
    } catch (error) {
      toast.error('Error verifying phone number');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !phoneNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!showUserInfo) {
      toast.error('Please verify the phone number first');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - in real app this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Create transaction record for money request
      const transaction = {
        id: Date.now(),
        type: 'money_request',
        amount: numAmount,
        description: `Money request from ${userName} (${phoneNumber})`,
        status: 'pending',
        recipientDetails: {
          phoneNumber: phoneNumber,
          userName: userName,
          userEmail: userEmail,
          userWalletId: userWalletId
        },
        notes: notes,
        createdAt: new Date().toISOString()
      };

      // Add transaction to history (pending request)
      addTransaction(transaction);

      setIsRequestSent(true);
      toast.success('Money request sent successfully!');
      
      // Reset form after successful request
      setTimeout(() => {
        setAmount('');
        setPhoneNumber('');
        setUserName('');
        setUserEmail('');
        setUserWalletId('');
        setNotes('');
        setShowUserInfo(false);
        setIsRequestSent(false);
      }, 2000);

    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setPhoneNumber('');
    setUserName('');
    setUserEmail('');
    setUserWalletId('');
    setNotes('');
    setShowUserInfo(false);
    setIsRequestSent(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Request Money</h1>
        <p className="text-muted-foreground">Request money from other users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            Request Money
          </CardTitle>
          <CardDescription>
            Enter amount and recipient details to request money
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Recipient Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {!showUserInfo ? (
              <Button
                type="button"
                onClick={handlePhoneVerification}
                disabled={isVerifying || !amount || !phoneNumber}
                className="w-full"
              >
                {isVerifying ? 'Verifying...' : 'Verify & Fetch User Data'}
              </Button>
            ) : (
              <div className="space-y-4 p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">User Found</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Name</p>
                      <p className="text-sm text-green-600">{userName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Phone</p>
                      <p className="text-sm text-green-600">{phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Email</p>
                      <p className="text-sm text-green-600">{userEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Wallet ID</p>
                      <p className="text-sm text-green-600">{userWalletId}</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPhoneNumber('');
                    setUserName('');
                    setUserEmail('');
                    setUserWalletId('');
                    setShowUserInfo(false);
                  }}
                  className="w-full"
                >
                  Change Phone Number
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add a note for this request (e.g., 'For lunch', 'Rent payment')"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !showUserInfo || isRequestSent}
            >
              {isLoading ? 'Sending Request...' : isRequestSent ? 'Request Sent!' : 'Send Money Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 