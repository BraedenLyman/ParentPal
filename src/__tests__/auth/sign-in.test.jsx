import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../../components/auth/sign-in/sign-in';
import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';

jest.mock('axios');
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(() => ({ name: 'mock-auth' })),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserSessionPersistence: 'SESSION',
}));

jest.mock('../../firebase/firebase', () => ({
  app: { name: 'mock-app' },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    console.error = jest.fn();
    console.log = jest.fn();
  });

  test('renders sign in form', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleButton = passwordInput.parentElement.querySelector('button[type="button"]');
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('signs in parent user successfully', async () => {
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
    };

    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    axios.post.mockResolvedValue({
      data: {
        user: { account_type: 'parent', account_id: 1 },
        babyData: [{ baby_id: 1, first_name: 'Baby' }],
      },
    });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'parent@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });

    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/sign-in'),
        { idToken: 'mock-id-token' },
        { withCredentials: true }
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        '/parent-dashboard',
        expect.objectContaining({
          state: { babyData: expect.any(Array) },
        })
      );
    });
  });

  test('signs in babysitter user successfully', async () => {
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
    };

    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    axios.post.mockResolvedValue({
      data: {
        user: { account_type: 'babysitter', account_id: 2 },
      },
    });

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'babysitter@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'Password123!' },
    });

    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/babysitter-dashboard');
    });
  });

  test('displays error on failed sign in', async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'wrongpass' },
    });

    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/)).toBeInTheDocument();
    });
  });

  test('has link to forgot password', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const forgotPasswordLink = screen.getByText(/Forgot Password?/);
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  test('has link to sign up', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const signUpLink = screen.getByText(/Create account/);
    expect(signUpLink).toBeInTheDocument();
  });
});
