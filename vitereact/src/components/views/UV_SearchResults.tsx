import React from 'react';
import { useAppStore } from '@/store/main';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { propertySchema, Property } from '@/schemas';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const fetchProperties = async (searchCriteria: any): Promise<Property[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/properties`,
    { params: searchCriteria }
  );
  const validatedData = z.array(propertySchema).parse(response.data);
  return validatedData;
};

const UV_SearchResults: React.FC = () => {
  const searchCriteria = useAppStore(state => state.search_criteria);

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['properties', searchCriteria],
    queryFn: () => fetchProperties(searchCriteria),
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Available Accommodations</h1>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-t-4 border-b-4 border-gray-900 h-12 w-12"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p>Unable to load properties. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties && properties.map(property => (
              <div key={property.property_id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={(property.images as any)?.urls?.[0] ?? "https://via.placeholder.com/400x300?text=No+Image"}
                  alt={property.name}
                  className="w-full h-32 sm:h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">{property.name}</h2>
                  <p className="text-sm text-gray-600">{property.location}</p>
                  <p className="mt-2 text-gray-800"><strong>${property.price}</strong> / night</p>
                  <Link
                    to={`/property/${property.property_id}`}
                    className="mt-4 block text-blue-600 hover:text-blue-800"
                  >
                    See Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UV_SearchResults;