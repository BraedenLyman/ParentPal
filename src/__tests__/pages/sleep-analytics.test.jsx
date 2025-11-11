import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SleepAnalytics from '../../components/pages/sleep/sleep-analytics';
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

jest.mock('react-custom-scrollbars-2', () => ({
  Scrollbars: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../components/custom-select/CustomSelect', () => {
  return function MockSelect({ options, value, onChange, placeholder }) {
    return (
      <select
        data-testid="custom-select"
        value={value?.value || ''}
        onChange={(e) => {
          const option = options.find(opt => opt.value === e.target.value);
          onChange(option || null);
        }}
        aria-label={placeholder}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLocation = { pathname: '/sleep-analytics', state: {} };

const mockUserData = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
};

const mockBabyData = [
  { baby_id: 1, first_name: 'Emma', last_name: 'Doe' },
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

describe('SleepAnalytics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
    console.error = jest.fn();
  });

  test('renders sleep analytics page', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockSleepRecords });

    render(
      <BrowserRouter>
        <SleepAnalytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sleep Analytics')).toBeInTheDocument();
    });
  });

  test('fetches and displays sleep records', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockSleepRecords });

    render(
      <BrowserRouter>
        <SleepAnalytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/sleep'),
        expect.objectContaining({
          params: { baby_id: 1 },
          withCredentials: true,
        })
      );
    });
  });

  test('navigates back to parent dashboard', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockSleepRecords });

    render(
      <BrowserRouter>
        <SleepAnalytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sleep Analytics')).toBeInTheDocument();
    });

    const backButton = document.querySelector('.back-button-header');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');
  });

  test('opens add sleep entry modal', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockSleepRecords });

    render(
      <BrowserRouter>
        <SleepAnalytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sleep Analytics')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Add');
    const addButton = addButtons[0];
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add Sleep')).toBeInTheDocument();
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
        <SleepAnalytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching dashboard data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('handles error when fetching sleep records', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockRejectedValue(new Error('Failed to fetch records'));

    render(
      <BrowserRouter>
        <SleepAnalytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch sleep records: ', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('uses baby from location state if provided', async () => {
    const locationWithBaby = {
      pathname: '/sleep-analytics',
      state: { baby: mockBabyData[0] },
    };
    require('react-router-dom').useLocation.mockReturnValue(locationWithBaby);

    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockSleepRecords });

    render(
      <BrowserRouter>
        <SleepAnalytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/sleep'),
        expect.objectContaining({
          params: { baby_id: 1 },
        })
      );
    });
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
        <SleepAnalytics />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(axios.get).not.toHaveBeenCalled();
  });
});
