import React from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAppStore } from '@/store/main';
import { z } from 'zod';

const queryClientInstance = new QueryClient();

// Zod Schema for Notifications
const notificationSchema = z.object({
  message_id: z.string(),
  content: z.string(),
  timestamp: z.string(),
  is_read: z.boolean(),
});

type Notification = z.infer<typeof notificationSchema>;

const UV_Notifications: React.FC = () => {
  const userId = useAppStore(state => state.authentication_state.current_user?.id);
  const queryClient = useQueryClient();

  const fetchNotifications = async (): Promise<Notification[]> => {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/${userId}/notifications`);
    return notificationSchema.array().parse(response.data);
  };

  const markAsRead = useMutation({
    mutationFn: (notificationId: string) => {
      return axios.patch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/${userId}/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const { data: notifications, isError, isLoading } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: fetchNotifications,
    enabled: !!userId,
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center p-6">
                <div className="loader ease-linear rounded-full border-t-4 border-b-4 border-gray-900 h-12 w-12"></div>
              </div>
            ) : isError ? (
              <div className="p-6 text-red-600">Failed to load notifications. Please try again later.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {notifications?.map(notification => (
                  <li key={notification.message_id} className={`p-4 ${notification.is_read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                    <div className="flex justify-between">
                      <span className={notification.is_read ? 'text-gray-800' : 'font-semibold text-blue-800'}>
                        {notification.content}
                      </span>
                      {!notification.is_read && (
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => markAsRead.mutate(notification.message_id)}
                          aria-label="Mark as read"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <div className="text-gray-500 text-sm mt-2">{new Date(notification.timestamp).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const QueryWrapper: React.FC = () => (
  <QueryClientProvider client={queryClientInstance}>
    <UV_Notifications />
  </QueryClientProvider>
);

export default QueryWrapper;