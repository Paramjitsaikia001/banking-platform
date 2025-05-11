// src/components/bank/BankAccounts.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const BankAccounts = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    routingNumber: '',
    accountType: 'checking'
  });

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/bank/accounts');
        setBankAccounts(data.accounts);
      } catch (err) {
        setError('Failed to fetch bank accounts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      const { data } = await api.post('/bank/accounts', formData);
      setBankAccounts(prev => [...prev, data.account]);
      setSuccess('Bank account added successfully!');
      setShowAddModal(false);
      setFormData({
        bankName: '',
        accountNumber: '',
        accountName: '',
        routingNumber: '',
        accountType: 'checking'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bank account');
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post(`/bank/accounts/${currentAccount._id}/deposit`, {
        amount: parseFloat(depositAmount),
        pin: securityPin
      });
      
      setBankAccounts(prev => 
        prev.map(acc => 
          acc._id === currentAccount._id ? data.account : acc
        )
      );
      
      setSuccess(`${parseFloat(depositAmount).toFixed(2)} deposited successfully!`);
      setShowDepositModal(false);
      setDepositAmount('');
      setSecurityPin('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deposit funds');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post(`/bank/accounts/${currentAccount._id}/withdraw`, {
        amount: parseFloat(withdrawAmount),
        pin: securityPin
      });
      
      setBankAccounts(prev => 
        prev.map(acc => 
          acc._id === currentAccount._id ? data.account : acc
        )
      );
      
      setSuccess(`${parseFloat(withdrawAmount).toFixed(2)} withdrawn successfully!`);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setSecurityPin('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to withdraw funds');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (accountId) => {
    if (!window.confirm('Are you sure you want to remove this bank account?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/bank/accounts/${accountId}`);
      setBankAccounts(prev => prev.filter(acc => acc._id !== accountId));
      setSuccess('Bank account removed successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove bank account');
    } finally {
      setLoading(false);
    }
  };

  const openDepositModal = (account) => {
    setCurrentAccount(account);
    setShowDepositModal(true);
  };

  const openWithdrawModal = (account) => {
    setCurrentAccount(account);
    setShowWithdrawModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bank Accounts</h1>
        <Button onClick={() => setShowAddModal(true)}>
          Add Bank Account
        </Button>
      </div>
      
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
      
      {loading && !bankAccounts.length ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : bankAccounts.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No Bank Accounts</h2>
          <p className="text-gray-600 mb-6">You haven't linked any bank accounts yet.</p>
          <Button onClick={() => setShowAddModal(true)}>
            Add Your First Bank Account
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bankAccounts.map((account) => (
            <div key={account._id} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{account.bankName}</h3>
                    <p className="text-gray-600">{account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(account._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Account Number</p>
                  <p>••••• {account.accountNumber.slice(-4)}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Account Holder</p>
                  <p>{account.accountName}</p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="secondary"
                      className="flex-1"
                      onClick={() => openDepositModal(account)}
                    >
                      Deposit
                    </Button>
                    <Button 
                      variant="secondary"
                      className="flex-1"
                      onClick={() => openWithdrawModal(account)}
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Bank Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Add Bank Account</h2>
            
            <form onSubmit={handleAddAccount}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="bankName">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="accountName">Account Holder Name</label>
                  <input
                    type="text"
                    id="accountName"
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="accountNumber">Account Number</label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="routingNumber">Routing Number</label>
                  <input
                    type="text"
                    id="routingNumber"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="accountType">Account Type</label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Account'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Deposit Modal */}
      {showDepositModal && currentAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">Deposit Funds</h2>
            <p className="text-gray-600 mb-4">
              Transfer money from {currentAccount.bankName} (•••• {currentAccount.accountNumber.slice(-4)}) to your wallet
            </p>
            
            <form onSubmit={handleDepositSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="depositAmount">Amount ($)</label>
                  <input
                    type="number"
                    id="depositAmount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="securityPin">Security PIN</label>
                  <input
                    type="password"
                    id="securityPin"
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    maxLength="4"
                    placeholder="Enter your 4-digit PIN"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Processing...' : 'Deposit'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowDepositModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Withdraw Modal */}
      {showWithdrawModal && currentAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">Withdraw Funds</h2>
            <p className="text-gray-600 mb-4">
              Transfer money from your wallet to {currentAccount.bankName} (•••• {currentAccount.accountNumber.slice(-4)})
            </p>
            
            <form onSubmit={handleWithdrawSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="withdrawAmount">Amount ($)</label>
                  <input
                    type="number"
                    id="withdrawAmount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="withdrawPin">Security PIN</label>
                  <input
                    type="password"
                    id="withdrawPin"
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    maxLength="4"
                    placeholder="Enter your 4-digit PIN"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Processing...' : 'Withdraw'}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => setShowWithdrawModal(false)}
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

export default BankAccounts;