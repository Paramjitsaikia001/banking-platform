// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children, initialValue }) {
  const [currentUser, setCurrentUser] = useState(initialValue?.user || null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Register new user
  const register = async (email, password, name, phone) => {
    try {
      setAuthError(null);
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Get user token
      const token = await userCredential.user.getIdToken();
      
      // Create user in our backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { 
          firebaseUid: userCredential.user.uid,
          email,
          name,
          phone
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setUserDetails(response.data.user);
      toast.success('Account created successfully!');
      return response.data.user;
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setAuthError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setAuthError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get user token
      const token = await userCredential.user.getIdToken();
      
      // Get user profile from our backend
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setUserDetails(response.data.user);
      toast.success('Login successful!');
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setAuthError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await signOut(auth);
      setUserDetails(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.message);
      throw error;
    }
  };

  // Setup PIN
  const setupPin = async (pin) => {
    try {
      if (!currentUser) throw new Error('No user authenticated');
      
      const token = await currentUser.getIdToken();
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/setup-pin`,
        { pin },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setUserDetails({...userDetails, hasPIN: true});
      toast.success('PIN set successfully!');
      return response.data;
    } catch (error) {
      console.error('Setup PIN error:', error);
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Update profile
  const updateUserProfile = async (userData) => {
    try {
      if (!currentUser) throw new Error('No user authenticated');
      
      const token = await currentUser.getIdToken();
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/update-profile`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setUserDetails({...userDetails, ...userData});
      toast.success('Profile updated successfully!');
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Effect to set user on auth state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          setUserDetails(response.data.user);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        setUserDetails(null);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userDetails,
    register,
    login,
    logout,
    resetPassword,
    setupPin,
    updateUserProfile,
    loading,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}