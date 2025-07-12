"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/context/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Banknote, 
  User, 
  CreditCard, 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Building2,
  FileText,
  Camera,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import BankBalanceChecker from "./bank-balance-checker"
import BankAccountsList from "./bank-accounts-list"
import { useWallet } from "@/app/context/wallet-context";

interface BankDetails {
  bankName: string
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  accountType: string
}

interface KYCDetails {
  panNumber: string
  aadharNumber: string
  photoIdFile: File | null
  photoIdFileName: string
}

interface BankAccount {
  id: string
  bankName: string
  accountHolderName: string
  accountNumber: string
  ifscCode: string
  accountType: string
  balance: number
  status: 'pending' | 'verified' | 'rejected'
  kycStatus: 'pending' | 'verified' | 'rejected'
  linkedAt: string
  lastUpdated?: string
}

export default function BankAccountLinking() {
  const { user, addBankAccount, updateBankAccount, removeBankAccount, getBankAccounts } = useUser()
  const [currentStep, setCurrentStep] = useState<'bank-details' | 'kyc-verification' | 'verification' | 'success'>('bank-details')
  const [isLoading, setIsLoading] = useState(false)
  const [linkedAccounts, setLinkedAccounts] = useState<BankAccount[]>([])
  
  // Form states
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'savings'
  })
  
  const [kycDetails, setKycDetails] = useState<KYCDetails>({
    panNumber: '',
    aadharNumber: '',
    photoIdFile: null,
    photoIdFileName: ''
  })

  // Load bank accounts from UserContext on component mount
  useEffect(() => {
    const accounts = getBankAccounts()
    setLinkedAccounts(accounts)
  }, [getBankAccounts])

  const handleBankDetailsChange = (field: keyof BankDetails, value: string) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleKYCChange = (field: keyof KYCDetails, value: string | File) => {
    if (field === 'photoIdFile' && value instanceof File) {
      setKycDetails(prev => ({
        ...prev,
        photoIdFile: value,
        photoIdFileName: value.name
      }))
    } else if (typeof value === 'string') {
      setKycDetails(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const validateBankDetails = () => {
    if (!bankDetails.bankName || !bankDetails.accountHolderName || 
        !bankDetails.accountNumber || !bankDetails.ifscCode) {
      toast.error('Please fill in all bank details')
      return false
    }
    
    if (bankDetails.accountNumber.length < 10) {
      toast.error('Account number must be at least 10 digits')
      return false
    }
    
    if (bankDetails.ifscCode.length !== 11) {
      toast.error('IFSC code must be 11 characters')
      return false
    }
    
    return true
  }

  const validateKYC = () => {
    if (!kycDetails.panNumber || !kycDetails.aadharNumber) {
      toast.error('Please fill in PAN and Aadhar numbers')
      return false
    }
    
    if (kycDetails.panNumber.length !== 10) {
      toast.error('PAN number must be 10 characters')
      return false
    }
    
    if (kycDetails.aadharNumber.length !== 12) {
      toast.error('Aadhar number must be 12 digits')
      return false
    }
    
    if (!kycDetails.photoIdFile) {
      toast.error('Please upload a photo ID')
      return false
    }
    
    return true
  }

  const handleNextStep = () => {
    if (currentStep === 'bank-details') {
      if (validateBankDetails()) {
        setCurrentStep('kyc-verification')
      }
    } else if (currentStep === 'kyc-verification') {
      if (validateKYC()) {
        setCurrentStep('verification')
        handleVerification()
      }
    }
  }

  const handleVerification = async () => {
    setIsLoading(true)
    
    try {
      // Simulate backend validation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock verification result
      const isVerified = Math.random() > 0.2 // 80% success rate
      
      if (isVerified) {
        const newAccount: BankAccount = {
          id: `bank_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          bankName: bankDetails.bankName,
          accountHolderName: bankDetails.accountHolderName,
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
          accountType: bankDetails.accountType,
          balance: 10000, // Initial balance set to 10000
          status: 'verified',
          kycStatus: 'verified',
          linkedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
        
        // Add to UserContext for persistent storage
        addBankAccount(newAccount)
        
        // Update local state
        setLinkedAccounts(prev => [...prev, newAccount])
        setCurrentStep('success')
        toast.success('Bank account linked successfully!')
      } else {
        toast.error('Verification failed. Please check your details and try again.')
        setCurrentStep('kyc-verification')
      }
    } catch (error) {
      toast.error('An error occurred during verification')
      setCurrentStep('kyc-verification')
    } finally {
      setIsLoading(false)
    }
  }



  const handleRemoveAccount = (accountId: string) => {
    // Remove from UserContext
    removeBankAccount(accountId)
    
    // Update local state
    setLinkedAccounts(prev => prev.filter(account => account.id !== accountId))
    
    toast.success('Bank account removed successfully')
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image or PDF file')
        return
      }
      
      handleKYCChange('photoIdFile', file)
    }
  }

  const resetForm = () => {
    setBankDetails({
      bankName: '',
      accountHolderName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'savings'
    })
    setKycDetails({
      panNumber: '',
      aadharNumber: '',
      photoIdFile: null,
      photoIdFileName: ''
    })
    setCurrentStep('bank-details')
  }

  const { transactions } = useWallet();

  // Filter transactions related to bank accounts
  const bankAccountTransactions = transactions.filter(
    (tx) =>
      (tx.type === 'wallet_add' && tx.description && tx.description.toLowerCase().includes('bank')) ||
      (tx.type === 'wallet_transfer' && tx.description && tx.description.toLowerCase().includes('bank')) ||
      (tx.type === 'bank_transfer') ||
      (tx.description && tx.description.toLowerCase().includes('bank'))
  );

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bank Account Linking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please log in to link bank accounts</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Bank Account Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Account Transactions</CardTitle>
          <CardDescription>Transactions from or to your linked bank accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {bankAccountTransactions.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">No bank account transactions found.</div>
          ) : (
            <div className="space-y-3">
              {bankAccountTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border rounded-lg p-3">
                  <div>
                    <div className="font-medium">{tx.description}</div>
                    <div className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>{tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1 capitalize">{tx.type.replace(/_/g, ' ')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Bank Balance Checker */}
      <BankBalanceChecker />

      {/* Linked Accounts */}
      <BankAccountsList 
        title="Linked Bank Accounts"
        description="Your connected bank accounts and their current status"
        showActions={true}
      />

      {/* Link New Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Link New Bank Account
          </CardTitle>
          <CardDescription>
            {currentStep === 'bank-details' && 'Enter your bank account details'}
            {currentStep === 'kyc-verification' && 'Complete KYC verification'}
            {currentStep === 'verification' && 'Verifying your account...'}
            {currentStep === 'success' && 'Account linked successfully!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            {['bank-details', 'kyc-verification', 'verification', 'success'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep === step 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : index < ['bank-details', 'kyc-verification', 'verification', 'success'].indexOf(currentStep)
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-muted text-muted-foreground border-muted'
                }`}>
                  {index < ['bank-details', 'kyc-verification', 'verification', 'success'].indexOf(currentStep) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    index < ['bank-details', 'kyc-verification', 'verification', 'success'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Bank Details Form */}
          {currentStep === 'bank-details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={bankDetails.bankName}
                    onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={bankDetails.accountHolderName}
                    onChange={(e) => handleBankDetailsChange('accountHolderName', e.target.value)}
                    placeholder="Enter account holder name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                    placeholder="Enter account number"
                    maxLength={20}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={bankDetails.ifscCode}
                    onChange={(e) => handleBankDetailsChange('ifscCode', e.target.value.toUpperCase())}
                    placeholder="Enter IFSC code"
                    maxLength={11}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={bankDetails.accountType} onValueChange={(value) => handleBankDetailsChange('accountType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="current">Current Account</SelectItem>
                      <SelectItem value="salary">Salary Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleNextStep} className="w-full">
                Continue to KYC Verification
              </Button>
            </div>
          )}

          {/* KYC Verification Form */}
          {currentStep === 'kyc-verification' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={kycDetails.panNumber}
                    onChange={(e) => handleKYCChange('panNumber', e.target.value.toUpperCase())}
                    placeholder="Enter PAN number"
                    maxLength={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number</Label>
                  <Input
                    id="aadharNumber"
                    value={kycDetails.aadharNumber}
                    onChange={(e) => handleKYCChange('aadharNumber', e.target.value)}
                    placeholder="Enter Aadhar number"
                    maxLength={12}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photoId">Upload Photo ID</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="photoId"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="photoId" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {kycDetails.photoIdFileName || 'Click to upload photo ID'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports JPG, PNG, PDF (max 5MB)
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep('bank-details')}>
                  Back
                </Button>
                <Button onClick={handleNextStep} className="flex-1">
                  Submit for Verification
                </Button>
              </div>
            </div>
          )}

          {/* Verification Progress */}
          {currentStep === 'verification' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Verifying Your Account</h3>
              <p className="text-muted-foreground">
                We're validating your bank details and KYC information. This may take a few moments.
              </p>
            </div>
          )}

          {/* Success */}
          {currentStep === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Account Linked Successfully!</h3>
              <p className="text-muted-foreground mb-4">
                Your bank account has been verified and linked to your profile.
              </p>
              <Button onClick={resetForm}>
                Link Another Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 