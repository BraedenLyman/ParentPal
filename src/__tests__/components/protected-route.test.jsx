import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

const TestChild = () => <div>Protected Content</div>;
const SignInPage = () => <div>Sign In Page</div>;

const renderWithRouter = (children) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={children} />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {

  describe('Loading State', () => {
    test('displays loading message when auth is loading', () => {
      useAuth.mockImplementation(() => ({
        currentUser: null,
        loading: true,
      }));

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    test('loading component has correct styling', () => {
      useAuth.mockImplementation(() => ({
        currentUser: null,
        loading: true,
      }));

      const { container } = renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      const loadingText = screen.getByText('Loading...');
    
      expect(loadingText).toBeInTheDocument();
      expect(loadingText.parentElement).toBeTruthy();
      expect(loadingText.parentElement.tagName).toBe('DIV');
    });
  });

  describe('Authentication States', () => {
    test('renders children when user is authenticated', () => {
      const mockUser = {
        uid: 'test-uid-123',
        email: 'user@test.com',
      };

      useAuth.mockImplementation(() => ({
        currentUser: mockUser,
        loading: false,
      }));

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    test('redirects to sign-in when user is not authenticated', () => {
      useAuth.mockImplementation(() => ({
        currentUser: null,
        loading: false,
      }));

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Sign In Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    test('does not render children when redirecting', () => {
      useAuth.mockImplementation(() => ({
        currentUser: null,
        loading: false,
      }));

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined currentUser', () => {
      useAuth.mockImplementation(() => ({
        currentUser: undefined,
        loading: false,
      }));

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    });
  });
});
