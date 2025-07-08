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
import { useUser } from '@/context/UserContext';

// Step 1: Phone Number and Email Verification
const PhoneEmailStep = () => {
  const { data, updateData, setStep } = useRegistration();

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.startRegistration(data.phoneNumber);
      toast.success('Phone OTP sent successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send phone OTP');
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.verifyPhone(data.phoneNumber, data.phoneOtp);
      toast.success('Phone number verified');
    } catch (error: any) {
      toast.error(error?.message || 'Invalid phone OTP');
    }
  };

  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.sendEmailVerification(data.email, data.phoneNumber);
      toast.success('Email OTP sent successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send email OTP');
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authApi.verifyEmail(data.email, data.emailOtp);
      toast.success('Email verified');
      setStep(2);
    } catch (error: any) {
      toast.error(error?.message || 'Invalid email OTP');
    }
  };

  return (
    <div className="space-y-6">
      {/* Phone Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle>Phone Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={data.phoneNumber || ''}
              onChange={(e) => updateData({ phoneNumber: e.target.value })}
              required
              pattern="[0-9]{10}"
              placeholder="Enter your phone number"
            />
          </div>
          <Button onClick={handleSendPhoneOtp} type="button">Send Phone OTP</Button>
          
          <div>
            <Label htmlFor="phoneOtp">Phone OTP</Label>
            <Input
              id="phoneOtp"
              type="text"
              value={data.phoneOtp || ''}
              onChange={(e) => updateData({ phoneOtp: e.target.value })}
              required
              pattern="[0-9]{6}"
              placeholder="Enter 6-digit phone OTP"
            />
          </div>
          <Button onClick={handleVerifyPhone} type="button">Verify Phone OTP</Button>
        </CardContent>
      </Card>

      {/* Email Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ''}
              onChange={(e) => updateData({ email: e.target.value })}
              required
              placeholder="Enter your email address"
            />
          </div>
          <Button onClick={handleSendEmailOtp} type="button">Send Email OTP</Button>
          
          <div>
            <Label htmlFor="emailOtp">Email OTP</Label>
            <Input
              id="emailOtp"
              type="text"
              value={data.emailOtp || ''}
              onChange={(e) => updateData({ emailOtp: e.target.value })}
              required
              pattern="[0-9]{6}"
              placeholder="Enter 6-digit email OTP"
            />
          </div>
          <Button onClick={handleVerifyEmail} type="button">Verify Email OTP</Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Step 2: Personal Details
const PersonalDetailsStep = () => {
  const { data, updateData, setStep } = useRegistration();
  const router = useRouter();

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

    // PIN validation (4-6 digits)
    if (!data.pin || data.pin.length < 4 || data.pin.length > 6 || !/^\d+$/.test(data.pin)) {
      toast.error('PIN must be 4-6 digits');
      return;
    }

    try {
      const response = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        password: data.password,
        phoneNumber: data.phoneNumber,
        pin: data.pin
      });
      
      toast.success('Registration successful!');
      
      // Store the token and user data
      localStorage.setItem('bankapp_token', response.token);
      localStorage.setItem('bankapp_user', JSON.stringify(response.user));
      
      // Redirect to dashboard
      router.push('/dashboard');
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
            value={data.firstName || ''}
            onChange={(e) => updateData({ firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={data.lastName || ''}
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
          value={data.dateOfBirth || ''}
          onChange={(e) => updateData({ dateOfBirth: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={data.password || ''}
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
          value={data.confirmPassword || ''}
          onChange={(e) => updateData({ confirmPassword: e.target.value })}
          required
          minLength={8}
          placeholder="Confirm password"
        />
      </div>
      <div>
        <Label htmlFor="pin">PIN (4-6 digits)</Label>
        <Input
          id="pin"
          type="password"
          value={data.pin || ''}
          onChange={(e) => updateData({ pin: e.target.value })}
          required
          minLength={4}
          maxLength={6}
          pattern="[0-9]*"
          placeholder="Enter 4-6 digit PIN"
        />
        <p className="text-sm text-gray-500 mt-1">
          This PIN will be used for transactions and account access
        </p>
      </div>
      <Button type="submit">Complete Registration</Button>
    </form>
  );
};

const RegisterPageContent = () => {
  const { step } = useRegistration();

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PhoneEmailStep />;
      case 2:
        return <PersonalDetailsStep />;
      default:
        return <PhoneEmailStep />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <p className="text-gray-600">
            {step === 1 ? 'Verify your phone and email' : 'Complete your profile'}
          </p>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default function RegisterPage() {
  return (
    <RegistrationProvider>
      <RegisterPageContent />
    </RegistrationProvider>
  );
}
