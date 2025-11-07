import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SharedAccounts from '../../components/pages/settings/shared-accounts';
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

jest.mock('@heroui/react', () => ({
  ...jest.requireActual('@heroui/react'),
  useDisclosure: () => ({
    isOpen: false,
    onOpen: jest.fn(),
    onOpenChange: jest.fn(),
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

const mockUserData = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
};

const mockBabysitters = [
  {
    sharing_id: 1,
    babysitter_id: 10,
    babysitter_name: 'Jane Smith',
    babysitter_email: 'jane@example.com',
    is_verified: true,
    verified_at: '2024-01-15',
    created_at: '2024-01-10',
  },
  {
    sharing_id: 2,
    babysitter_id: 11,
    babysitter_name: 'Bob Johnson',
    babysitter_email: 'bob@example.com',
    is_verified: false,
    created_at: '2024-01-12',
  },
];

describe('SharedAccounts Component', () => {
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
        data: { babysitters: mockBabysitters },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
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
        data: { babysitters: [] },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
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
        data: { babysitters: mockBabysitters },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
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

    test('fetches babysitters list', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { babysitters: mockBabysitters },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/babysitter-sharing/babysitters/1'),
          { withCredentials: true }
        );
      });
    });

    test('handles error when fetching data', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <SharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('handles error when fetching babysitters', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockRejectedValue(new Error('Failed to fetch babysitters'));

      render(
        <BrowserRouter>
          <SharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    test('navigates back to settings', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { babysitters: [] },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Accounts')).toBeInTheDocument();
      });

      const backButton = document.querySelector('.back-button-header');
      if (backButton) {
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/settings');
      }
    });
  });

  describe('Babysitter Display', () => {
    test('displays babysitter list when available', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { babysitters: mockBabysitters },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    test('displays babysitter emails', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { babysitters: mockBabysitters },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      });
    });

    test('displays babysitter status', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { babysitters: mockBabysitters },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      const pendingStatus = screen.getAllByText(/pending/i);
      expect(pendingStatus.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    test('handles empty babysitters list', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      axios.get.mockResolvedValue({
        data: { babysitters: [] },
      });

      render(
        <BrowserRouter>
          <SharedAccounts />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Shared Accounts')).toBeInTheDocument();
      });
    });
  });
});
