import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We encountered an unexpected error. Please refresh the page or try again later.
              </p>
              {this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;