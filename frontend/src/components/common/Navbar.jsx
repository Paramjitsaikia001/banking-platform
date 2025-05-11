// src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiCreditCard, 
  FiDollarSign, 
  FiUser, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiBell 
} from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiHome /> },
    { name: 'Wallet', href: '/wallet', icon: <FiCreditCard /> },
    { name: 'Payments', href: '/pay-bills', icon: <FiDollarSign /> },
    { name: 'Profile', href: '/profile', icon: <FiUser /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">BankApp</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {currentUser && (
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive(item.href)
                      ? 'border-primary-500 text-primary-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {/* User Menu & Mobile Menu Button */}
          <div className="flex items-center">
            {currentUser ? (
              <>
                {/* Notification Icon */}
                <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                  <FiBell size={20} />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {/* User Menu */}
                <div className="ml-4 relative flex-shrink-0">
                  <div className="flex items-center">
                    <div 
                      className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700"
                      onClick={() => navigate('/profile')}
                    >
                      {currentUser.displayName?.charAt(0) || 'U'}
                    </div>
                  </div>
                </div>

                {/* Logout Button (Desktop) */}
                <button
                  onClick={handleLogout}
                  className="hidden md:flex ml-6 items-center text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <FiLogOut className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-white p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && currentUser && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-b-lg">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Logout Button (Mobile) */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;