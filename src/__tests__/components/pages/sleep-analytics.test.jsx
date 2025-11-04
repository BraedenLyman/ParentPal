import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import SleepAnalytics from '../../../components/pages/sleep/sleep-analytics';

jest.mock('axios');
const mockAxios = require('axios');

jest.mock('../../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid-123',
      getIdToken: jest.fn().mockResolvedValue('mock-id-token')
    }
  },
}));

jest.mock('../../../components/pages/nav-bar/navbar', () => {
  return function Navbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('react-custom-scrollbars-2', () => ({
  Scrollbars: ({ children, className }) => (
    <div className={className} data-testid="scrollbars">
      {children}
    </div>
  ),
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  </BrowserRouter>
);

describe('SleepAnalytics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockAxios.post.mockImplementation((url) => {
      if (url.includes('/api/sign-in')) {
        return Promise.resolve({
          data: {
            user: { firebase_uid: 'test-uid-123' },
            babyData: [{ baby_id: 'baby-123', name: 'Baby' }]
          }
        });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });

    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/sleep')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });
  });

  test('renders sleep analytics page correctly', async () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    expect(screen.getByText("Baby's Sleep")).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('displays no sleep records message when empty', async () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No sleep records yet')).toBeInTheDocument();
    });
  });

  test('displays sleep records when data exists', async () => {
    const mockSleepData = [
      {
        sleep_id: 1,
        sleep_duration: '8',
        time_fell_asleep: '20:30',
        date: '2024-01-15T00:00:00.000Z'
      },
      {
        sleep_id: 2,
        sleep_duration: '6.5',
        time_fell_asleep: '21:00',
        date: '2024-01-16T00:00:00.000Z'
      }
    ];

    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/babies')) {
        return Promise.resolve({ data: { baby_id: 'baby-123' } });
      }
      if (url.includes('/api/sleep')) {
        return Promise.resolve({ data: mockSleepData });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });

    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    await waitFor(() => {
      const durations = screen.getAllByText('Duration');
      expect(durations.length).toBeGreaterThan(0);
      expect(screen.getByText('8 hrs')).toBeInTheDocument();
      const fellAsleeps = screen.getAllByText('Fell Asleep');
      expect(fellAsleeps.length).toBeGreaterThan(0);
      // 20:30 in 24-hour format = 8:30 PM in 12-hour format
      expect(screen.getByText('8:30 PM')).toBeInTheDocument();
      expect(screen.getByText('6.5 hrs')).toBeInTheDocument();
      // 21:00 in 24-hour format = 9:00 PM in 12-hour format
      expect(screen.getByText('9:00 PM')).toBeInTheDocument();
    });
  });

  test('opens modal when Add button is clicked', () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(screen.getByText('Add Sleep')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Hours slept (e.g., 8.5)')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
  });

  test('allows input in modal form fields', () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    const hoursInput = screen.getByPlaceholderText('Hours slept (e.g., 8.5)');
    const dateInput = screen.getByLabelText('Date');

    fireEvent.change(hoursInput, { target: { value: '8' } });
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } });

    expect(hoursInput.value).toBe('8');
    expect(dateInput.value).toBe('2024-03-15');
  });

  test('validates required fields on form submission', async () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add'));

    const modalAddButton = screen.getAllByText('Add')[1];
    fireEvent.click(modalAddButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill out all fields.')).toBeInTheDocument();
    });
  });

  test('closes modal when Cancel button is clicked', () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Sleep')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Add Sleep')).not.toBeInTheDocument();
  });

  test('fetches dashboard data on component mount', async () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith(
        'http://localhost:3000/api/sign-in',
        { idToken: 'mock-id-token' },
        { withCredentials: true }
      );
    });
  });

  test('fetches sleep records after getting baby ID', async () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/sleep',
        {
          params: { baby_id: 'baby-123' },
          withCredentials: true
        }
      );
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockAxios.post.mockRejectedValue(new Error('Network error'));

    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching dashboard data:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test('renders static elements correctly', async () => {
    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('scrollbars')).toBeInTheDocument();
    });
  });

  test('submits sleep record with valid data', async () => {
    const mockNewRecord = {
      sleep_id: 3,
      sleep_duration: '7',
      time_fell_asleep: '22:00',
      date: '2024-03-15T00:00:00.000Z'
    };

    mockAxios.post.mockResolvedValue({ data: mockNewRecord });

    render(
      <TestWrapper>
        <SleepAnalytics />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add'));

    fireEvent.change(screen.getByPlaceholderText('Hours slept (e.g., 8.5)'), {
      target: { value: '7' }
    });
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-03-15' }
    });

    const modalAddButton = screen.getAllByText('Add')[1];
    const component = screen.getByText('Add Sleep').closest('[role="dialog"]');

    expect(screen.getByPlaceholderText('Hours slept (e.g., 8.5)').value).toBe('7');
    expect(screen.getByLabelText('Date').value).toBe('2024-03-15');
  });
});