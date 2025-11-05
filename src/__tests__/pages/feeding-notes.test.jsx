import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import FeedingNotes from '../../components/pages/notes/feeding/feeding-notes';
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
const mockLocation = { pathname: '/feeding-notes', state: {} };

const mockUserData = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
};

const mockBabyData = [
  { baby_id: 1, first_name: 'Emma', last_name: 'Doe' },
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

describe('FeedingNotes Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
    console.error = jest.fn();
  });

  test('renders feeding notes page', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockFeedingRecords });

    render(
      <BrowserRouter>
        <FeedingNotes />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Feeding Notes')).toBeInTheDocument();
    });
  });

  test('fetches and displays feeding records', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockFeedingRecords });

    render(
      <BrowserRouter>
        <FeedingNotes />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/feeding'),
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
    axios.get.mockResolvedValue({ data: mockFeedingRecords });

    render(
      <BrowserRouter>
        <FeedingNotes />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Feeding Notes')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: '' });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');
  });

  test('opens add feeding entry modal', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockResolvedValue({ data: mockFeedingRecords });

    render(
      <BrowserRouter>
        <FeedingNotes />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Feeding Notes')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Add');
    const addButton = addButtons[0];
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add Feeding')).toBeInTheDocument();
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
        <FeedingNotes />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching dashboard data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('handles error when fetching feeding records', async () => {
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
        <FeedingNotes />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch feeding records: ', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
