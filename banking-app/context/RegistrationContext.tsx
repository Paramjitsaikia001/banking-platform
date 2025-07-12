import React, { createContext, useContext, useState } from 'react';

interface RegistrationData {
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  pin: string;
  phoneOtp: string;
  emailOtp: string;
  kycDetails: {
    fullName: string;
    panNumber: string;
    aadharNumber: string;
    panCardImage: string;
    aadharCardImage: string;
  };
}

interface RegistrationContextType {
  step: number;
  data: RegistrationData;
  setStep: (step: number) => void;
  updateData: (data: Partial<RegistrationData>) => void;
  resetData: () => void;
}

const initialState: RegistrationData = {
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  pin: '',
  phoneOtp: '',
  emailOtp: '',
  kycDetails: {
    fullName: '',
    panNumber: '',
    aadharNumber: '',
    panCardImage: '',
    aadharCardImage: ''
  }
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>(initialState);

  const updateData = (newData: Partial<RegistrationData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const resetData = () => {
    setData(initialState);
    setStep(1);
  };

  return (
    <RegistrationContext.Provider value={{ step, data, setStep, updateData, resetData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}; 