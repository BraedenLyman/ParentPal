import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BabysitterDashboard from '../../components/pages/dashboard/babysitter-dashboard';
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
  useLocation: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/babysitter-dashboard' };

const mockBabysitterUser = {
  account_id: 2,
  account_type: 'babysitter',
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
};

const mockChildren = [
  {
    baby_id: 1,
    first_name: 'Emma',
    last_name: 'Doe',
    date_of_birth: '2023-01-15',
    parent_id: 1,
  },
  {
    baby_id: 2,
    first_name: 'Noah',
    last_name: 'Doe',
    date_of_birth: '2022-06-20',
    parent_id: 1,
  },
];

describe('BabysitterDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
    console.log = jest.fn();
  });

  describe('Rendering', () => {
    test('shows loading state initially', () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockImplementation(() => new Promise(() => {}));

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });

    test('renders dashboard with children data', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({
        data: { children: mockChildren },
      });

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Jane,')).toBeInTheDocument();
        expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      });
    });

    test('renders dashboard without children', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({
        data: { children: [] },
      });

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'No children found - babysitter has no verified access'
        );
      });

      consoleSpy.mockRestore();
    });

    test('renders avatar with user initial', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({
        data: { children: mockChildren },
      });

      const { container } = render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        const avatar = container.querySelector('.avatar');
        expect(avatar).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches user data and children on mount', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({
        data: { children: mockChildren },
      });

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(auth.currentUser.getIdToken).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { idToken: 'mock-token' },
          { withCredentials: true }
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/babysitter-sharing/children/2'),
          { withCredentials: true }
        );
      });
    });

    test('redirects to sign-in when no current user', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
    });

    test('redirects to sign-in on 401 error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue({
        response: { status: 401 },
      });

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Authentication error, redirecting to sign-in'
        );
        expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
      });

      consoleSpy.mockRestore();
    });

    test('redirects to sign-in on 403 error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue({
        response: { status: 403 },
      });

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Authentication error, redirecting to sign-in'
        );
        expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
      });

      consoleSpy.mockRestore();
    });

    test('handles non-auth errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue({
        response: { status: 500 },
      });

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Data fetch error, but user is still authenticated'
        );
      });

      consoleSpy.mockRestore();
    });

    test('handles network errors', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Data fetch error, but user is still authenticated'
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Default Values', () => {
    test('shows default name when user has no first name', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      const userWithoutName = { ...mockBabysitterUser, first_name: null };
      axios.post.mockResolvedValue({
        data: { user: userWithoutName },
      });
      axios.get.mockResolvedValue({
        data: { children: mockChildren },
      });

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Babysitter,')).toBeInTheDocument();
      });
    });

    test('shows default avatar when user has no first name', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      const userWithoutName = { ...mockBabysitterUser, first_name: null };
      axios.post.mockResolvedValue({
        data: { user: userWithoutName },
      });
      axios.get.mockResolvedValue({
        data: { children: [] },
      });

      const { container } = render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        const avatar = container.querySelector('.avatar');
        expect(avatar).toBeInTheDocument();
      });
    });
  });

  describe('Child Selection', () => {
    test('selects first child by default', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockBabysitterUser },
      });
      axios.get.mockResolvedValue({
        data: { children: mockChildren },
      });

      render(
        <BrowserRouter>
          <BabysitterDashboard />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Jane,')).toBeInTheDocument();
      });

      expect(axios.get).toHaveBeenCalled();
    });
  });
});
