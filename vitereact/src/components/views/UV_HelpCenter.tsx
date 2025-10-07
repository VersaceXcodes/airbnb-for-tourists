import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const UV_HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const mutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/support/submit`, { query });
      return response.data;
    },
    onSuccess: () => {
      setSuccessMessage('Your query was submitted successfully!');
      setSearchQuery('');
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to submit your query');
    },
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    mutation.mutate(searchQuery);
  }, [searchQuery, mutation]);

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header and Navigation */}
        <nav className="bg-gray-800 p-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-white text-2xl">Help Center</h1>
            <div>
              <Link to="/" className="text-gray-300 hover:text-white mx-2">Home</Link>
              <Link to="/search" className="text-gray-300 hover:text-white mx-2">Search</Link>
              <Link to="/user/profile" className="text-gray-300 hover:text-white mx-2">Profile</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-6">
          <section className="bg-gray-100 rounded-lg p-8 shadow-lg space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Need Assistance? We're Here to Help!</h2>
            
            {/* Search FAQs */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {errorMessage && (
                <div aria-live="polite" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
              {successMessage && (
                <div aria-live="polite" className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                  <p className="text-sm">{successMessage}</p>
                </div>
              )}
              <input
                type="text"
                placeholder="Search FAQs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-xl focus:outline-none transition-all duration-200"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Submitting...' : 'Submit Your Query'}
              </button>
            </form>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 p-4 text-center text-gray-400">
          <p>&copy; 2023 Airbnb for Tourists. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default UV_HelpCenter;