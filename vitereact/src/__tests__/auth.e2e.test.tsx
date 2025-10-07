import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import UV_LoginSignup from '@/components/views/UV_LoginSignup';
import { useAppStore } from '@/store/main';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('E2E Auth Flow (register -> logout -> sign-in)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    useAppStore.setState((state) => ({
      authentication_state: {
        ...state.authentication_state,
        auth_token: null,
        current_user: null,
        authentication_status: {
          is_authenticated: false,
          is_loading: false,
        },
        error_message: null,
      },
    }));
  });

  it('completes full auth flow: register -> logout -> sign-in', async () => {
    const user = userEvent.setup();
    const uniqueEmail = `user${Date.now()}@example.com`;
    const testPassword = 'testPassword123';
    const testName = 'Test User';

    render(<UV_LoginSignup />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    });

    const toggleButton = screen.getByRole('button', { name: /don't have an account\? sign up/i });
    await user.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const registerButton = screen.getByRole('button', { name: /create account/i });

    await user.type(nameInput, testName);
    await user.type(emailInput, uniqueEmail);
    await user.type(passwordInput, testPassword);

    await user.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/creating account\.\.\./i)).toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(
      () => {
        const state = useAppStore.getState();
        expect(state.authentication_state.authentication_status.is_authenticated).toBe(true);
        expect(state.authentication_state.auth_token).toBeTruthy();
        expect(state.authentication_state.current_user).toBeTruthy();
        expect(state.authentication_state.current_user?.email).toBe(uniqueEmail.toLowerCase().trim());
        expect(state.authentication_state.current_user?.name).toBe(testName.trim());
      },
      { timeout: 20000 }
    );

    const logoutUser = useAppStore.getState().logout_user;
    logoutUser();

    await waitFor(() => {
      const state = useAppStore.getState();
      expect(state.authentication_state.authentication_status.is_authenticated).toBe(false);
      expect(state.authentication_state.auth_token).toBeNull();
      expect(state.authentication_state.current_user).toBeNull();
    });

    cleanup();

    render(<UV_LoginSignup />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    });

    const signInEmailInput = screen.getByLabelText(/email address/i);
    const signInPasswordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /^sign in$/i });

    await user.type(signInEmailInput, uniqueEmail);
    await user.type(signInPasswordInput, testPassword);

    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText(/signing in\.\.\./i)).toBeInTheDocument();
    }, { timeout: 5000 });

    await waitFor(
      () => {
        const state = useAppStore.getState();
        expect(state.authentication_state.authentication_status.is_authenticated).toBe(true);
        expect(state.authentication_state.auth_token).toBeTruthy();
        expect(state.authentication_state.current_user).toBeTruthy();
        expect(state.authentication_state.current_user?.email).toBe(uniqueEmail.toLowerCase().trim());
      },
      { timeout: 20000 }
    );
  }, 60000);

  it('registers a new user successfully', async () => {
    const user = userEvent.setup();
    const uniqueEmail = `user${Date.now()}@example.com`;
    const testPassword = 'registerTest456';
    const testName = 'Register Test User';

    render(<UV_LoginSignup />, { wrapper: Wrapper });

    const toggleButton = screen.getByRole('button', { name: /don't have an account\? sign up/i });
    await user.click(toggleButton);

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const registerButton = screen.getByRole('button', { name: /create account/i });

    await user.type(nameInput, testName);
    await user.type(emailInput, uniqueEmail);
    await user.type(passwordInput, testPassword);

    await user.click(registerButton);

    await waitFor(
      () => {
        const state = useAppStore.getState();
        expect(state.authentication_state.authentication_status.is_authenticated).toBe(true);
        expect(state.authentication_state.auth_token).toBeTruthy();
        expect(state.authentication_state.current_user?.email).toBe(uniqueEmail.toLowerCase().trim());
        expect(state.authentication_state.current_user?.name).toBe(testName.trim());
      },
      { timeout: 20000 }
    );
  }, 30000);

  it('signs in with existing credentials', async () => {
    const user = userEvent.setup();
    const existingEmail = 'johndoe@example.com';
    const existingPassword = 'password123';

    render(<UV_LoginSignup />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signInButton = screen.getByRole('button', { name: /^sign in$/i });

    await user.type(emailInput, existingEmail);
    await user.type(passwordInput, existingPassword);

    await user.click(signInButton);

    await waitFor(
      () => {
        const state = useAppStore.getState();
        expect(state.authentication_state.authentication_status.is_authenticated).toBe(true);
        expect(state.authentication_state.auth_token).toBeTruthy();
        expect(state.authentication_state.current_user?.email).toBe(existingEmail);
      },
      { timeout: 20000 }
    );
  }, 30000);

  it('handles logout correctly', async () => {
    const state = useAppStore.getState();
    
    useAppStore.setState({
      authentication_state: {
        ...state.authentication_state,
        current_user: {
          id: 'test-user-id',
          email: 'test@example.com',
          name: 'Test User',
          created_at: new Date().toISOString(),
        },
        auth_token: 'test-token',
        authentication_status: {
          is_authenticated: true,
          is_loading: false,
        },
        error_message: null,
      },
    });

    const logoutUser = useAppStore.getState().logout_user;
    logoutUser();

    await waitFor(() => {
      const newState = useAppStore.getState();
      expect(newState.authentication_state.authentication_status.is_authenticated).toBe(false);
      expect(newState.authentication_state.auth_token).toBeNull();
      expect(newState.authentication_state.current_user).toBeNull();
      expect(newState.authentication_state.error_message).toBeNull();
    });
  });

  it('shows error for invalid login credentials', async () => {
    const user = userEvent.setup();
    const invalidEmail = 'nonexistent@example.com';
    const invalidPassword = 'wrongpassword';

    render(<UV_LoginSignup />, { wrapper: Wrapper });

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const signInButton = screen.getByRole('button', { name: /^sign in$/i });

    await user.type(emailInput, invalidEmail);
    await user.type(passwordInput, invalidPassword);

    await user.click(signInButton);

    await waitFor(
      () => {
        const state = useAppStore.getState();
        expect(state.authentication_state.error_message).toBeTruthy();
        expect(state.authentication_state.authentication_status.is_authenticated).toBe(false);
      },
      { timeout: 10000 }
    );
  }, 30000);

  it('shows error when registering with existing email', async () => {
    const user = userEvent.setup();
    const existingEmail = 'johndoe@example.com';
    const testPassword = 'testPassword123';
    const testName = 'Test User';

    render(<UV_LoginSignup />, { wrapper: Wrapper });

    const toggleButton = screen.getByRole('button', { name: /don't have an account\? sign up/i });
    await user.click(toggleButton);

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const registerButton = screen.getByRole('button', { name: /create account/i });

    await user.type(nameInput, testName);
    await user.type(emailInput, existingEmail);
    await user.type(passwordInput, testPassword);

    await user.click(registerButton);

    await waitFor(
      () => {
        const state = useAppStore.getState();
        expect(state.authentication_state.error_message).toBeTruthy();
        expect(state.authentication_state.authentication_status.is_authenticated).toBe(false);
      },
      { timeout: 10000 }
    );
  }, 30000);
});
