import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';

const UV_BookingFlow: React.FC = () => {
  const [dates, setDates] = useState({ start_date: '', end_date: '' });
  const [guests, setGuests] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const selectedProperty = useAppStore(state => state.booking_state.selected_property);
  const { current_user, auth_token } = useAppStore(state => state.authentication_state);
  const { booking_details, payment_status } = useAppStore(state => state.booking_state);

  const { mutate: initiateBooking, isLoading, error } = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/bookings`,
        {
          property_id: selectedProperty?.property_id,
          user_id: current_user?.id,
          start_date: dates.start_date,
          end_date: dates.end_date,
          guests,
          total_price: totalPrice,
          is_paid: payment_status.is_paid
        },
        {
          headers: { Authorization: `Bearer ${auth_token}` }
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Booking Successful:', data);
      // Navigate to profile or show confirmation
    },
    onError: (err) => {
      console.error('Booking error:', err);
    }
  });

  const handleBooking = () => {
    initiateBooking();
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {selectedProperty && (
          <>
            <h1 className="text-3xl font-bold mb-6">Booking for {selectedProperty.name}</h1>
            <div className="bg-white shadow-md rounded-lg p-6 space-y-4 w-full max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input 
                    type="date" 
                    value={dates.start_date}
                    onChange={(e) => setDates(prev => ({ ...prev, start_date: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input 
                    type="date" 
                    value={dates.end_date}
                    onChange={(e) => setDates(prev => ({ ...prev, end_date: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Guests</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Price</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(Number(e.target.value))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md"
                  />
                </div>
              </div>
              {error && <div className="text-red-500 mt-2">{(error as any).message}</div>}

              <button 
                onClick={handleBooking} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Book Now'}
              </button>

              <Link to="/user/profile" className="text-blue-600 hover:text-blue-700 text-sm">
                Back to Profile
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UV_BookingFlow;