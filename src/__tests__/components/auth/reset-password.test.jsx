import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '../../../components/auth/sign-in/forgot-password/reset-password';
import { verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  verifyPasswordResetCode: jest.fn(),
  confirmPasswordReset: jest.fn(),
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
  useSearchParams: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('ResetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useSearchParams.mockReturnValue([
      new URLSearchParams('?oobCode=test-code'),
    ]);
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders reset password page', async () => {
    verifyPasswordResetCode.mockResolvedValue('test@example.com');

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Resetting password for:/)).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  test('verifies reset code on mount', async () => {
    verifyPasswordResetCode.mockResolvedValue('test@example.com');

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(verifyPasswordResetCode).toHaveBeenCalledWith(expect.anything(), 'test-code');
    });
  });

  test('shows error for invalid reset code', async () => {
    verifyPasswordResetCode.mockRejectedValue(new Error('Invalid code'));

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Invalid or expired reset link.')).toBeInTheDocument();
    });
  });

  test('toggles password visibility', async () => {
    verifyPasswordResetCode.mockResolvedValue('test@example.com');

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    expect(newPasswordInput).toHaveAttribute('type', 'password');

    const toggleButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(toggleButtons[0]);

    expect(newPasswordInput).toHaveAttribute('type', 'text');
  });

  test('validates password requirements', async () => {
    verifyPasswordResetCode.mockResolvedValue('test@example.com');

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');

    fireEvent.change(newPasswordInput, { target: { value: 'abc' } });

    await waitFor(() => {
      const submitButton = screen.getByText('Reset Password');
      expect(submitButton).toBeDisabled();
    });
  });

  test('shows password mismatch error', async () => {
    verifyPasswordResetCode.mockResolvedValue('test@example.com');

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

    fireEvent.change(newPasswordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/)).toBeInTheDocument();
    });
  });

  test('resets password successfully', async () => {
    verifyPasswordResetCode.mockResolvedValue('test@example.com');
    confirmPasswordReset.mockResolvedValue();

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

    fireEvent.change(newPasswordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123!' } });

    const submitButton = screen.getByText('Reset Password');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(confirmPasswordReset).toHaveBeenCalledWith(
        expect.anything(),
        'test-code',
        'ValidPass123!'
      );
      expect(screen.getByText(/Password successfully reset!/)).toBeInTheDocument();
    });

    jest.runAllTimers();

    expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
  });

  test('shows error on failed password reset', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    verifyPasswordResetCode.mockResolvedValue('test@example.com');
    confirmPasswordReset.mockRejectedValue(new Error('Reset failed'));

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

    fireEvent.change(newPasswordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'ValidPass123!' } });

    const submitButton = screen.getByText('Reset Password');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to reset password. Please try again.')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test('has link back to sign in', async () => {
    verifyPasswordResetCode.mockResolvedValue('test@example.com');

    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const link = screen.getByText('Back to Sign In');
    expect(link).toBeInTheDocument();
  });
});
