import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const GV_Footer: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    console.log('Changing language to:', newLanguage);
  };

  const changeCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
    console.log('Changing currency to:', newCurrency);
  };

  return (
    <>
      <footer className="bg-gray-100 text-gray-700 py-8 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Legal and Policy Links */}
          <div>
            <h4 className="font-bold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms-of-service" className="hover:text-blue-600">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="font-bold mb-3">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="hover:text-blue-600">Help Center</Link></li>
              <li><Link to="/contact-us" className="hover:text-blue-600">Contact Us</Link></li>
            </ul>
          </div>
          
          {/* Language Selection */}
          <div>
            <h4 className="font-bold mb-3">Language</h4>
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              {/* More languages */}
            </select>
          </div>
          
          {/* Currency Selection */}
          <div>
            <h4 className="font-bold mb-3">Currency</h4>
            <select
              value={currency}
              onChange={(e) => changeCurrency(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="JPY">JPY</option>
              {/* More currencies */}
            </select>
          </div>
        </div>
      </footer>
    </>
  );
};

export default GV_Footer;