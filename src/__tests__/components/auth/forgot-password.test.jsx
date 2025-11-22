import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from '../../../components/auth/sign-in/forgot-password/forgot-password';
import { sendPasswordResetEmail } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
  getAuth: jest.fn(() => ({ name: 'mock-auth' })),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserSessionPersistence: 'SESSION',
}));

jest.mock('../../../firebase/firebase', () => ({
  app: { name: 'mock-app' },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    console.error = jest.fn();
  });

  test('renders forgot password page', () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    expect(screen.getByText('Recover Password')).toBeInTheDocument();
    expect(screen.getByText('Enter your account email to recover password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByText('Send restore link')).toBeInTheDocument();
  });

  test('navigates back to sign-in on arrow click', () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const backButton = screen.getByRole('button', { name: '' });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
  });

  test('shows error when email is empty', async () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('Send restore link');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your email')).toBeInTheDocument();
    });
  });

  test('sends password reset email successfully', async () => {
    sendPasswordResetEmail.mockResolvedValue();

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByText('Send restore link');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalled();
      expect(screen.getByText('Password reset email sent! Check your inbox.')).toBeInTheDocument();
    });
  });

  test('shows error on failed password reset', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    sendPasswordResetEmail.mockRejectedValue(new Error('Invalid email'));

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });

    const submitButton = screen.getByText('Send restore link');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send reset email. Please check the address.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('shows loading state during submission', async () => {
    sendPasswordResetEmail.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByText('Send restore link');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton.closest('button')).toHaveAttribute('data-loading', 'true');
    });
  });
});
