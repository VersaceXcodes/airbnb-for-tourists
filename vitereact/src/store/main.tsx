import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { logError } from '@/utils/errorHandler';

// User Interface
interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

// Global State Interfaces
interface AuthenticationState {
  current_user: User | null;
  auth_token: string | null;
  authentication_status: {
    is_authenticated: boolean;
    is_loading: boolean;
  };
  error_message: string | null;
}

interface SearchCriteriaState {
  location: string;
  price_min: number;
  price_max: number;
  dates: {
    start_date: string;
    end_date: string;
  };
  accommodation_type: string;
  amenities: string[];
}

interface BookingState {
  selected_property: {
    property_id: string;
    name: string;
    price: number;
  } | null;
  booking_details: any;
  payment_status: {
    is_paid: boolean;
  };
}

interface AppState {
  authentication_state: AuthenticationState;
  search_criteria: SearchCriteriaState;
  booking_state: BookingState;

  // Authentication Actions
  login_user: (email: string, password: string) => Promise<void>;
  logout_user: () => void;
  register_user: (email: string, password: string, name: string) => Promise<void>;
  initialize_auth: () => Promise<void>;
  clear_auth_error: () => void;

  // Search Criteria Actions
  set_search_criteria: (criteria: Partial<SearchCriteriaState>) => void;
}

// The Global Store
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial authentication state
      authentication_state: {
        current_user: null,
        auth_token: null,
        authentication_status: {
          is_authenticated: false,
          is_loading: true,
        },
        error_message: null,
      },

      // Initial search criteria state
      search_criteria: {
        location: '',
        price_min: 0,
        price_max: 10000,
        dates: { start_date: '', end_date: '' },
        accommodation_type: '',
        amenities: [],
      },

      // Initial booking state
      booking_state: {
        selected_property: null,
        booking_details: null,
        payment_status: {
          is_paid: false,
        },
      },

      // Authentication Actions
      login_user: async (email, password) => {
        set(() => ({
          authentication_state: {
            ...get().authentication_state,
            authentication_status: {
              ...get().authentication_state.authentication_status,
              is_loading: true,
            },
            error_message: null,
          },
        }));

        try {
          const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://123airbnb-for-tourists.launchpulse.ai';
          const response = await axios.post(
            `${baseURL}/api/auth/login`,
            { email, password },
            { 
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000 // 10 second timeout
            }
          );

          const { user, token } = response.data;

          set(() => ({
            authentication_state: {
              current_user: user,
              auth_token: token,
              authentication_status: {
                is_authenticated: true,
                is_loading: false,
              },
              error_message: null,
            },
          }));
        } catch (error: any) {
          logError(error, 'Login');
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';

          set(() => ({
            authentication_state: {
              current_user: null,
              auth_token: null,
              authentication_status: {
                is_authenticated: false,
                is_loading: false,
              },
              error_message: errorMessage,
            },
          }));
          throw new Error(errorMessage);
        }
      },

      register_user: async (email, password, name) => {
        try {
          set(() => ({
            authentication_state: {
              ...get().authentication_state,
              authentication_status: {
                ...get().authentication_state.authentication_status,
                is_loading: true,
              },
              error_message: null,
            },
          }));

          const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://123airbnb-for-tourists.launchpulse.ai';
          const response = await axios.post(
            `${baseURL}/api/auth/register`,
            { email, password, name },
            { 
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000 // 10 second timeout
            }
          );

          const { user, token } = response.data;

          set(() => ({
            authentication_state: {
              current_user: user,
              auth_token: token,
              authentication_status: {
                is_authenticated: true,
                is_loading: false,
              },
              error_message: null,
            },
          }));
        } catch (error: any) {
          logError(error, 'Registration');
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';

          set(() => ({
            authentication_state: {
              current_user: null,
              auth_token: null,
              authentication_status: {
                is_authenticated: false,
                is_loading: false,
              },
              error_message: errorMessage,
            },
          }));
          throw new Error(errorMessage);
        }
      },

      initialize_auth: async () => {
        const { authentication_state } = get();
        const token = authentication_state.auth_token;

        if (!token) {
          set(() => ({
            authentication_state: {
              ...get().authentication_state,
              authentication_status: {
                ...get().authentication_state.authentication_status,
                is_loading: false,
              },
              error_message: null,
            },
          }));
          return;
        }

        try {
          const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://123airbnb-for-tourists.launchpulse.ai';
          const response = await axios.get(
            `${baseURL}/api/auth/verify`,
            { 
              headers: { Authorization: `Bearer ${token}` },
              timeout: 10000 // 10 second timeout
            }
          );

          const { user } = response.data;

          set(() => ({
            authentication_state: {
              current_user: user,
              auth_token: token,
              authentication_status: {
                is_authenticated: true,
                is_loading: false,
              },
              error_message: null,
            },
          }));
        } catch (error: any) {
          logError(error, 'Auth verification');
          set(() => ({
            authentication_state: {
              current_user: null,
              auth_token: null,
              authentication_status: {
                is_authenticated: false,
                is_loading: false,
              },
              error_message: null,
            },
          }));
        }
      },

      logout_user: () => {
        set(() => ({
          authentication_state: {
            current_user: null,
            auth_token: null,
            authentication_status: {
              is_authenticated: false,
              is_loading: false,
            },
            error_message: null,
          },
        }));
      },

      clear_auth_error: () => {
        set(() => ({
          authentication_state: {
            ...get().authentication_state,
            error_message: null,
          },
        }));
      },

      set_search_criteria: (criteria) => {
        set(() => ({
          search_criteria: {
            ...get().search_criteria,
            ...criteria,
          },
        }));
      },
    }),
    {
      name: 'app-store-storage',
      partialize: (state) => ({
        authentication_state: {
          current_user: state.authentication_state.current_user,
          auth_token: state.authentication_state.auth_token,
          authentication_status: {
            is_authenticated: state.authentication_state.authentication_status.is_authenticated,
            is_loading: false,
          },
          error_message: null,
        },
        search_criteria: state.search_criteria,
      }),
    }
  )
);