import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Reports from '../../components/pages/reports/Reports';
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

jest.mock('../../components/pages/reports/ReportsCharts', () => {
  return function MockReportsCharts() {
    return <div data-testid="reports-charts">Reports Charts</div>;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/reports', state: {} };

const mockUserData = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
};

const mockBabies = [
  { baby_id: 1, first_name: 'Emma', last_name: 'Doe' },
  { baby_id: 2, first_name: 'Noah', last_name: 'Doe' },
];

const mockGrowthRecords = [
  {
    growth_id: 1,
    baby_id: 1,
    weight: 7.5,
    height: 55,
    head_circumference: 40,
    date_recorded: '2024-01-15',
  },
];

const mockSleepRecords = [
  {
    sleep_id: 1,
    baby_id: 1,
    sleep_start: '2024-01-15T20:00:00Z',
    sleep_end: '2024-01-16T06:00:00Z',
    duration: 10,
  },
];

const mockFeedingRecords = [
  {
    feeding_id: 1,
    baby_id: 1,
    feeding_type: 'bottle',
    amount: 120,
    date_time: '2024-01-15T14:00:00Z',
  },
];

describe('Reports Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
    console.error = jest.fn();
  });

  describe('Rendering', () => {
    test('renders reports page structure', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });
      axios.get.mockImplementation(() => new Promise(() => {}));

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
    });

    test('renders reports page with data', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });

      axios.get
        .mockResolvedValueOnce({ data: mockGrowthRecords })
        .mockResolvedValueOnce({ data: mockSleepRecords })
        .mockResolvedValueOnce({ data: mockFeedingRecords });

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reports-charts')).toBeInTheDocument();
      });
    });

    test('renders with baby passed via location state', async () => {
      const locationWithBaby = {
        pathname: '/reports',
        state: { baby: mockBabies[0] },
      };
      require('react-router-dom').useLocation.mockReturnValue(locationWithBaby);

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });

      axios.get
        .mockResolvedValueOnce({ data: mockGrowthRecords })
        .mockResolvedValueOnce({ data: mockSleepRecords })
        .mockResolvedValueOnce({ data: mockFeedingRecords });

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reports-charts')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches user data and babies on mount', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });

      axios.get
        .mockResolvedValueOnce({ data: mockGrowthRecords })
        .mockResolvedValueOnce({ data: mockSleepRecords })
        .mockResolvedValueOnce({ data: mockFeedingRecords });

      render(
        <BrowserRouter>
          <Reports />
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

    test('fetches all records when baby is selected', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });

      axios.get
        .mockResolvedValueOnce({ data: mockGrowthRecords })
        .mockResolvedValueOnce({ data: mockSleepRecords })
        .mockResolvedValueOnce({ data: mockFeedingRecords });

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/growth'),
          expect.objectContaining({
            params: { baby_id: 1 },
            withCredentials: true,
          })
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/sleep'),
          expect.objectContaining({
            params: { baby_id: 1 },
            withCredentials: true,
          })
        );
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/feeding'),
          expect.objectContaining({
            params: { baby_id: 1 },
            withCredentials: true,
          })
        );
      });
    });

    test('handles error when fetching dashboard data', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error fetching dashboard data:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });

    test('handles error when fetching records', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });

      axios.get.mockRejectedValue(new Error('Failed to fetch records'));

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to fetch records: ',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });

    test('does not fetch records when no current user', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      expect(axios.post).not.toHaveBeenCalled();
    });

    test('does not fetch records when no baby is selected', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });
      
      expect(axios.get).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    test('navigates back to parent dashboard', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });

      axios.get
        .mockResolvedValueOnce({ data: mockGrowthRecords })
        .mockResolvedValueOnce({ data: mockSleepRecords })
        .mockResolvedValueOnce({ data: mockFeedingRecords });

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reports-charts')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: '' });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');
    });

    test('navigates back to babysitter dashboard when isBabysitter', async () => {
      const locationWithBabysitter = {
        pathname: '/reports',
        state: { isBabysitter: true },
      };
      require('react-router-dom').useLocation.mockReturnValue(locationWithBabysitter);

      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });

      axios.get
        .mockResolvedValueOnce({ data: mockGrowthRecords })
        .mockResolvedValueOnce({ data: mockSleepRecords })
        .mockResolvedValueOnce({ data: mockFeedingRecords });

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('reports-charts')).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: '' });
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/babysitter-dashboard');
    });
  });

  describe('Default Baby Selection', () => {
    test('selects first baby by default when no baby in state', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabies },
      });

      axios.get
        .mockResolvedValueOnce({ data: mockGrowthRecords })
        .mockResolvedValueOnce({ data: mockSleepRecords })
        .mockResolvedValueOnce({ data: mockFeedingRecords });

      render(
        <BrowserRouter>
          <Reports />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          expect.stringContaining('/api/growth'),
          expect.objectContaining({
            params: { baby_id: 1 },
          })
        );
      });
    });
  });
});
