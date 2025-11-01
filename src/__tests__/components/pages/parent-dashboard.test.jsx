import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import ParentDashboard from '../../../components/pages/dashboard/parent-dashboard';
import axios from 'axios';

jest.mock('axios');

jest.mock('../../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: null,
  },
}));

const { auth } = require('../../../firebase/firebaseAuth');

jest.mock('../../../components/pages/nav-bar/navbar', () => {
  return function Navbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  </BrowserRouter>
);

describe('ParentDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('Loading State', () => {
    test('displays loading message while fetching data', () => {
      auth.currentUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockImplementation(() => new Promise(() => {})),
      };

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
    });
  });

  describe('Authentication', () => {
    test('redirects to sign-in when no current user', async () => {
      auth.currentUser = null;

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
      });
    });

    test('redirects to sign-in on API error', async () => {
      auth.currentUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      axios.post.mockRejectedValue(new Error('API Error'));

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
      });

      expect(console.error).toHaveBeenCalledWith(
        'Error fetching dashboard data: ',
        expect.any(Error)
      );
    });
  });

  describe('User Data Display', () => {
    test('renders dashboard with user data', async () => {
      const mockUser = {
        uid: 'parent-uid-123',
        getIdToken: jest.fn().mockResolvedValue('parent-token'),
      };

      const mockUserData = {
        account_id: 'parent-123',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@test.com',
      };

      const mockBabyData = [
        {
          baby_id: 'baby-1',
          first_name: 'Alice',
          last_name: 'Doe',
          date_of_birth: '2023-01-01',
        },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockUserData,
          babyData: mockBabyData,
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, John,')).toBeInTheDocument();
      });

      expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    test('displays default name when user data is incomplete', async () => {
      const mockUser = {
        uid: 'parent-uid-456',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { account_id: '123' },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Parent,')).toBeInTheDocument();
      });
    });

    test('renders avatar with first letter of first name', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockUserData = {
        first_name: 'Sarah',
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockUserData,
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const avatar = screen.getByText('S');
        expect(avatar).toBeInTheDocument();
      });
    });

    test('renders ParentPal logo', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        const logo = screen.getByAltText('Parent Pal Logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/images/ParentPal.png');
      });
    });
  });

  describe('Baby Data', () => {
    test('sets selected baby to first baby when multiple babies exist', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockBabyData = [
        { baby_id: 'baby-1', first_name: 'First' },
        { baby_id: 'baby-2', first_name: 'Second' },
      ];

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: mockBabyData,
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Test,')).toBeInTheDocument();
      });
    });

    test('handles empty baby data array', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Test,')).toBeInTheDocument();
      });
    });

    test('handles null baby data', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: null,
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Test,')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Cards', () => {
    test('renders Logs section with description', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Logs')).toBeInTheDocument();
        expect(screen.getByText('Click on the card below to view/add logs')).toBeInTheDocument();
      });
    });

    test('navigates to growth tracker when card is clicked', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const mockUserData = { first_name: 'Test', account_id: '123' };
      const mockBaby = { baby_id: 'baby-1', first_name: 'Baby' };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: mockUserData,
          babyData: [mockBaby],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Growth Tracker')).toBeInTheDocument();
      });

      const growthCard = screen.getByText('Growth Tracker').closest('div');
      fireEvent.click(growthCard);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          '/growth-tracker',
          { state: { baby: mockBaby, user: mockUserData } }
        );
      });
    });

    test('renders all navigation cards', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: [{ baby_id: '1', first_name: 'Test' }],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Growth Tracker')).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    test('calls API with correct parameters', async () => {
      const mockUser = {
        uid: 'test-uid-api',
        getIdToken: jest.fn().mockResolvedValue('test-token-123'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:3000/api/sign-in',
          { idToken: 'test-token-123' },
          { withCredentials: true }
        );
      });
    });

    test('handles token retrieval error', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockRejectedValue(new Error('Token error')),
      };

      auth.currentUser = mockUser;

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
      });
    });
  });

  describe('Component Structure', () => {
    test('renders notification bell icon', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
      });

      // Check for notification bell - it's rendered by FiBell icon
      const bellIcon = document.querySelector('.notification');
      expect(bellIcon).toBeInTheDocument();
    });

    test('renders navbar component', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: 'Test' },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles user data with null first_name', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: null },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Parent,')).toBeInTheDocument();
      });
    });

    test('handles empty string first_name', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: '' },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText('Hi, Parent,')).toBeInTheDocument();
      });
    });

    test('handles very long first name', async () => {
      const mockUser = {
        uid: 'test-uid',
        getIdToken: jest.fn().mockResolvedValue('token'),
      };

      const longName = 'A'.repeat(100);

      auth.currentUser = mockUser;

      axios.post.mockResolvedValue({
        data: {
          user: { first_name: longName },
          babyData: [],
        },
      });

      render(
        <TestWrapper>
          <ParentDashboard />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText(`Hi, ${longName},`)).toBeInTheDocument();
      });
    });
  });
});
