import React, { useState, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const GV_TopNav: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const isAuthenticated = useAppStore((state) => state.authentication_state.authentication_status.is_authenticated);
  const currentUser = useAppStore((state) => state.authentication_state.current_user);
  const setSearchCriteria = useAppStore((state) => state.set_search_criteria);
  const logoutUser = useAppStore((state) => state.logout_user);

  // Fetch notifications for authenticated users
  const fetchNotifications = async () => {
    if (!isAuthenticated) return [];
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${useAppStore.getState().authentication_state.auth_token}`,
      },
    });
    return response.data;
  };

  useQuery(['notifications'], fetchNotifications, {
    enabled: isAuthenticated,
    staleTime: 60000,
  });

  const handleSearch = async () => {
    setSearchCriteria({ location: searchQuery }); // Example state update
    // Redirect or handle search result display
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
            BrandLogo
          </Link>
          <div className="flex space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              Search
            </button>
            {isAuthenticated ? (
              <>
                <Link to="/user/profile" className="text-gray-700 hover:text-gray-900">
                  {currentUser?.name}
                </Link>
                <Link to="/notifications" className="text-gray-700 hover:text-gray-900">
                  Notifications
                </Link>
                <button onClick={logoutUser} className="text-red-600 hover:text-red-700">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login-signup" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/auth/login-signup" className="text-gray-700 hover:text-gray-900">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default GV_TopNav;