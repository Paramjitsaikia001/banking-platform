'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, PlusCircle, CreditCard, Building2, Smartphone, Wallet, User, Phone, Banknote, Shield, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { useWallet } from "@/app/context/wallet-context";
import { toast } from "sonner";
import BankAccountSelector from "@/components/banks/bank-account-selector";
import { useUser } from "@/context/UserContext";

export default function AddMoneyPage() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  
  // Bank transfer states
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState<any>(null);
  const [showManualBankForm, setShowManualBankForm] = useState(false);
  
  // Card payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardOtp, setCardOtp] = useState('');
  const [showCardOtpInput, setShowCardOtpInput] = useState(false);
  const [isCardOtpSent, setIsCardOtpSent] = useState(false);
  const [isCardOtpVerifying, setIsCardOtpVerifying] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  const { balance, updateBalance, addTransaction } = useWallet();
  const { updateBankAccount } = useUser();

  const paymentMethods = [
    { value: 'wallet', label: 'Wallet', icon: <Wallet className="h-4 w-4" /> },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <Building2 className="h-4 w-4" /> },
    { value: 'card_payment', label: 'Card Payment', icon: <CreditCard className="h-4 w-4" /> },
  ];

  const banks = [
    { value: 'sbi', label: 'State Bank of India (SBI)', code: 'SBIN0000001' },
    { value: 'hdfc', label: 'HDFC Bank', code: 'HDFC0000001' },
    { value: 'icici', label: 'ICICI Bank', code: 'ICIC0000001' },
    { value: 'axis', label: 'Axis Bank', code: 'UTIB0000001' },
    { value: 'kotak', label: 'Kotak Mahindra Bank', code: 'KOTK0000001' },
  ];

  const months = [
    { value: '01', label: '01' }, { value: '02', label: '02' }, { value: '03', label: '03' },
    { value: '04', label: '04' }, { value: '05', label: '05' }, { value: '06', label: '06' },
    { value: '07', label: '07' }, { value: '08', label: '08' }, { value: '09', label: '09' },
    { value: '10', label: '10' }, { value: '11', label: '11' }, { value: '12', label: '12' },
  ];

  const years = [
    { value: '2024', label: '2024' }, { value: '2025', label: '2025' }, { value: '2026', label: '2026' },
    { value: '2027', label: '2027' }, { value: '2028', label: '2028' }, { value: '2029', label: '2029' },
    { value: '2030', label: '2030' },
  ];

  // Mock user data - in real app this would come from API
  const mockUsers = [
    { phone: '9876543210', name: 'John Doe', walletId: 'WAL001' },
    { phone: '9876543211', name: 'Jane Smith', walletId: 'WAL002' },
    { phone: '9876543212', name: 'Mike Johnson', walletId: 'WAL003' },
  ];

  const handlePhoneVerification = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    setIsVerifying(true);

    try {
      // Mock API call to verify phone number
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.phone === phoneNumber);
      
      if (foundUser) {
        setUserName(foundUser.name);
        setShowUserInfo(true);
        toast.success('Phone number verified!');
      } else {
        toast.error('Phone number not found. Please check and try again.');
      }
    } catch (error) {
      toast.error('Error verifying phone number');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBankAccountSelect = (account: any) => {
    setSelectedBankAccount(account);
    setSelectedBank(account.bankName);
    setAccountNumber(account.accountNumber);
    setIfscCode(account.ifscCode);
    setAccountHolderName(account.accountHolderName);
    setShowManualBankForm(false);
  };

  const handleManualBankEntry = () => {
    setSelectedBankAccount(null);
    setSelectedBank('');
    setAccountNumber('');
    setIfscCode('');
    setAccountHolderName('');
    setShowManualBankForm(true);
  };

  const handleSendOtp = async () => {
    if (selectedBankAccount) {
      // Using linked bank account
      if (!selectedBankAccount) {
        toast.error('Please select a bank account');
        return;
      }
    } else {
      // Manual bank details
      if (!selectedBank || !accountNumber || !ifscCode || !accountHolderName) {
        toast.error('Please fill in all bank details');
        return;
      }
    }

    setIsOtpSent(true);
    setShowOtpInput(true);

    try {
      // Mock API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('OTP sent to your registered mobile number!');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    setIsOtpVerifying(true);

    try {
      // Mock API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp === '123456') { // Mock OTP
        toast.success('OTP verified successfully!');
        setShowOtpInput(false);
        setIsOtpSent(false);
        setOtp('');
        // Proceed with payment
        await handleSubmit(null);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Error verifying OTP');
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const handleSendCardOtp = async () => {
    if (!cardNumber || !cardHolderName || !expiryMonth || !expiryYear || !cvv) {
      toast.error('Please fill in all card details');
      return;
    }

    setIsCardOtpSent(true);
    setShowCardOtpInput(true);

    try {
      // Mock API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('OTP sent to your registered mobile number!');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyCardOtp = async () => {
    if (!cardOtp) {
      toast.error('Please enter OTP');
      return;
    }

    setIsCardOtpVerifying(true);

    try {
      // Mock API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (cardOtp === '123456') { // Mock OTP
        toast.success('OTP verified successfully!');
        setShowCardOtpInput(false);
        setIsCardOtpSent(false);
        setCardOtp('');
        // Proceed with payment
        await handleSubmit(null);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Error verifying OTP');
    } finally {
      setIsCardOtpVerifying(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleSubmit = async (e?: React.FormEvent | null) => {
    if (e) e.preventDefault();
    
    if (!amount || !paymentMethod) {
      toast.error('Please fill in all fields');
      return;
    }

    if (paymentMethod === 'wallet' && !phoneNumber) {
      toast.error('Please enter phone number for wallet payment');
      return;
    }

    if (paymentMethod === 'bank_transfer' && !selectedBank) {
      toast.error('Please complete bank transfer details');
      return;
    }

    if (paymentMethod === 'card_payment' && !cardNumber) {
      toast.error('Please complete card payment details');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - in real app this would call the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Create transaction record
      const transaction = {
        id: Date.now(),
        type: 'wallet_add',
        amount: numAmount,
        description: paymentMethod === 'wallet' 
          ? `Added money via wallet (${userName})` 
          : paymentMethod === 'bank_transfer'
          ? `Added money via bank transfer (${selectedBank})`
          : paymentMethod === 'card_payment'
          ? `Added money via card payment (${cardNumber.slice(-4)})`
          : `Added money via ${paymentMethod}`,
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      // Update balance using shared context
      const newBalance = balance + numAmount;
      updateBalance(newBalance);
      addTransaction(transaction);

      // Decrease linked bank account balance if used
      if (paymentMethod === 'bank_transfer' && selectedBankAccount) {
        updateBankAccount(selectedBankAccount.id, {
          balance: Math.max(0, (selectedBankAccount.balance || 0) - numAmount),
          lastUpdated: new Date().toISOString()
        });
      }

      toast.success('Money added successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setPaymentMethod('');
    setPhoneNumber('');
    setUserName('');
    setShowUserInfo(false);
    setSelectedBank('');
    setAccountNumber('');
    setIfscCode('');
    setAccountHolderName('');
    setOtp('');
    setShowOtpInput(false);
    setIsOtpSent(false);
    setCardNumber('');
    setCardHolderName('');
    setExpiryMonth('');
    setExpiryYear('');
    setCvv('');
    setCardOtp('');
    setShowCardOtpInput(false);
    setIsCardOtpSent(false);
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
        <h1 className="text-2xl font-bold">Add Money</h1>
        <p className="text-muted-foreground">Add funds to your wallet</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-green-600" />
            Add Money to Wallet
          </CardTitle>
          <CardDescription>
            Choose your payment method and enter the amount
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="1"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value) => {
                setPaymentMethod(value);
                if (value !== 'wallet') {
                  setPhoneNumber('');
                  setUserName('');
                  setShowUserInfo(false);
                }
                if (value !== 'bank_transfer') {
                  setSelectedBank('');
                  setAccountNumber('');
                  setIfscCode('');
                  setAccountHolderName('');
                  setOtp('');
                  setShowOtpInput(false);
                  setIsOtpSent(false);
                }
                if (value !== 'card_payment') {
                  setCardNumber('');
                  setCardHolderName('');
                  setExpiryMonth('');
                  setExpiryYear('');
                  setCvv('');
                  setCardOtp('');
                  setShowCardOtpInput(false);
                  setIsCardOtpSent(false);
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center gap-2">
                        {method.icon}
                        {method.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'wallet' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phoneNumber"
                      placeholder="Enter phone number linked with wallet"
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
                    disabled={isVerifying || !phoneNumber}
                    className="w-full"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Phone Number'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <User className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Verified User</p>
                        <p className="text-sm text-green-600">{userName}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPhoneNumber('');
                        setUserName('');
                        setShowUserInfo(false);
                      }}
                      className="w-full"
                    >
                      Change Phone Number
                    </Button>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                {/* Bank Account Selector */}
                {!showManualBankForm && (
                  <BankAccountSelector
                    selectedAccountId={selectedBankAccount?.id}
                    onAccountSelect={handleBankAccountSelect}
                    onManualEntry={handleManualBankEntry}
                    title="Select Bank Account"
                    description="Choose a linked bank account or enter details manually"
                  />
                )}

                {/* Manual Bank Details Form */}
                {showManualBankForm && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Enter Bank Details</h3>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowManualBankForm(false)}
                      >
                        Use Linked Account
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bank">Select Bank</Label>
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.value} value={bank.value}>
                              <div className="flex items-center gap-2">
                                <Banknote className="h-4 w-4" />
                                {bank.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Enter account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        placeholder="Enter IFSC code"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        placeholder="Enter account holder name"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Selected Bank Account Info */}
                {selectedBankAccount && !showManualBankForm && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Selected Account</p>
                        <p className="text-sm text-green-600">
                          {selectedBankAccount.bankName} • {selectedBankAccount.accountNumber.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!showOtpInput ? (
                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!selectedBank || !accountNumber || !ifscCode || !accountHolderName}
                    className="w-full"
                  >
                    Send OTP
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="otp"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        OTP sent to your registered mobile number
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setOtp('');
                          setShowOtpInput(false);
                          setIsOtpSent(false);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={isOtpVerifying || !otp}
                        className="flex-1"
                      >
                        {isOtpVerifying ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'card_payment' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="pl-10"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardHolderName">Card Holder Name</Label>
                  <Input
                    id="cardHolderName"
                    placeholder="Enter card holder name"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Month</Label>
                    <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Year</Label>
                    <Select value={expiryYear} onValueChange={setExpiryYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="YYYY" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {!showCardOtpInput ? (
                  <Button
                    type="button"
                    onClick={handleSendCardOtp}
                    disabled={!cardNumber || !cardHolderName || !expiryMonth || !expiryYear || !cvv}
                    className="w-full"
                  >
                    Send OTP
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardOtp">Enter OTP</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cardOtp"
                          placeholder="Enter 6-digit OTP"
                          value={cardOtp}
                          onChange={(e) => setCardOtp(e.target.value)}
                          maxLength={6}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        OTP sent to your registered mobile number
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCardOtp('');
                          setShowCardOtpInput(false);
                          setIsCardOtpSent(false);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleVerifyCardOtp}
                        disabled={isCardOtpVerifying || !cardOtp}
                        className="flex-1"
                      >
                        {isCardOtpVerifying ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || 
                (paymentMethod === 'wallet' && !showUserInfo) ||
                (paymentMethod === 'bank_transfer' && !selectedBank) ||
                (paymentMethod === 'card_payment' && !cardNumber)
              }
            >
              {isLoading ? 'Processing...' : 'Add Money'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 