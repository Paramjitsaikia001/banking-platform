// src/components/transactions/TransactionItem.jsx
import { Link } from 'react-router-dom';
import { 
  FiArrowUp, 
  FiArrowDown, 
  FiCreditCard, 
  FiDollarSign, 
  FiShoppingBag,
  FiRefreshCw
} from 'react-icons/fi';

const TransactionItem = ({ transaction }) => {
  // Transaction types and their corresponding icons and colors
  const transactionConfig = {
    deposit: {
      icon: <FiArrowDown />,
      color: 'text-green-500 bg-green-100',
      label: 'Deposit'
    },
    withdrawal: {
      icon: <FiArrowUp />,
      color: 'text-red-500 bg-red-100',
      label: 'Withdrawal'
    },
    transfer: {
      icon: <FiRefreshCw />,
      color: 'text-blue-500 bg-blue-100',
      label: 'Transfer'
    },
    payment: {
      icon: <FiCreditCard />,
      color: 'text-orange-500 bg-orange-100',
      label: 'Payment'
    },
    billPayment: {
      icon: <FiDollarSign />,
      color: 'text-purple-500 bg-purple-100',
      label: 'Bill Payment'
    },
    purchase: {
      icon: <FiShoppingBag />,
      color: 'text-gray-500 bg-gray-100',
      label: 'Purchase'
    }
  };

  const config = transactionConfig[transaction.type] || transactionConfig.purchase;
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  return (
    <Link to={`/transaction/${transaction._id}`} className="block hover:bg-gray-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <div className={`rounded-full p-2 mr-3 ${config.color}`}>
            {config.icon}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {transaction.description || config.label}
            </h4>
            <p className="text-xs text-gray-500">
              {formatDate(transaction.createdAt)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <span className={`text-sm font-medium ${
            transaction.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
          }`}>
            {transaction.type === 'deposit' ? '+' : ''}${transaction.amount.toFixed(2)}
          </span>
          
          {transaction.status && (
            <p className="text-xs mt-0.5">
              <span className={`inline-block px-2 py-0.5 rounded-full ${
                transaction.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : transaction.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TransactionItem;