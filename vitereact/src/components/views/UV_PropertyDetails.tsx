import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Property, propertySchema } from '@/zodschemas';
import { z } from 'zod';

const UV_PropertyDetails: React.FC = () => {
  const { property_id } = useParams<{ property_id: string }>();

  const {
    data: propertyDetails,
    error,
    isLoading,
  } = useQuery<Property>(
    ['propertyDetails', property_id],
    async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/properties/${property_id}`
      );
      return propertySchema.parse(response.data);
    },
    {
      enabled: !!property_id, // Ensure property_id is defined before trying to fetch data
      staleTime: 60000,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="loader ease-linear rounded-full border-t-4 border-b-4 border-gray-900 h-12 w-12"></div>
          </div>
        ) : error ? (
          <div className="text-red-600 text-center">
            <p>Error loading property details: {error.message}</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900">{propertyDetails.name}</h1>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="overflow-hidden rounded-lg">
                {propertyDetails.images ? (
                  <img
                    src={propertyDetails.images.main}
                    alt={`Image of ${propertyDetails.name}`}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500 text-center">No image available</div>
                )}
              </div>

              {/* Property Details */}
              <div>
                <p className="text-lg text-gray-700">{propertyDetails.description}</p>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900">Amenities</h3>
                  <ul className="list-disc list-inside mt-3 text-gray-700">
                    {propertyDetails.amenities?.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    )) || (
                      <li>No amenities listed</li>
                    )}
                  </ul>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900">Price</h3>
                  <p className="text-lg text-gray-700">${propertyDetails.price.toFixed(2)} per night</p>
                </div>
                <Link
                  to={`/booking?property_id=${propertyDetails.property_id}`}
                  className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UV_PropertyDetails;