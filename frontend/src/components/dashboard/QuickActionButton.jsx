// src/components/dashboard/QuickActionButton.jsx
import { Link } from 'react-router-dom';

const QuickActionButton = ({ icon, label, to, color = 'bg-primary-100 text-primary-600' }) => {
  return (
    <Link 
      to={to} 
      className="flex flex-col items-center justify-center rounded-xl p-3 transition-all hover:shadow-md"
    >
      <div className={`rounded-full p-3 ${color} mb-2`}>
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </Link>
  );
};

export default QuickActionButton;