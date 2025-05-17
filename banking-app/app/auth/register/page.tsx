"use client"

import React from 'react';
import { useRegistration, RegistrationProvider } from '@/context/RegistrationContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authApi } from '@/utils/api';

// Step 1: Phone Number
const PhoneStep = () => {
  const { data, updateData, setStep } = useRegistration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.startRegistration(data.phoneNumber);
      toast.success('OTP sent successfully');
      setStep(2);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={data.phoneNumber}
          onChange={(e) => updateData({ phoneNumber: e.target.value })}
          required
          pattern="[0-9]{10}"
          placeholder="Enter your phone number"
        />
      </div>
      <Button type="submit">Send OTP</Button>
    </form>
  );
};

// Step 2: Phone Verification
const PhoneVerificationStep = () => {
  const { data, updateData, setStep } = useRegistration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.verifyPhone(data.phoneNumber, data.phoneOtp);
      toast.success('Phone number verified');
      setStep(3);
    } catch (error: any) {
      toast.error(error?.message || 'Invalid OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="phoneOtp">Enter OTP</Label>
        <Input
          id="phoneOtp"
          type="text"
          value={data.phoneOtp}
          onChange={(e) => updateData({ phoneOtp: e.target.value })}
          required
          pattern="[0-9]{6}"
          placeholder="Enter 6-digit OTP"
        />
      </div>
      <Button type="submit">Verify OTP</Button>
    </form>
  );
};

// Step 3: Personal Details
const PersonalDetailsStep = () => {
  const { data, updateData, setStep } = useRegistration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      toast.error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }

    try {
      await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        password: data.password,
        phoneNumber: data.phoneNumber
      });
      
      toast.success('Personal details saved');
      setStep(4);
    } catch (error: any) {
      toast.error(error?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => updateData({ firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => updateData({ lastName: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => updateData({ dateOfBirth: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={data.password}
          onChange={(e) => updateData({ password: e.target.value })}
          required
          minLength={8}
          placeholder="Enter password"
        />
        <p className="text-sm text-gray-500 mt-1">
          Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
        </p>
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={data.confirmPassword}
          onChange={(e) => updateData({ confirmPassword: e.target.value })}
          required
          minLength={8}
          placeholder="Confirm password"
        />
      </div>
      <Button type="submit">Continue</Button>
    </form>
  );
};

// Step 4: Email Verification
const EmailVerificationStep = () => {
  const { data, updateData, setStep } = useRegistration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.verifyEmail(data.email, data.emailOtp);
      toast.success('Email verified');
      setStep(5);
    } catch (error: any) {
      toast.error(error?.message || 'Invalid OTP');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          required
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="emailOtp">Enter Email OTP</Label>
        <Input
          id="emailOtp"
          type="text"
          value={data.emailOtp}
          onChange={(e) => updateData({ emailOtp: e.target.value })}
          required
          pattern="[0-9]{6}"
          placeholder="Enter 6-digit OTP"
        />
      </div>
      <Button type="submit">Verify Email</Button>
    </form>
  );
};

// Step 5: KYC Details
const KYCStep = () => {
  const { data, updateData } = useRegistration();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await authApi.submitKyc(data.kycDetails);
      localStorage.setItem('token', result.token);
      toast.success('KYC details submitted successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'KYC submission failed');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'panCardImage' | 'aadharCardImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      updateData({
        kycDetails: {
          ...data.kycDetails,
          [type]: reader.result as string
        }
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={data.kycDetails.fullName}
          onChange={(e) => updateData({
            kycDetails: { ...data.kycDetails, fullName: e.target.value }
          })}
          required
        />
      </div>
      <div>
        <Label htmlFor="panNumber">PAN Number</Label>
        <Input
          id="panNumber"
          value={data.kycDetails.panNumber}
          onChange={(e) => updateData({
            kycDetails: { ...data.kycDetails, panNumber: e.target.value }
          })}
          required
          pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
          placeholder="Enter PAN number"
        />
      </div>
      <div>
        <Label htmlFor="aadharNumber">Aadhar Number</Label>
        <Input
          id="aadharNumber"
          value={data.kycDetails.aadharNumber}
          onChange={(e) => updateData({
            kycDetails: { ...data.kycDetails, aadharNumber: e.target.value }
          })}
          required
          pattern="[0-9]{12}"
          placeholder="Enter Aadhar number"
        />
      </div>
      <div>
        <Label htmlFor="panCardImage">PAN Card Image</Label>
        <Input
          id="panCardImage"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'panCardImage')}
          required
        />
      </div>
      <div>
        <Label htmlFor="aadharCardImage">Aadhar Card Image</Label>
        <Input
          id="aadharCardImage"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileUpload(e, 'aadharCardImage')}
          required
        />
      </div>
      <Button type="submit">Submit KYC</Button>
    </form>
  );
};

// Main Registration Page Component
const RegisterPageContent = () => {
  const { step } = useRegistration();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PhoneStep />;
      case 2:
        return <PhoneVerificationStep />;
      case 3:
        return <PersonalDetailsStep />;
      case 4:
        return <EmailVerificationStep />;
      case 5:
        return <KYCStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Registration - Step {step} of 5
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

// Wrapper component with RegistrationProvider
export default function RegisterPage() {
  return (
    <RegistrationProvider>
      <RegisterPageContent />
    </RegistrationProvider>
  );
}
