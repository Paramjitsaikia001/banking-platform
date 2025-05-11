// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  FiArrowUp, 
  FiArrowDown, 
  FiCreditCard, 
  FiDollarSign, 
  FiPlusCircle,
  FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';

// Components
import DashboardCard from '../../components/dashboard/DashboardCard';
import QuickActionButton from '../../components/dashboard/QuickActionButton';
import TransactionItem from '../../components/transactions/TransactionItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Dashboard = () => {
  const { currentUser, userDetails } = useAuth();
  const [walletInfo, setWalletInfo] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        const token = await currentUser.getIdToken();
        
        // Fetch wallet info
        const walletResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/wallet`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Fetch recent transactions
        const transactionsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/transactions?limit=5`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        setWalletInfo(walletResponse.data.wallet);
        setRecentTransactions(transactionsResponse.data.transactions);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {userDetails?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-gray-600">Here's an overview of your finances</p>
      </div>
      
      {/* Wallet Balance Card */}
      <div className="bg-primary-600 rounded-xl text-white p-6 mb-8">
        <div className="mb-2">
          <span className="text-sm opacity-80">Available Balance</span>
        </div>
        <div className="flex items-center">
          <span className="text-3xl font-bold">
            ${walletInfo?.balance.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-3">
          <QuickActionButton 
            to="/transfer"
            icon={<FiArrowUp />}
            label="Send Money"
            color="bg-blue-100 text-blue-600"
          />
          <QuickActionButton 
            to="/wallet"
            icon={<FiArrowDown />}
            label="Deposit"
            color="bg-green-100 text-green-600"
          />
          <QuickActionButton 
            to="/pay-bills"
            icon={<FiDollarSign />}
            label="Pay Bills"
            color="bg-purple-100 text-purple-600"
          />
          <QuickActionButton 
            to="/add-bank"
            icon={<FiPlusCircle />}
            label="Link Bank"
            color="bg-gray-100 text-gray-600"
          />
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <DashboardCard 
          title="This Month"
          value={`$${walletInfo?.monthlySpending?.toFixed(2) || '0.00'}`}
          subtitle="Total Spending"
          icon={<FiCreditCard className="text-primary-500" />}
          trend={walletInfo?.spendingTrend || 0}
        />
        <DashboardCard 
          title="This Month"
          value={`$${walletInfo?.monthlyIncome?.toFixed(2) || '0.00'}`}
          subtitle="Total Income"
          icon={<FiArrowDown className="text-green-500" />}
          trend={walletInfo?.incomeTrend || 0}
          trendIsPositive={true}
        />
        <DashboardCard 
          title="Savings Goal"
          value={`${walletInfo?.savingsPercentage || 0}%`}
          subtitle="Monthly Target"
          icon={<FiActivity className="text-blue-500" />}
          progress={walletInfo?.savingsPercentage || 0}
        />
      </div>
      
      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          <Link 
            to="/transactions" 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View All
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => (
                <TransactionItem key={transaction._id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;