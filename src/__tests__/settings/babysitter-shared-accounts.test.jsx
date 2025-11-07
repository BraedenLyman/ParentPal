import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BabysitterSharedAccounts from '../../components/pages/settings/babysitter-shared-accounts';
import axios from 'axios';
import { auth } from '../../firebase/firebaseAuth';

jest.mock('axios');
jest.mock('../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock('../../components/pages/nav-bar/navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

const mockUserData = {
  account_id: 10,
  account_type: 'babysitter',
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
};

const mockSharedAccounts = [
  {
    sharing_id: 1,
    parent_id: 1,
    parent_name: 'John Doe',
    parent_email: 'john@example.com',
    status: 'accepted',
    shared_at: '2024-01-15T10:00:00Z',
  },
  {
    sharing_id: 2,
    parent_id: 2,
    parent_name: 'Mary Smith',
    parent_email: 'mary@example.com',
    status: 'pending',
    shared_at: '2024-01-20T10:00:00Z',
  },
];

describe('BabysitterSharedAccounts Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    console.error = jest.fn();
  });

  describe('Rendering', () => {
    test('renders shared accounts page', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { parents: mockSharedAccounts },
      });

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Accounts')).toBeInTheDocument();
      });
    });

    test('displays navbar', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { parents: [] },
      });

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches user data on mount', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { parents: mockSharedAccounts },
      });

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { idToken: 'mock-token' },
          { withCredentials: true }
        );
      });
    });

    test('fetches shared parents list', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { parents: mockSharedAccounts },
      });

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Accounts')).toBeInTheDocument();
      });

      expect(axios.get).toHaveBeenCalled();
    });

    test('handles error when fetching data', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('handles error when fetching parents', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockRejectedValue(new Error('Failed to fetch parents'));

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Parent Accounts Display', () => {
    test('renders component with parent accounts', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { parents: mockSharedAccounts },
      });

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Accounts')).toBeInTheDocument();
      });

      expect(axios.post).toHaveBeenCalled();
    });

    test('renders with parent data', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { parents: mockSharedAccounts },
      });

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Accounts')).toBeInTheDocument();
      });

      expect(axios.get).toHaveBeenCalled();
    });

    test('displays page title', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { parents: mockSharedAccounts },
      });

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Accounts')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    test('handles empty parents list', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { parents: [] },
      });

      render(
        <BrowserRouter>
          <BabysitterSharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Accounts')).toBeInTheDocument();
      });
    });
  });
});
