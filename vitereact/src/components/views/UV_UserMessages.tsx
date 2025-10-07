import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';
import { Message } from '@/db/zodschemas'; // Adjust import path as necessary

const fetchMessages = async (userId: string) => {
  const response = await axios.get<Message[]>(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/users/${userId}/messages`);
  return response.data;
};

const sendMessage = async ({ senderId, recipientId, content }: { senderId: string, recipientId: string, content: string }) => {
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/messages`, { sender_id: senderId, recipient_id: recipientId, content });
  return response.data;
};

const UV_UserMessages: React.FC = () => {
  const currentUser = useAppStore(state => state.authentication_state.current_user);
  const queryClient = useQueryClient();

  const [selectedThread, setSelectedThread] = useState<Message | null>(null);
  const [newMessageContent, setNewMessageContent] = useState('');

  const { data: messageThreads, isLoading, error } = useQuery(['messages', currentUser?.id], () => fetchMessages(currentUser?.id || ''), {
    enabled: !!currentUser,
  });

  const mutation = useMutation(sendMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', currentUser?.id]);
      setNewMessageContent('');
    }
  });

  const handleSendMessage = () => {
    if (selectedThread && currentUser) {
      mutation.mutate({
        senderId: currentUser.id,
        recipientId: selectedThread.recipient_id,
        content: newMessageContent
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Messages</h1>
          
          {isLoading && <p>Loading messages...</p>}
          {error && <p className="text-red-500">{error.message}</p>}
          
          <div className="flex flex-col md:flex-row">
            {/* Message Threads List */}
            <aside className="w-full md:w-1/3 border-r border-gray-200">
              {messageThreads?.map(thread => (
                <div
                  key={thread.message_id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedThread?.message_id === thread.message_id ? 'bg-gray-200' : ''}`}
                >
                  <h2 className="text-lg font-semibold">{thread.content}</h2>
                  <p className="text-sm text-gray-500">{new Date(thread.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </aside>

            {/* Selected Thread View */}
            <section className="w-full md:w-2/3 p-4">
              {selectedThread ? (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold">Conversation with {selectedThread.recipient_id}</h2>
                  </div>
                  <div className="overflow-auto h-64 border-b border-gray-200 mb-4">
                    {/* Messages in the selected thread */}
                    <div className="space-y-2">
                      {messageThreads?.filter(msg => msg.recipient_id === selectedThread.recipient_id).map(msg => (
                        <div key={msg.message_id} className={`p-2 rounded-md ${msg.sender_id === currentUser?.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <p>{msg.content}</p>
                          <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Message Input */}
                  <div>
                    <textarea
                      value={newMessageContent}
                      onChange={(e) => setNewMessageContent(e.target.value)}
                      className="border-2 border-gray-200 p-2 rounded-md w-full mb-2"
                      placeholder="Type your message here..."
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      disabled={mutation.isLoading}
                    >
                      {mutation.isLoading ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </>
              ) : (
                <p>Select a conversation to view messages.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_UserMessages;