import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '@/store/main';
import ErrorBoundary from '@/components/ErrorBoundary';
import GV_TopNav from '@/components/views/GV_TopNav.tsx';
import GV_Footer from '@/components/views/GV_Footer.tsx';
import UV_LandingPage from '@/components/views/UV_LandingPage.tsx';
import UV_SearchResults from '@/components/views/UV_SearchResults.tsx';
import UV_PropertyDetails from '@/components/views/UV_PropertyDetails.tsx';
import UV_BookingFlow from '@/components/views/UV_BookingFlow.tsx';
import UV_UserProfile from '@/components/views/UV_UserProfile.tsx';
import UV_HostDashboard from '@/components/views/UV_HostDashboard.tsx';
import UV_LoginSignup from '@/components/views/UV_LoginSignup.tsx';
import UV_HelpCenter from '@/components/views/UV_HelpCenter.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Loading Spinner
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen" role="status" aria-label="Loading">
    <div className="loader ease-linear rounded-full border-t-4 border-b-4 border-gray-900 h-12 w-12" aria-hidden="true"></div>
    <span className="sr-only">Loading...</span>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAppStore(state => state.authentication_state.authentication_status.is_authenticated);
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login-signup" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const initializeAuth = useAppStore(state => state.initialize_auth);
  const isLoading = useAppStore(state => state.authentication_state.authentication_status.is_loading);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <QueryClientProvider client={queryClient}>
          <div className="flex flex-col min-h-screen">
            <ErrorBoundary>
              <GV_TopNav />
            </ErrorBoundary>
            <main className="flex-grow">
              <ErrorBoundary>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<UV_LandingPage />} />
                  <Route path="/auth/login-signup" element={<UV_LoginSignup />} />
                  <Route path="/search" element={<UV_SearchResults />} />
                  <Route path="/property/:property_id" element={<UV_PropertyDetails />} />
                  <Route path="/help-center" element={<UV_HelpCenter />} />

                  {/* Protected Routes */}
                  <Route path="/booking" element={
                    <ProtectedRoute>
                      <UV_BookingFlow />
                    </ProtectedRoute>
                  } />
                  <Route path="/user/profile" element={
                    <ProtectedRoute>
                      <UV_UserProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/host/dashboard" element={
                    <ProtectedRoute>
                      <UV_HostDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Catch all - redirect to landing page */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ErrorBoundary>
            </main>
            <ErrorBoundary>
              <GV_Footer />
            </ErrorBoundary>
          </div>
        </QueryClientProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;