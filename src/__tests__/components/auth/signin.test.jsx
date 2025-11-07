import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import SignIn from '../../../components/auth/sign-in/sign-in';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

jest.mock('axios');
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));
jest.mock('../../../firebase/firebaseAuth', () => ({
  auth: {},
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  </BrowserRouter>
);

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders welcome message', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });

    test('renders ParentPal logo', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const logo = screen.getByAltText('Parent Pal Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/images/ParentPal.png');
    });

    test('renders form inputs and button', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    test('renders navigation links', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
      expect(screen.getByText('Create account')).toBeInTheDocument();
    });

    test('email and password inputs have required attribute', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('User Input', () => {
    test('allows user input in email field', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    test('allows user input in password field', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

      expect(passwordInput.value).toBe('mypassword');
    });

    test('toggles password visibility when eye icon is clicked', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      expect(passwordInput).toHaveAttribute('type', 'password');

      const toggleButton = passwordInput.parentElement.querySelector('button[type="button"]');
      fireEvent.click(toggleButton);

      expect(passwordInput).toHaveAttribute('type', 'text');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission - Parent User', () => {
    test('successfully logs in parent user and navigates to parent dashboard', async () => {
      const mockUser = {
        uid: 'test-uid-123',
        getIdToken: jest.fn().mockResolvedValue('mock-id-token')
      };

      const mockBabyData = [
        { baby_id: 'baby-1', name: 'Test Baby' }
      ];

      signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      });

      axios.post.mockResolvedValue({
        data: {
          user: {
            account_id: 'parent-123',
            account_type: 'parent',
            email: 'parent@test.com'
          },
          babyData: mockBabyData
        }
      });

      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'parent@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          {},
          'parent@test.com',
          'password123'
        );
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/sign-in',
          { idToken: 'mock-id-token' },
          { withCredentials: true }
        );
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          '/parent-dashboard',
          { state: { babyData: mockBabyData } }
        );
      });
    });

    test('successfully logs in babysitter user and navigates to babysitter dashboard', async () => {
      const mockUser = {
        uid: 'test-uid-456',
        getIdToken: jest.fn().mockResolvedValue('mock-id-token-babysitter')
      };

      signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      });

      axios.post.mockResolvedValue({
        data: {
          user: {
            account_id: 'babysitter-123',
            account_type: 'babysitter',
            email: 'babysitter@test.com'
          },
          babyData: []
        }
      });

      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'babysitter@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password456' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/babysitter-dashboard');
      });
    });
  });

  describe('Error Handling', () => {
    test('displays error message when Firebase authentication fails', async () => {
      const errorMessage = 'Invalid email or password';
      signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    test('displays error message when backend API fails', async () => {
      const mockUser = {
        uid: 'test-uid-789',
        getIdToken: jest.fn().mockResolvedValue('mock-id-token')
      };

      signInWithEmailAndPassword.mockResolvedValue({
        user: mockUser
      });

      axios.post.mockRejectedValue(new Error('Server error'));

      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument();
      });
    });

    test('clears error message when retrying login', async () => {
      signInWithEmailAndPassword.mockRejectedValueOnce(new Error('First error'));

      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByText('First error')).toBeInTheDocument();
      });

      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('mock-token')
      };

      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: []
        }
      });

      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.queryByText('First error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    test('disables button and shows loading state during sign in', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('mock-token')
      };

      signInWithEmailAndPassword.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ user: mockUser }), 100))
      );

      axios.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({
          data: {
            user: { account_type: 'parent' },
            babyData: []
          }
        }), 100))
      );

      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText('Enter your email');
      const passwordInput = screen.getByPlaceholderText('Enter your password');
      const loginButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.click(loginButton);

      expect(loginButton).toBeDisabled();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      }, { timeout: 3000 });
    });
  });

  describe('Navigation Links', () => {
    test('forgot password link has correct path', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const forgotPasswordLink = screen.getByText('Forgot Password?').closest('a');
      expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    });

    test('create account link has correct path', () => {
      render(
        <TestWrapper>
          <SignIn />
        </TestWrapper>
      );

      const createAccountLink = screen.getByText('Create account').closest('a');
      expect(createAccountLink).toHaveAttribute('href', '/create-account');
    });
  });
});