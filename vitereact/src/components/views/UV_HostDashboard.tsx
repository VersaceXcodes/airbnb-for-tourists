import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAppStore } from '@/store/main';

// Interfaces for API responses
interface EarningsOverview {
  month: string;
  earnings: number;
}

interface CalendarData {
  date: string;
  available: boolean;
}

// Helper function to fetch earnings overview
const fetchEarningsOverview = async (host_id: string): Promise<EarningsOverview[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/hosts/${host_id}/earnings`);
  return response.data;
};

// Helper function to fetch calendar data
const fetchCalendarData = async (host_id: string): Promise<CalendarData[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/hosts/${host_id}/calendar`);
  return response.data;
};

const UV_HostDashboard: React.FC = () => {
  const host_id = useAppStore(state => state.authentication_state.current_user?.id);

  // Fetch data using React Query
  const { data: earningsOverview, isLoading: earningsLoading, isError: earningsError } = useQuery({
    queryKey: ['earningsOverview', host_id],
    queryFn: () => fetchEarningsOverview(host_id as string),
    enabled: Boolean(host_id), 
    staleTime: 60000, 
    refetchOnWindowFocus: false, 
    retry: 1
  });

  const { data: calendarData, isLoading: calendarLoading, isError: calendarError } = useQuery({
    queryKey: ['calendarData', host_id],
    queryFn: () => fetchCalendarData(host_id as string),
    enabled: Boolean(host_id), 
    staleTime: 60000, 
    refetchOnWindowFocus: false, 
    retry: 1
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Host Dashboard</h1>
          
          {/* Earnings Overview Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Earnings Overview</h2>
            {earningsLoading ? (
              <p>Loading earnings...</p>
            ) : earningsError ? (
              <p className="text-red-600">Failed to load earnings.</p>
            ) : earningsOverview?.length ? (
              <table className="min-w-full bg-white rounded-xl shadow-md">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-gray-700 text-left text-sm uppercase">Month</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-gray-700 text-left text-sm uppercase">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsOverview.map(({ month, earnings }) => (
                    <tr key={month}>
                      <td className="px-6 py-4 border-b border-gray-200">{month}</td>
                      <td className="px-6 py-4 border-b border-gray-200">${earnings.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No earnings data available.</p>
            )}
          </section>

          {/* Calendar Management Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calendar Management</h2>
            {calendarLoading ? (
              <p>Loading calendar...</p>
            ) : calendarError ? (
              <p className="text-red-600">Failed to load calendar data.</p>
            ) : calendarData?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calendarData.map(({ date, available }) => (
                  <div key={date} className={`p-4 rounded-lg shadow-md ${available ? 'bg-green-50' : 'bg-red-50'}`}>
                    <p className="text-gray-800">{date}</p>
                    <p className={`text-sm font-medium ${available ? 'text-green-600' : 'text-red-600'}`}>
                      {available ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No calendar data available.</p>
            )}
          </section>

          {/* Help Center Link */}
          <div className="flex justify-end">
            <Link to="/help-center" className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              Need Help?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_HostDashboard;