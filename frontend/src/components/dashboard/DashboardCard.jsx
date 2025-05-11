// src/components/dashboard/DashboardCard.jsx
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const DashboardCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend = null, 
  trendIsPositive = false, 
  progress = null 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex justify-between mb-3">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="rounded-full p-1 bg-gray-100">
          {icon}
        </div>
      </div>
      
      <div className="mb-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      
      {trend !== null && (
        <div className="flex items-center text-xs">
          <span className={`p-1 rounded ${
            trendIsPositive 
              ? trend >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              : trend >= 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {trend >= 0 ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
          </span>
          <span className="ml-1 text-gray-600">
            {Math.abs(trend)}% {trendIsPositive 
              ? (trend >= 0 ? 'increase' : 'decrease') 
              : (trend >= 0 ? 'more spent' : 'less spent')
            } vs. last month
          </span>
        </div>
      )}
      
      {progress !== null && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0%</span>
            <span>Target: 100%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;