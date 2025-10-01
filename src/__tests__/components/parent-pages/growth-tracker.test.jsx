import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import GrowthTracker from '../../../components/parent-pages/growth/growth-tracker';

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

jest.mock('../../../components/page-components/page-middle-nav/page-middle-nav', () => {
  return function PageMiddleNav() {
    return <div data-testid="page-middle-nav">Page Middle Nav</div>;
  };
});

jest.mock('../../../components/nav-bar/navbar', () => {
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

describe('GrowthTracker Component', () => {
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
      if (url.includes('/api/growth')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });
  });

  test('renders growth tracker page correctly', async () => {
    render(
      <TestWrapper>
        <GrowthTracker />
      </TestWrapper>
    );

    expect(screen.getByText("Baby's Growth")).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('page-middle-nav')).toBeInTheDocument();
  });

  test('displays no growth records message when empty', async () => {
    render(
      <TestWrapper>
        <GrowthTracker />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No growth records yet')).toBeInTheDocument();
    });
  });

  test('displays growth records when data exists', async () => {
    const mockGrowthData = [
      {
        growth_id: 1,
        height: 50.5,
        weight: 3.2,
        date: '2024-01-15T00:00:00.000Z'
      },
      {
        growth_id: 2,
        height: 52.0,
        weight: 3.5,
        date: '2024-02-15T00:00:00.000Z'
      }
    ];

    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/babies')) {
        return Promise.resolve({ data: { baby_id: 'baby-123' } });
      }
      if (url.includes('/api/growth')) {
        return Promise.resolve({ data: mockGrowthData });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });

    render(
      <TestWrapper>
        <GrowthTracker />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Height: 50.5')).toBeInTheDocument();
      expect(screen.getByText('Weight: 3.2')).toBeInTheDocument();
      expect(screen.getByText('Date: 2024-01-15')).toBeInTheDocument();
      expect(screen.getByText('Height: 52')).toBeInTheDocument();
      expect(screen.getByText('Weight: 3.5')).toBeInTheDocument();
      expect(screen.getByText('Date: 2024-02-15')).toBeInTheDocument();
    });
  });

  test('fetches dashboard data on component mount', async () => {
    render(
      <TestWrapper>
        <GrowthTracker />
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

  test('fetches growth records after getting baby ID', async () => {
    render(
      <TestWrapper>
        <GrowthTracker />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/growth',
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
        <GrowthTracker />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching dashboard data: ',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test('renders static elements without interaction', async () => {
    render(
      <TestWrapper>
        <GrowthTracker />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });
  });

  test('component structure includes expected elements', () => {
    render(
      <TestWrapper>
        <GrowthTracker />
      </TestWrapper>
    );

    expect(screen.getByTestId('scrollbars')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('page-middle-nav')).toBeInTheDocument();
  });
});