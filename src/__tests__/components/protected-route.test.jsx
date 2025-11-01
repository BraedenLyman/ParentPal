import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/protected-route';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext');

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    test('displays loading message when auth is loading', () => {
      useAuth.mockReturnValue({
        currentUser: null,
        loading: true,
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    test('loading component has correct styling', () => {
      useAuth.mockReturnValue({
        currentUser: null,
        loading: true,
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      const loadingDiv = screen.getByText('Loading...').parentElement;
      expect(loadingDiv).toHaveStyle({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
      });
    });
  });

  describe('Authentication States', () => {
    test('renders children when user is authenticated', () => {
      const mockUser = {
        uid: 'test-uid-123',
        email: 'user@test.com',
      };

      useAuth.mockReturnValue({
        currentUser: mockUser,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    test('redirects to sign-in when user is not authenticated', () => {
      useAuth.mockReturnValue({
        currentUser: null,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Sign In Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    test('does not render children when redirecting', () => {
      useAuth.mockReturnValue({
        currentUser: null,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Multiple Children', () => {
    test('renders multiple children when authenticated', () => {
      const mockUser = {
        uid: 'test-uid-456',
        email: 'multi@test.com',
      };

      useAuth.mockReturnValue({
        currentUser: mockUser,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <div>First Child</div>
          <div>Second Child</div>
          <div>Third Child</div>
        </ProtectedRoute>
      );

      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
      expect(screen.getByText('Third Child')).toBeInTheDocument();
    });
  });

  describe('State Transitions', () => {
    test('transitions from loading to authenticated', () => {
      const { rerender } = render(
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestChild />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      );

      // Initially loading
      useAuth.mockReturnValue({
        currentUser: null,
        loading: true,
      });

      rerender(
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestChild />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Then authenticated
      const mockUser = { uid: 'test-uid', email: 'test@test.com' };
      useAuth.mockReturnValue({
        currentUser: mockUser,
        loading: false,
      });

      rerender(
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestChild />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    test('transitions from loading to unauthenticated', () => {
      const { rerender } = render(
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestChild />
                </ProtectedRoute>
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </BrowserRouter>
      );

      // Initially loading
      useAuth.mockReturnValue({
        currentUser: null,
        loading: true,
      });

      rerender(
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestChild />
                </ProtectedRoute>
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </BrowserRouter>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Then unauthenticated
      useAuth.mockReturnValue({
        currentUser: null,
        loading: false,
      });

      rerender(
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestChild />
                </ProtectedRoute>
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </BrowserRouter>
      );

      expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined currentUser', () => {
      useAuth.mockReturnValue({
        currentUser: undefined,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    });

    test('handles user object with partial properties', () => {
      const partialUser = {
        uid: 'partial-uid',
        // Missing other properties
      };

      useAuth.mockReturnValue({
        currentUser: partialUser,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    test('handles complete user object with all Firebase properties', () => {
      const completeUser = {
        uid: 'complete-uid',
        email: 'complete@test.com',
        displayName: 'Complete User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
        phoneNumber: '+1234567890',
        metadata: {
          creationTime: '2024-01-01',
          lastSignInTime: '2024-01-15',
        },
      };

      useAuth.mockReturnValue({
        currentUser: completeUser,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('Complex Children', () => {
    test('renders complex nested components when authenticated', () => {
      const ComplexChild = () => (
        <div>
          <header>Header</header>
          <main>
            <div>Content</div>
          </main>
          <footer>Footer</footer>
        </div>
      );

      const mockUser = { uid: 'test-uid', email: 'test@test.com' };

      useAuth.mockReturnValue({
        currentUser: mockUser,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <ComplexChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    test('renders children with props when authenticated', () => {
      const ChildWithProps = ({ title, content }) => (
        <div>
          <h1>{title}</h1>
          <p>{content}</p>
        </div>
      );

      const mockUser = { uid: 'test-uid', email: 'test@test.com' };

      useAuth.mockReturnValue({
        currentUser: mockUser,
        loading: false,
      });

      renderWithRouter(
        <ProtectedRoute>
          <ChildWithProps title="Test Title" content="Test Content" />
        </ProtectedRoute>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Navigation Integration', () => {
    test('uses replace prop in Navigate to prevent back navigation', () => {
      useAuth.mockReturnValue({
        currentUser: null,
        loading: false,
      });

      // We can't directly test the replace prop, but we can ensure
      // the redirect happens correctly
      renderWithRouter(
        <ProtectedRoute>
          <TestChild />
        </ProtectedRoute>
      );

      expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    });

    test('redirects to correct sign-in path', () => {
      useAuth.mockReturnValue({
        currentUser: null,
        loading: false,
      });

      const { container } = render(
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <TestChild />
                </ProtectedRoute>
              }
            />
            <Route path="/sign-in" element={<SignInPage />} />
          </Routes>
        </BrowserRouter>
      );

      expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    });
  });
});
