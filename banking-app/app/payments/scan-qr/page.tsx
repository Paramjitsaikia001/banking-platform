'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, QrCode, Camera, Smartphone, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { useWallet } from "@/app/context/wallet-context";
import { toast } from "sonner";

export default function ScanQRPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { balance, updateBalance, addTransaction } = useWallet();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScanQR = () => {
    setIsScanning(true);
    // In a real implementation, you would use a QR code scanner library
    // For now, we'll simulate scanning
    setTimeout(() => {
      const mockQRData = 'upi://pay?pa=user@bank&pn=John%20Doe&am=100&tn=Payment';
      setScannedData(mockQRData);
      setIsScanning(false);
      toast.success('QR Code scanned successfully!');
    }, 2000);
  };

  const handleManualInput = () => {
    setShowManualInput(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scannedData || !amount) {
      toast.error('Please scan a QR code and enter amount');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check if user has sufficient balance
    if (balance < numAmount) {
      toast.error('Insufficient balance');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - in real app this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Parse QR data to get recipient info
      const qrInfo = parseQRData(scannedData);
      
      // Create transaction record
      const transaction = {
        id: Date.now(),
        type: 'qr_payment',
        amount: -numAmount,
        description: `QR Payment to ${qrInfo?.recipientName || 'Unknown'}`,
        status: 'completed',
        recipientDetails: {
          upiId: qrInfo?.recipientId || scannedData
        },
        createdAt: new Date().toISOString()
      };

      // Update balance using shared context
      const newBalance = balance - numAmount;
      updateBalance(newBalance);
      addTransaction(transaction);

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
      const url = new URL(qrData);
      const params = new URLSearchParams(url.search);
      return {
        recipientId: params.get('pa') || '',
        recipientName: params.get('pn') || '',
        amount: params.get('am') || '',
        note: params.get('tn') || '',
      };
    } catch {
      return null;
    }
  };

  const qrInfo = scannedData ? parseQRData(scannedData) : null;

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
                    {isScanning ? 'Scanning...' : 'Scan QR Code'}
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

              {showManualInput && (
                <div className="space-y-2">
                  <Label htmlFor="manualRecipient">Recipient UPI ID</Label>
                  <Input
                    id="manualRecipient"
                    placeholder="Enter UPI ID"
                    value={scannedData}
                    onChange={(e) => setScannedData(e.target.value)}
                  />
                </div>
              )}
            </div>
          ) : (
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

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setScannedData('');
                      setAmount('');
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
          )}
        </CardContent>
      </Card>
    </div>
  );
} 