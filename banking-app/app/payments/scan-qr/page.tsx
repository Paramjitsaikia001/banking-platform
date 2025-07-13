'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, QrCode, Camera, Smartphone, DollarSign, CreditCard, Building, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { useWallet } from "@/app/context/wallet-context";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

export default function ScanQRPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);
  const [pin, setPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  
  const router = useRouter();
  const { user: authUser } = useAuth();
  const { user, updateBankAccount, addBankTransaction } = useUser();
  const { balance, updateBalance, addTransaction } = useWallet();

  // Mock bank accounts - in real app this would come from UserContext
  const bankAccounts = user?.bankAccounts || [
    { id: '1', bankName: 'HDFC Bank', accountNumber: '1234567890', balance: 50000 },
    { id: '2', bankName: 'SBI Bank', accountNumber: '0987654321', balance: 75000 }
  ];

  // Cleanup camera when component unmounts or when navigating back
  useEffect(() => {
    return () => {
      if (isScanning) {
        setIsScanning(false);
      }
    };
  }, [isScanning]);

  const handleScanQR = () => {
    setIsScanning(true);
    // Mock QR scanning - simulate scanning after 2 seconds
    setTimeout(() => {
      const mockQRData = JSON.stringify({
        type: "payment",
        amount: 100,
        upiId: "john.doe@bank",
        name: "John Doe",
        note: "Mock QR payment"
      });
      setScannedData(mockQRData);
      setAmount('100');
      setShowPaymentForm(true);
      setIsScanning(false);
      toast.success('QR Code scanned successfully!');
    }, 2000);
  };

  const handleManualInput = () => {
    setShowManualInput(true);
  };

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
    if (value === 'bank_account') {
      setSelectedBankAccount(bankAccounts[0]); // Default to first account
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scannedData || !amount || !paymentMethod) {
      toast.error('Please scan a QR code, enter amount, and select payment method');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check if user has sufficient balance
    if (paymentMethod === 'wallet' && balance < numAmount) {
      toast.error('Insufficient wallet balance');
      return;
    }

    if (paymentMethod === 'bank_account' && selectedBankAccount && selectedBankAccount.balance < numAmount) {
      toast.error('Insufficient bank account balance');
      return;
    }

    // No PIN required, process payment immediately
    setIsLoading(true);
    try {
      // Mock API call - in real app this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Parse QR data to get recipient info
      const qrInfo = parseQRData(scannedData);
      
      // Create transaction record
      const transaction = {
        id: Date.now(),
        type: 'qr_payment',
        amount: -numAmount,
        description: `QR Payment to ${qrInfo?.recipientName || 'Unknown'}`,
        status: 'completed',
        paymentMethod: paymentMethod,
        recipientDetails: {
          upiId: qrInfo?.recipientId || scannedData
        },
        note: note,
        createdAt: new Date().toISOString()
      };

      // Update balance based on payment method
      if (paymentMethod === 'wallet') {
        const newBalance = balance - numAmount;
        updateBalance(newBalance);
        addTransaction(transaction);
      } else if (paymentMethod === 'bank_account' && selectedBankAccount) {
        // Update bank account balance in UserContext
        const newBankBalance = selectedBankAccount.balance - numAmount;
        updateBankAccount(selectedBankAccount.id, { balance: newBankBalance });
        addBankTransaction(selectedBankAccount.id, transaction);
      }

      toast.success('QR payment successful!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const parseQRData = (qrData: string) => {
    try {
      const data = JSON.parse(qrData);
      return {
        recipientId: data.upiId || '',
        recipientName: data.name || '',
        amount: data.amount || '',
        note: data.note || '',
      };
    } catch {
      return null;
    }
  };

  const qrInfo = scannedData ? parseQRData(scannedData) : null;

  const handleBack = () => {
    // Turn off camera if scanning
    if (isScanning) {
      setIsScanning(false);
    }
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Scan QR</h1>
        <p className="text-muted-foreground">Scan QR code to make payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-orange-600" />
            QR Code Payment
          </CardTitle>
          <CardDescription>
            Scan a QR code or enter details manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!scannedData ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <QrCode className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600 mb-4">
                  Point your camera at a QR code
                </p>
                <div className="space-y-2">
                  <Button
                    onClick={handleScanQR}
                    disabled={isScanning}
                    className="w-full"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isScanning ? 'Scanning...' : 'Scan QR Code (Mock)'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleManualInput}
                    className="w-full"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Enter Manually
                  </Button>
                </div>
              </div>

              {isScanning && (
                <div className="aspect-square w-full max-w-sm mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
                    <p className="text-sm text-gray-600">Mock Camera Scanning...</p>
                    <p className="text-xs text-gray-500 mt-2">In real app, camera would be active here</p>
                  </div>
                </div>
              )}

              {showManualInput && (
                <div className="space-y-2">
                  <Label htmlFor="manualRecipient">Recipient UPI ID</Label>
                  <Input
                    id="manualRecipient"
                    placeholder="Enter UPI ID"
                    value={scannedData}
                    onChange={(e) => setScannedData(e.target.value)}
                  />
                  <Button 
                    onClick={() => {
                      if (scannedData) {
                        setShowPaymentForm(true);
                        setShowManualInput(false);
                      }
                    }}
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          ) : showPaymentForm ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">QR Code Scanned</span>
                </div>
                {qrInfo && (
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Recipient:</strong> {qrInfo.recipientName}</p>
                    <p><strong>UPI ID:</strong> {qrInfo.recipientId}</p>
                    {qrInfo.note && <p><strong>Note:</strong> {qrInfo.note}</p>}
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={handlePaymentMethodChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wallet">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4" />
                          Wallet (₹{balance.toLocaleString()})
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_account">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Bank Account
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'bank_account' && (
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Select Bank Account</Label>
                    <Select 
                      value={selectedBankAccount?.id} 
                      onValueChange={(value) => {
                        const account = bankAccounts.find(acc => acc.id === value);
                        setSelectedBankAccount(account);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {account.bankName} - ₹{account.balance.toLocaleString()}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

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
                  <Label htmlFor="note">Note (Optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note for this payment"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setScannedData('');
                      setAmount('');
                      setNote('');
                      setPaymentMethod('');
                      setSelectedBankAccount(null);
                      setShowPaymentForm(false);
                      setShowManualInput(false);
                    }}
                    className="flex-1"
                  >
                    Scan Again
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Pay'}
                  </Button>
                </div>
              </form>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* PIN Input Dialog */}
      {/* Removed PIN input dialog rendering */}
    </div>
  );
} 