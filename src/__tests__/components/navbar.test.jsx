import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/pages/nav-bar/navbar';
import axios from 'axios';
import { auth } from '../../firebase/firebaseAuth';

jest.mock('axios');
jest.mock('../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/parent-dashboard' };

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
  });

  describe('Rendering', () => {
    test('renders all navigation items for parent user', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Logs')).toBeInTheDocument();
        expect(screen.getByText('Tasks')).toBeInTheDocument();
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });
    });

    test('renders navigation items without Reports for babysitter', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'babysitter' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Logs')).toBeInTheDocument();
        expect(screen.getByText('Tasks')).toBeInTheDocument();
        expect(screen.queryByText('Reports')).not.toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
      });
    });

    test('renders without user when not authenticated', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Logs')).toBeInTheDocument();
      expect(screen.getByText('Tasks')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('User Type Fetching', () => {
    test('fetches user type on mount when user is authenticated', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(auth.currentUser.getIdToken).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { idToken: 'mock-token' },
          { withCredentials: true }
        );
      });
    });

    test('does not fetch user type when no current user', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(axios.post).not.toHaveBeenCalled();
    });

    test('handles error when fetching user type', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error fetching user type:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Navigation - Parent User', () => {
    beforeEach(async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });
    });

    test('navigates to parent dashboard when home is clicked', async () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      const homeButton = screen.getByText('Home').closest('.navSection');
      fireEvent.click(homeButton);

      expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');
    });

    test('navigates to growth tracker when logs is clicked', async () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      const logsButton = screen.getByText('Logs').closest('.navSection');
      fireEvent.click(logsButton);

      expect(mockNavigate).toHaveBeenCalledWith('/growth-tracker', {
        state: { isBabysitter: false },
      });
    });

    test('navigates to parent assigned tasks when tasks is clicked', async () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      const tasksButton = screen.getByText('Tasks').closest('.navSection');
      fireEvent.click(tasksButton);

      expect(mockNavigate).toHaveBeenCalledWith('/parent-assigned-tasks');
    });

    test('navigates to reports when reports is clicked', async () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      const reportsButton = screen.getByText('Reports').closest('.navSection');
      fireEvent.click(reportsButton);

      expect(mockNavigate).toHaveBeenCalledWith('/reports');
    });

    test('navigates to settings when settings is clicked', async () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      const settingsButton = screen.getByText('Settings').closest('.navSection');
      fireEvent.click(settingsButton);

      expect(mockNavigate).toHaveBeenCalledWith('/settings');
    });
  });

  describe('Navigation - Babysitter User', () => {
    beforeEach(async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'babysitter' },
        },
      });
    });

    test('navigates to babysitter dashboard when home is clicked', async () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      const homeButton = screen.getByText('Home').closest('.navSection');
      fireEvent.click(homeButton);

      expect(mockNavigate).toHaveBeenCalledWith('/babysitter-dashboard');
    });

    test('navigates to sleep analytics when logs is clicked', async () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      const logsButton = screen.getByText('Logs').closest('.navSection');
      fireEvent.click(logsButton);

      expect(mockNavigate).toHaveBeenCalledWith('/sleep-analytics', {
        state: { isBabysitter: true },
      });
    });

    test('navigates to assigned tasks when tasks is clicked', async () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      const tasksButton = screen.getByText('Tasks').closest('.navSection');
      fireEvent.click(tasksButton);

      expect(mockNavigate).toHaveBeenCalledWith('/assigned-tasks');
    });
  });

  describe('Active State Detection', () => {
    test('shows home as active when on parent dashboard', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/parent-dashboard',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const homeSection = screen.getByText('Home').closest('.navSection');
      expect(homeSection).toHaveClass('active');
    });

    test('shows home as active when on babysitter dashboard', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/babysitter-dashboard',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'babysitter' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const homeSection = screen.getByText('Home').closest('.navSection');
      expect(homeSection).toHaveClass('active');
    });

    test('shows settings as active when on settings page', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/settings',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const settingsSection = screen.getByText('Settings').closest('.navSection');
      expect(settingsSection).toHaveClass('active');
    });

    test('shows settings as active when on settings subpage', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/settings/personal-information',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const settingsSection = screen.getByText('Settings').closest('.navSection');
      expect(settingsSection).toHaveClass('active');
    });

    test('shows reports as active when on reports page for parent', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/reports',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const reportsSection = screen.getByText('Reports').closest('.navSection');
      expect(reportsSection).toHaveClass('active');
    });

    test('shows logs as active for parent on growth tracker', async () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/growth-tracker',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        const logsSection = screen.getByText('Logs').closest('.navSection');
        expect(logsSection).toHaveClass('active');
      });
    });

    test('shows logs as active for babysitter on sleep analytics', async () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/sleep-analytics',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'babysitter' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        const logsSection = screen.getByText('Logs').closest('.navSection');
        expect(logsSection).toHaveClass('active');
      });
    });

    test('shows tasks as active for parent on parent assigned tasks', async () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/parent-assigned-tasks',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        const tasksSection = screen.getByText('Tasks').closest('.navSection');
        expect(tasksSection).toHaveClass('active');
      });
    });

    test('shows tasks as active for babysitter on assigned tasks', async () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/assigned-tasks',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'babysitter' },
        },
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      await waitFor(() => {
        const tasksSection = screen.getByText('Tasks').closest('.navSection');
        expect(tasksSection).toHaveClass('active');
      });
    });
  });

  describe('Icon Rendering', () => {
    test('renders solid icon for active home section', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/parent-dashboard',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      const { container } = render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const homeSection = screen.getByText('Home').closest('.navSection');
      const icon = homeSection.querySelector('.nav-icon');
      expect(icon).toBeInTheDocument();
    });

    test('renders outline icon for inactive sections', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        pathname: '/parent-dashboard',
      });

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: {
          user: { account_type: 'parent' },
        },
      });

      const { container } = render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const settingsSection = screen.getByText('Settings').closest('.navSection');
      const icon = settingsSection.querySelector('.nav-icon');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Navigation without user type loaded', () => {
    test('allows navigation clicks before user type is fetched', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const homeButton = screen.getByText('Home').closest('.navSection');
      fireEvent.click(homeButton);

      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
