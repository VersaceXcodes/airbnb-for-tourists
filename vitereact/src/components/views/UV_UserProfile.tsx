import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { Link } from 'react-router-dom';

interface User {
  user_id: string;
  email: string;
  name: string;
  created_at: string;
}

interface Booking {
  booking_id: string;
  property_id: string;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
  is_paid: boolean;
}

const UV_UserProfile: React.FC = () => {
  const auth_token = useAppStore(state => state.authentication_state.auth_token);
  const current_user = useAppStore(state => state.authentication_state.current_user);

  const fetchUserProfile = async (): Promise<{ user: User; bookings: Booking[] }> => {
    const user_id = current_user?.id || '';
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/${user_id}`,
      { headers: { Authorization: `Bearer ${auth_token}` } }
    );
    return response.data;
  };

  const { data, isLoading, error } = useQuery(['userProfile', current_user?.id], fetchUserProfile, {
    enabled: !!current_user,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><div className="loader"></div></div>;
  }

  if (error || !data) {
    return <div className="text-center text-red-600">Failed to load your profile. Please try again later.</div>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <p className="text-gray-600"><strong>Name: </strong> {data.user.name}</p>
          <p className="text-gray-600"><strong>Email: </strong> {data.user.email}</p>
          <p className="text-gray-600"><strong>Member Since: </strong> {new Date(data.user.created_at).toLocaleDateString()}</p>
          <Link to="/settings" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all">
            Edit Profile
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking History</h2>
          {data.bookings.length === 0 ? (
            <p className="text-gray-600">No bookings yet.</p>
          ) : (
            <ul className="space-y-4">
              {data.bookings.map(booking => (
                <li key={booking.booking_id} className="border-b border-gray-200 pb-4">
                  <p className="text-gray-600"><strong>Property ID: </strong> {booking.property_id}</p>
                  <p className="text-gray-600"><strong>Dates: </strong> {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}</p>
                  <p className="text-gray-600"><strong>Guests: </strong> {booking.guests}</p>
                  <p className="text-gray-600"><strong>Total Price: </strong> ${booking.total_price.toFixed(2)}</p>
                  <p className={`text-sm ${booking.is_paid ? 'text-green-600' : 'text-red-600'}`}>
                    {booking.is_paid ? 'Paid' : 'Pending Payment'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default UV_UserProfile;