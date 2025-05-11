// src/components/wallet/Wallet.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import TransactionItem from '../common/TransactionItem';
import DashboardCard from '../common/DashboardCard';
import Button from '../common/Button';

const Wallet = () => {
  useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferMessage, setTransferMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/wallet');
        setWallet(data.wallet);
        setTransactions(data.recentTransactions);
      } catch (err) {
        setError('Failed to fetch wallet data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    
    if (!transferAmount || !transferRecipient) {
      setError('Please fill in all fields');
      return;
    }

    if (parseFloat(transferAmount) <= 0) {
      setError('Transfer amount must be greater than 0');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/wallet/transfer', {
        amount: parseFloat(transferAmount),
        recipient: transferRecipient,
        message: transferMessage
      });
      
      setWallet(data.wallet);
      setTransactions([data.transaction, ...transactions]);
      setSuccess('Transfer successful!');
      setError('');
      
      // Reset form
      setTransferAmount('');
      setTransferRecipient('');
      setTransferMessage('');
      setShowTransferModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !wallet) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DashboardCard 
          title="Available Balance"
          value={`$${wallet?.balance.toFixed(2)}`}
          icon="wallet"
          color="primary"
        />
        
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={() => setShowTransferModal(true)}
            className="w-full"
          >
            Send Money
          </Button>
          
          <Button 
            variant="secondary"
            className="w-full"
            onClick={() => {/* Add functionality to show top-up modal */}}
          >
            Top-up Wallet
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <TransactionItem 
                key={transaction._id} 
                transaction={transaction} 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Send Money</h2>
            
            <form onSubmit={handleTransfer}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Recipient Email</label>
                <input
                  type="email"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="recipient@example.com"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Message (Optional)</label>
                <input
                  type="text"
                  value={transferMessage}
                  onChange={(e) => setTransferMessage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Lunch payment, rent, etc."
                />
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1">
                  Send
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowTransferModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;