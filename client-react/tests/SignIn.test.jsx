import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthPage from '../src/pages/SignIn';
import { AuthContext } from '../src/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock global fetch
global.fetch = jest.fn();

describe('AuthPage (SignIn)', () => {
  const setUser = jest.fn();

  const setup = () => {
    render(
      <AuthContext.Provider value={{ setUser }}>
        <BrowserRouter>
          <AuthPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    fetch.mockClear();
    setUser.mockClear();
  });

  it('renders sign in and register forms', () => {
    setup();
    expect(screen.getByTestId('signin-email')).toBeInTheDocument();
    expect(screen.getByTestId('register-email')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument();
  });

  it('handles successful sign in as user', async () => {
    setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { email: 'user@example.com' },
      }),
    });

    fireEvent.change(screen.getByTestId('signin-email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByTestId('signin-password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByTestId('signin-button'));

    await waitFor(() => {
      expect(setUser).toHaveBeenCalledWith({ email: 'user@example.com' });
      expect(mockedNavigate).toHaveBeenCalledWith('/portfolio');
    });
  });

  it('shows error on failed sign in', async () => {
    setup();

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    fireEvent.change(screen.getByTestId('signin-email'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByTestId('signin-password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByTestId('signin-button'));

    const alerts = await screen.findAllByText('Invalid credentials');
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('handles successful registration', async () => {
    setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { email: 'new@example.com' },
      }),
    });

    window.alert = jest.fn();

    fireEvent.change(screen.getByTestId('register-email'), {
      target: { value: 'new@example.com' },
    });
    fireEvent.change(screen.getByTestId('register-firstname'), {
      target: { value: 'New' },
    });
    fireEvent.change(screen.getByTestId('register-lastname'), {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getByTestId('register-password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('register-phone'), {
      target: { value: '1234567890' },
    });

    fireEvent.click(screen.getByTestId('register-button'));

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Registration successful. Please sign in.');
    });
  });

  it('shows error on failed registration', async () => {
    setup();

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'User already exists' }),
    });

    window.alert = jest.fn();

    fireEvent.change(screen.getByTestId('register-email'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByTestId('register-firstname'), {
      target: { value: 'Existing' },
    });
    fireEvent.change(screen.getByTestId('register-lastname'), {
      target: { value: 'User' },
    });
    fireEvent.change(screen.getByTestId('register-password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByTestId('register-phone'), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByTestId('register-button'));

    const alerts = await screen.findAllByText('User already exists');
    expect(alerts.length).toBeGreaterThan(0);
  });
});
