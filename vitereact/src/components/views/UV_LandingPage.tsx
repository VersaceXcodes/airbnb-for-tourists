import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { propertySchema } from '@/store/main';
import { z } from 'zod';

const fetchFeaturedListings = async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/properties?featured=true`
  );
  return z.array(propertySchema).parse(response.data);
};

const UV_LandingPage: React.FC = () => {
  const { data: featuredListings, isLoading, isError, error } = useQuery(
    'featuredListings',
    fetchFeaturedListings
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Welcome to Airbnb for Tourists</h1>
          <p className="mt-2 text-gray-600 text-xl">Find unique accommodations worldwide.</p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 space-y-6 mb-12">
          <form className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
            <input
              type="text"
              placeholder="Location"
              className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="date"
              className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <input
              type="date"
              className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Search
            </button>
          </form>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-6">
            Featured Listings
          </h2>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error loading featured listings: {error.message}</div>}
          {!isLoading && !isError && featuredListings && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((property) => (
                <div key={property.property_id} className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <img
                    src={property.images?.main || 'default-property-image.jpg'}
                    alt={property.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900">{property.name}</h3>
                    <p className="text-gray-600">{property.location}</p>
                    <p className="text-blue-600 font-semibold mt-2">${property.price}/night</p>
                    <Link
                      to={`/property/${property.property_id}`}
                      className="block mt-4 text-center text-white bg-blue-600 px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">How it Works</h2>
          <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-1 bg-white shadow-lg rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Step 1: Discover</h3>
              <p className="text-gray-600">
                Browse through a variety of listings to find the perfect stay.
              </p>
            </div>
            <div className="flex-1 bg-white shadow-lg rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Step 2: Book</h3>
              <p className="text-gray-600">
                Use our seamless booking system to reserve your spot.
              </p>
            </div>
            <div className="flex-1 bg-white shadow-lg rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Step 3: Experience</h3>
              <p className="text-gray-600">
                Enjoy your stay and leave a review!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UV_LandingPage;