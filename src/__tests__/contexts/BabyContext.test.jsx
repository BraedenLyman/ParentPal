import { renderHook, waitFor } from '@testing-library/react';
import { BabyProvider, useBabyContext } from '../../contexts/BabyContext';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: null,
  },
}));

const { auth } = require('../../firebase/firebaseAuth');

describe('BabyContext', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    auth.currentUser = null;
  });

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
    }
  });

  describe('BabyProvider - No User', () => {
    test('handles no current user gracefully', async () => {
      auth.currentUser = null;

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userData).toBe(null);
      expect(result.current.babies).toEqual([]);
      expect(result.current.selectedBaby).toBe(null);
    });
  });

  describe('BabyProvider - Parent User', () => {
    test('fetches and sets parent user data and babies on mount', async () => {
      const mockUser = {
        uid: 'parent-uid-123',
        getIdToken: jest.fn().mockResolvedValue('parent-token'),
      };

      const mockParentData = {
        account_id: 'parent-123',
        account_type: 'parent',
        email: 'parent@test.com',
      };

      const mockBabyData = [
        { baby_id: 'baby-1', name: 'Baby One', date_of_birth: '2023-01-01' },
        { baby_id: 'baby-2', name: 'Baby Two', date_of_birth: '2023-06-15' },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockParentData,
          babyData: mockBabyData,
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userData).toEqual(mockParentData);
      expect(result.current.babies).toEqual(mockBabyData);
      expect(result.current.selectedBaby).toEqual(mockBabyData[0]);
      expect(result.current.isParent).toBe(true);
      expect(result.current.isBabysitter).toBe(false);
    });

    test('handles parent with no babies', async () => {
      const mockUser = {
        uid: 'parent-no-babies',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockParentData = {
        account_id: 'parent-456',
        account_type: 'parent',
        email: 'nobabies@test.com',
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockParentData,
          babyData: [],
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.babies).toEqual([]);
      expect(result.current.selectedBaby).toBe(null);
    });

    test('handles parent with null babyData', async () => {
      const mockUser = {
        uid: 'parent-null-babies',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockParentData = {
        account_id: 'parent-789',
        account_type: 'parent',
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockParentData,
          babyData: null,
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.babies).toEqual([]);
      });
    });
  });

  describe('BabyProvider - Babysitter User', () => {
    test('fetches babysitter user and shared children', async () => {
      const mockUser = {
        uid: 'babysitter-uid-123',
        getIdToken: jest.fn().mockResolvedValue('babysitter-token'),
      };

      const mockBabysitterData = {
        account_id: 'babysitter-123',
        account_type: 'babysitter',
        email: 'babysitter@test.com',
      };

      const mockSharedChildren = [
        { baby_id: 'shared-baby-1', name: 'Shared Baby One' },
        { baby_id: 'shared-baby-2', name: 'Shared Baby Two' },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockBabysitterData,
          babyData: [],
        },
      });

      axios.get.mockResolvedValue({
        data: {
          children: mockSharedChildren,
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/babysitter-sharing/children/babysitter-123',
        { withCredentials: true }
      );

      expect(result.current.userData).toEqual(mockBabysitterData);
      expect(result.current.babies).toEqual(mockSharedChildren);
      expect(result.current.selectedBaby).toEqual(mockSharedChildren[0]);
      expect(result.current.isBabysitter).toBe(true);
      expect(result.current.isParent).toBe(false);
    });

    test('handles babysitter with no shared children', async () => {
      const mockUser = {
        uid: 'babysitter-no-children',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabysitterData = {
        account_id: 'babysitter-456',
        account_type: 'babysitter',
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockBabysitterData,
          babyData: [],
        },
      });

      axios.get.mockResolvedValue({
        data: {
          children: [],
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.babies).toEqual([]);
        expect(result.current.selectedBaby).toBe(null);
      });
    });

    test('handles babysitter with null children response', async () => {
      const mockUser = {
        uid: 'babysitter-null-children',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabysitterData = {
        account_id: 'babysitter-789',
        account_type: 'babysitter',
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockBabysitterData,
          babyData: [],
        },
      });

      axios.get.mockResolvedValue({
        data: {
          children: null,
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.babies).toEqual([]);
      });
    });
  });

  describe('setSelectedBaby', () => {
    test('allows changing selected baby', async () => {
      const mockUser = {
        uid: 'parent-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabyData = [
        { baby_id: 'baby-1', name: 'First Baby' },
        { baby_id: 'baby-2', name: 'Second Baby' },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: mockBabyData,
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.selectedBaby).toEqual(mockBabyData[0]);
      });

      // Change selected baby
      result.current.setSelectedBaby(mockBabyData[1]);

      await waitFor(() => {
        expect(result.current.selectedBaby).toEqual(mockBabyData[1]);
      });
    });
  });

  describe('refreshBabies', () => {
    test('refetches user and baby data when called', async () => {
      const mockUser = {
        uid: 'parent-refresh',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const initialBabyData = [
        { baby_id: 'baby-1', name: 'Original Baby' },
      ];

      const updatedBabyData = [
        { baby_id: 'baby-1', name: 'Original Baby' },
        { baby_id: 'baby-2', name: 'New Baby' },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValueOnce({
        data: {
          user: { account_type: 'parent' },
          babyData: initialBabyData,
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.babies).toEqual(initialBabyData);
      });

      // Mock updated data
      axios.post.mockResolvedValueOnce({
        data: {
          user: { account_type: 'parent' },
          babyData: updatedBabyData,
        },
      });

      // Call refresh
      result.current.refreshBabies();

      await waitFor(() => {
        expect(result.current.babies).toEqual(updatedBabyData);
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    test('handles API error gracefully', async () => {
      const mockUser = {
        uid: 'error-user',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching user and babies:',
        expect.any(Error)
      );
    });

    test('handles babysitter children fetch error', async () => {
      const mockUser = {
        uid: 'babysitter-error',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabysitterData = {
        account_id: 'babysitter-999',
        account_type: 'babysitter',
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockBabysitterData,
          babyData: [],
        },
      });

      axios.get.mockRejectedValue(new Error('Failed to fetch children'));

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching user and babies:',
        expect.any(Error)
      );
    });
  });

  describe('useBabyContext Hook', () => {
    test('throws error when used outside BabyProvider', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      try {
        renderHook(() => useBabyContext());
        // If we get here, the hook didn't throw, so fail the test
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toContain('useBabyContext must be used within BabyProvider');
      }

      consoleErrorSpy.mockRestore();
    });

    test('returns all expected context values', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent', account_id: '123' },
          babyData: [{ baby_id: '1', name: 'Test' }],
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current).toHaveProperty('userData');
        expect(result.current).toHaveProperty('babies');
        expect(result.current).toHaveProperty('selectedBaby');
        expect(result.current).toHaveProperty('setSelectedBaby');
        expect(result.current).toHaveProperty('loading');
        expect(result.current).toHaveProperty('refreshBabies');
        expect(result.current).toHaveProperty('isBabysitter');
        expect(result.current).toHaveProperty('isParent');
      });

      expect(typeof result.current.setSelectedBaby).toBe('function');
      expect(typeof result.current.refreshBabies).toBe('function');
      expect(typeof result.current.loading).toBe('boolean');
      expect(typeof result.current.isBabysitter).toBe('boolean');
      expect(typeof result.current.isParent).toBe('boolean');
    });
  });

  describe('Account Type Helpers', () => {
    test('isParent returns true for parent users', async () => {
      const mockUser = {
        uid: 'parent-type-test',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: [],
        },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.isParent).toBe(true);
        expect(result.current.isBabysitter).toBe(false);
      });
    });

    test('isBabysitter returns true for babysitter users', async () => {
      const mockUser = {
        uid: 'babysitter-type-test',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'babysitter', account_id: '123' },
          babyData: [],
        },
      });

      axios.get.mockResolvedValue({
        data: { children: [] },
      });

      const { result } = renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(result.current.isBabysitter).toBe(true);
        expect(result.current.isParent).toBe(false);
      });
    });
  });

  describe('API Call Verification', () => {
    test('calls sign-in API with correct parameters', async () => {
      const mockUser = {
        uid: 'api-test-user',
        getIdToken: jest.fn().mockResolvedValue('test-token-123'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: [],
        },
      });

      renderHook(() => useBabyContext(), {
        wrapper: BabyProvider,
      });

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/sign-in',
          { idToken: 'test-token-123' },
          { withCredentials: true }
        );
      });
    });
  });
});
