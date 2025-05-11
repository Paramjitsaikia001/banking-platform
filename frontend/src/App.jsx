// src/App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { Toaster } from 'react-hot-toast';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import SetupPin from './pages/auth/SetupPin';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import Wallet from './pages/wallet/Wallet';
import Transfer from './pages/transfers/Transfer';
import BillPayment from './pages/payments/BillPayment';
import AddBankAccount from './pages/settings/AddBankAccount';
import Profile from './pages/profile/Profile';
import Transactions from './pages/transactions/Transactions';
import TransactionDetails from './pages/transactions/TransactionDetails';

// Components
import PrivateRoute from './components/auth/PrivateRoute';
import LoadingScreen from './components/common/LoadingScreen';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) return <LoadingScreen />;

  return (
    <AuthProvider value={{ user }}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Toaster position="top-right" />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
              <Route path="/setup-pin" element={<PrivateRoute><SetupPin /></PrivateRoute>} />
              
              {/* App Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
              <Route path="/transfer" element={<PrivateRoute><Transfer /></PrivateRoute>} />
              <Route path="/pay-bills" element={<PrivateRoute><BillPayment /></PrivateRoute>} />
              <Route path="/add-bank" element={<PrivateRoute><AddBankAccount /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
              <Route path="/transaction/:id" element={<PrivateRoute><TransactionDetails /></PrivateRoute>} />
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;