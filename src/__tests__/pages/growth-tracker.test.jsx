import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GrowthTracker from '../../components/pages/growth/growth-tracker';
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
const mockLocation = { pathname: '/growth-tracker', state: {} };

const mockUserData = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
};

const mockBabyData = [
  { baby_id: 1, first_name: 'Emma', last_name: 'Doe' },
];

const mockGrowthRecords = [
  {
    growth_id: 1,
    baby_id: 1,
    weight: 7.5,
    height: 55,
    date_recorded: '2024-01-15',
  },
];

describe('GrowthTracker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
    console.error = jest.fn();
  });

  test('renders growth tracker page', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockGrowthRecords });

    render(
      <BrowserRouter>
        <GrowthTracker />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Growth Tracker')).toBeInTheDocument();
    });
  });

  test('fetches and displays growth records', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockGrowthRecords });

    render(
      <BrowserRouter>
        <GrowthTracker />
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
    });
  });

  test('navigates back to parent dashboard', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockGrowthRecords });

    render(
      <BrowserRouter>
        <GrowthTracker />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Growth Tracker')).toBeInTheDocument();
    });

    const backButton = document.querySelector('.back-button-header');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');
  });

  test('opens add growth modal', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockGrowthRecords });

    render(
      <BrowserRouter>
        <GrowthTracker />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Growth Tracker')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Add Growth')).toBeInTheDocument();
    });
  });

  test('validates required fields when adding growth', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockGrowthRecords });

    render(
      <BrowserRouter>
        <GrowthTracker />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Growth Tracker')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Add Growth')).toBeInTheDocument();
    });

    const submitButton = screen.getAllByText('Add')[1];
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill out all fields.')).toBeInTheDocument();
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
        <GrowthTracker />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching dashboard data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('handles error when fetching growth records', async () => {
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
        <GrowthTracker />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch growth records: ', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('uses baby from location state if provided', async () => {
    const locationWithBaby = {
      pathname: '/growth-tracker',
      state: { baby: mockBabyData[0] },
    };
    require('react-router-dom').useLocation.mockReturnValue(locationWithBaby);

    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockGrowthRecords });

    render(
      <BrowserRouter>
        <GrowthTracker />
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

  test('does not fetch records when no baby is selected', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: [] },
    });

    render(
      <BrowserRouter>
        <GrowthTracker />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(axios.get).not.toHaveBeenCalled();
  });
});
