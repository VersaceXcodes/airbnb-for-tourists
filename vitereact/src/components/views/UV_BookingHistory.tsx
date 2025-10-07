import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';

interface Booking {
  booking_id: string;
  property_name: string;
  start_date: string;
  end_date: string;
  total_price: number;
  is_paid: boolean;
  status: string;
}

const UV_BookingHistory: React.FC = () => {
  // Access authentication state from Zustand
  const user_id = useAppStore(state => state.authentication_state.current_user?.id);
  const auth_token = useAppStore(state => state.authentication_state.auth_token);

  // Fetching bookings
  const { data: bookingList = [], isLoading, refetch } = useQuery<Booking[]>({
    queryKey: ['bookingHistory', user_id],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${auth_token}`
        },
        params: { user_id }
      });
      return response.data.map((booking: any) => ({
        booking_id: booking.booking_id,
        property_name: booking.property.name,
        start_date: booking.start_date,
        end_date: booking.end_date,
        total_price: booking.total_price,
        is_paid: booking.is_paid,
        status: booking.is_paid ? 'Paid' : 'Unpaid',
      }));
    },
    enabled: !!user_id && !!auth_token, // Only fetch if user_id and auth_token are available
  });

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Booking History</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-t-4 border-b-4 border-gray-900 h-12 w-12"></div>
          </div>
        ) : (
          <>
            <button 
              onClick={() => refetch()} 
              className="bg-blue-600 text-white py-2 px-4 rounded shadow hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Refresh
            </button>
            <ul className="space-y-4 mt-6">
              {bookingList.length === 0 ? (
                <p className="text-gray-600">No bookings found.</p>
              ) : (
                bookingList.map(booking => (
                  <li key={booking.booking_id} className="bg-white shadow-lg rounded-lg p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold">{booking.property_name}</h2>
                      <p className="text-gray-600">From: {new Date(booking.start_date).toLocaleDateString()} To: {new Date(booking.end_date).toLocaleDateString()}</p>
                      <p className="text-gray-600">Total Price: ${booking.total_price.toFixed(2)}</p>
                      <p className={`font-semibold ${booking.is_paid ? 'text-green-600' : 'text-red-600'}`}>
                        Status: {booking.status}
                      </p>
                    </div>
                    <div>
                      <Link 
                        to={`/property/${booking.booking_id}`} 
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default UV_BookingHistory;