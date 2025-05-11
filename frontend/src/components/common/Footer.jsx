// src/components/common/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-semibold text-primary-600">
              BankApp
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Secure banking at your fingertips
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 items-center text-sm">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About Us
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact Us
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} BankApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;