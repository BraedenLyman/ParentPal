import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('../../firebase/firebaseAuth', () => ({
  auth: {},
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.log for cleaner test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe('AuthProvider', () => {
    test('provides initial loading state', () => {
      onAuthStateChanged.mockImplementation(() => jest.fn());

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.currentUser).toBe(null);
    });

    test('updates state when user logs in', async () => {
      const mockUser = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.currentUser).toEqual(mockUser);
    });

    test('updates state when user logs out', async () => {
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.currentUser).toBe(null);
    });

    test('handles auth state changes from logged in to logged out', async () => {
      const mockUser = {
        uid: 'test-uid-456',
        email: 'user@example.com',
      };

      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockUser);
      });

      // Simulate logout
      authCallback(null);

      await waitFor(() => {
        expect(result.current.currentUser).toBe(null);
      });
    });

    test('handles auth state changes from logged out to logged in', async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.currentUser).toBe(null);
        expect(result.current.loading).toBe(false);
      });

      // Simulate login
      const mockUser = {
        uid: 'new-user-789',
        email: 'newuser@example.com',
      };
      authCallback(mockUser);

      await waitFor(() => {
        expect(result.current.currentUser).toEqual(mockUser);
      });
    });

    test('logs appropriate message when user logs in', async () => {
      const mockUser = {
        uid: 'test-uid-999',
        email: 'logger@example.com',
      };

      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Auth state changed:',
          'User logged in'
        );
      });
    });

    test('logs appropriate message when user logs out', async () => {
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith(
          'Auth state changed:',
          'User logged out'
        );
      });
    });

    test('cleans up auth listener on unmount', () => {
      const mockUnsubscribe = jest.fn();
      onAuthStateChanged.mockReturnValue(mockUnsubscribe);

      const { unmount } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      expect(mockUnsubscribe).not.toHaveBeenCalled();

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    test('provides context value with correct structure', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'structure@example.com',
      };

      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current).toHaveProperty('currentUser');
        expect(result.current).toHaveProperty('loading');
      });

      expect(typeof result.current.loading).toBe('boolean');
    });
  });

  describe('useAuth Hook', () => {
    test('throws error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      try {
        renderHook(() => useAuth());
        // If we get here, the hook didn't throw, so fail the test
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('useAuth must be used within AuthProvider');
      }

      consoleErrorSpy.mockRestore();
    });

    test('returns context value when used within AuthProvider', async () => {
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current).toBeDefined();
        expect(result.current.currentUser).toBeDefined();
        expect(result.current.loading).toBeDefined();
      });
    });
  });

  describe('Multiple Subscribers', () => {
    test('handles multiple components subscribing to auth context', async () => {
      const mockUser = {
        uid: 'multi-sub-123',
        email: 'multi@example.com',
      };

      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return jest.fn();
      });

      const { result: result1 } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      const { result: result2 } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result1.current.currentUser).toEqual(mockUser);
        expect(result2.current.currentUser).toEqual(mockUser);
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles rapid auth state changes', async () => {
      let authCallback;
      onAuthStateChanged.mockImplementation((auth, callback) => {
        authCallback = callback;
        callback(null);
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Rapid changes
      const user1 = { uid: '1', email: 'user1@test.com' };
      const user2 = { uid: '2', email: 'user2@test.com' };

      authCallback(user1);
      authCallback(user2);
      authCallback(null);

      await waitFor(() => {
        expect(result.current.currentUser).toBe(null);
      });
    });

    test('handles user object with all Firebase user properties', async () => {
      const completeUser = {
        uid: 'complete-uid',
        email: 'complete@example.com',
        displayName: 'Complete User',
        photoURL: 'https://example.com/photo.jpg',
        emailVerified: true,
        phoneNumber: '+1234567890',
        metadata: {
          creationTime: '2024-01-01',
          lastSignInTime: '2024-01-15',
        },
      };

      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(completeUser);
        return jest.fn();
      });

      const { result } = renderHook(() => useAuth(), {
        wrapper: AuthProvider,
      });

      await waitFor(() => {
        expect(result.current.currentUser).toEqual(completeUser);
      });
    });
  });
});
