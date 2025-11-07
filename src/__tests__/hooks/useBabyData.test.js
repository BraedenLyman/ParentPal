import { renderHook, waitFor } from '@testing-library/react';
import { useBabyData } from '../../hooks/useBabyData';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: null,
  },
}));

const { auth } = require('../../firebase/firebaseAuth');

describe('useBabyData Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    auth.currentUser = null;
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('No User', () => {
    test('handles no current user gracefully', async () => {
      auth.currentUser = null;

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userData).toBe(null);
      expect(result.current.babyData).toEqual([]);
      expect(result.current.selectedBaby).toBe(null);
      expect(result.current.isBabysitter).toBe(false);
    });
  });

  describe('Parent User', () => {
    test('fetches parent user data and babies', async () => {
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
        {
          baby_id: 'baby-1',
          first_name: 'Alice',
          last_name: 'Smith',
          date_of_birth: '2023-01-01'
        },
        {
          baby_id: 'baby-2',
          first_name: 'Bob',
          last_name: 'Smith',
          date_of_birth: '2023-06-15'
        },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockParentData,
          babyData: mockBabyData,
        },
      });

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userData).toEqual(mockParentData);
      expect(result.current.babyData).toEqual(mockBabyData);
      expect(result.current.selectedBaby).toEqual(mockBabyData[0]);
      expect(result.current.isBabysitter).toBe(false);

      expect(console.log).toHaveBeenCalledWith(
        'Using first baby from list:',
        'Alice'
      );
    });

    test('handles parent with no babies', async () => {
      const mockUser = {
        uid: 'parent-no-babies',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockParentData = {
        account_id: 'parent-456',
        account_type: 'parent',
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockParentData,
          babyData: [],
        },
      });

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.babyData).toEqual([]);
      expect(result.current.selectedBaby).toBe(null);

      expect(console.log).toHaveBeenCalledWith('No babies available');
    });

    test('handles parent with null babyData', async () => {
      const mockUser = {
        uid: 'parent-null-babies',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: null,
        },
      });

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.babyData).toEqual([]);
        expect(result.current.selectedBaby).toBe(null);
      });
    });
  });

  describe('Babysitter User', () => {
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
        {
          baby_id: 'shared-baby-1',
          first_name: 'Charlie',
          last_name: 'Jones',
        },
        {
          baby_id: 'shared-baby-2',
          first_name: 'Diana',
          last_name: 'Jones',
        },
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

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/babysitter-sharing/children/babysitter-123',
        { withCredentials: true }
      );

      expect(result.current.userData).toEqual(mockBabysitterData);
      expect(result.current.babyData).toEqual(mockSharedChildren);
      expect(result.current.selectedBaby).toEqual(mockSharedChildren[0]);
      expect(result.current.isBabysitter).toBe(true);

      expect(console.log).toHaveBeenCalledWith(
        'Fetching shared children for babysitter'
      );
      expect(console.log).toHaveBeenCalledWith(
        'Shared children found:',
        2
      );
      expect(console.log).toHaveBeenCalledWith(
        'Using first baby from list:',
        'Charlie'
      );
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

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.babyData).toEqual([]);
        expect(result.current.selectedBaby).toBe(null);
      });

      expect(console.log).toHaveBeenCalledWith('Shared children found:', 0);
      expect(console.log).toHaveBeenCalledWith('No babies available');
    });

    test('handles babysitter with null children response', async () => {
      const mockUser = {
        uid: 'babysitter-null-children',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'babysitter', account_id: '789' },
          babyData: [],
        },
      });

      axios.get.mockResolvedValue({
        data: {
          children: null,
        },
      });

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.babyData).toEqual([]);
      });

      expect(console.log).toHaveBeenCalledWith('Shared children found:', 0);
    });
  });

  describe('Location State', () => {
    test('uses baby from location state when provided', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabyData = [
        { baby_id: 'baby-1', first_name: 'First' },
        { baby_id: 'baby-2', first_name: 'Second' },
      ];

      const passedBaby = { baby_id: 'baby-2', first_name: 'Second' };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: mockBabyData,
        },
      });

      const { result } = renderHook(() =>
        useBabyData({ baby: passedBaby })
      );

      await waitFor(() => {
        expect(result.current.selectedBaby).toEqual(passedBaby);
      });

      expect(console.log).toHaveBeenCalledWith(
        'Using baby from navigation state:',
        'Second'
      );
    });

    test('ignores location state if no baby is passed', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabyData = [
        { baby_id: 'baby-1', first_name: 'First' },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: mockBabyData,
        },
      });

      const { result } = renderHook(() =>
        useBabyData({ otherData: 'something' })
      );

      await waitFor(() => {
        expect(result.current.selectedBaby).toEqual(mockBabyData[0]);
      });

      expect(console.log).toHaveBeenCalledWith(
        'Using first baby from list:',
        'First'
      );
    });

    test('refetches data when locationState changes', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabyData = [
        { baby_id: 'baby-1', first_name: 'First' },
        { baby_id: 'baby-2', first_name: 'Second' },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: mockBabyData,
        },
      });

      const { result, rerender } = renderHook(
        ({ locationState }) => useBabyData(locationState),
        {
          initialProps: { locationState: null },
        }
      );

      await waitFor(() => {
        expect(result.current.selectedBaby).toEqual(mockBabyData[0]);
      });

      rerender({
        locationState: { baby: mockBabyData[1] }
      });

      await waitFor(() => {
        expect(result.current.selectedBaby).toEqual(mockBabyData[1]);
      });

      expect(axios.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('setSelectedBaby', () => {
    test('allows changing selected baby', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabyData = [
        { baby_id: 'baby-1', first_name: 'First' },
        { baby_id: 'baby-2', first_name: 'Second' },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
          babyData: mockBabyData,
        },
      });

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.selectedBaby).toEqual(mockBabyData[0]);
      });

      result.current.setSelectedBaby(mockBabyData[1]);

      await waitFor(() => {
        expect(result.current.selectedBaby).toEqual(mockBabyData[1]);
      });
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

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching dashboard data:',
        expect.any(Error)
      );

      expect(result.current.userData).toBe(null);
      expect(result.current.babyData).toEqual([]);
    });

    test('handles babysitter children fetch error', async () => {
      const mockUser = {
        uid: 'babysitter-error',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'babysitter', account_id: '999' },
          babyData: [],
        },
      });

      axios.get.mockRejectedValue(new Error('Failed to fetch children'));

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching dashboard data:',
        expect.any(Error)
      );
    });

    test('handles getIdToken error', async () => {
      const mockUser = {
        uid: 'token-error-user',
        getIdToken: jest.fn().mockRejectedValue(new Error('Token error')),
      };

      auth.currentUser = mockUser;

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching dashboard data:',
        expect.any(Error)
      );
    });
  });

  describe('Return Value Structure', () => {
    test('returns all expected properties', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent', account_id: '123' },
          babyData: [{ baby_id: '1', first_name: 'Test' }],
        },
      });

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current).toHaveProperty('userData');
      expect(result.current).toHaveProperty('babyData');
      expect(result.current).toHaveProperty('selectedBaby');
      expect(result.current).toHaveProperty('setSelectedBaby');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('isBabysitter');

      expect(typeof result.current.setSelectedBaby).toBe('function');
      expect(typeof result.current.loading).toBe('boolean');
      expect(typeof result.current.isBabysitter).toBe('boolean');
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

      renderHook(() => useBabyData());

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/sign-in',
          { idToken: 'test-token-123' },
          { withCredentials: true }
        );
      });
    });
  });

  describe('Account Type Helper', () => {
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

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.isBabysitter).toBe(true);
      });
    });

    test('isBabysitter returns false for parent users', async () => {
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

      const { result } = renderHook(() => useBabyData());

      await waitFor(() => {
        expect(result.current.isBabysitter).toBe(false);
      });
    });
  });
});
