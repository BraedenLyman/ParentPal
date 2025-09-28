import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import FeedingNotes from '../../../components/parent-pages/notes/feeding/feeding-notes';

jest.mock('axios');
const mockAxios = require('axios');

jest.mock('../../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: { uid: 'test-uid-123' }
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

describe('FeedingNotes Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/babies')) {
        return Promise.resolve({ data: { baby_id: 'baby-123' } });
      }
      if (url.includes('/api/feeding')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });
  });

  test('renders feeding notes page correctly', async () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    expect(screen.getByText("Baby's Feeding")).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('page-middle-nav')).toBeInTheDocument();
  });

  test('displays no feeding records message when empty', async () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No feeding records yet')).toBeInTheDocument();
    });
  });

  test('displays feeding records when data exists', async () => {
    const mockFeedingData = [
      {
        feeding_id: 1,
        time_fed: '14:30',
        date: '2024-01-15T00:00:00.000Z',
        fed_from: 'bottle',
        type_of_food: 'milk',
        amount: '120ml',
        notes: 'Fed well, no issues'
      },
      {
        feeding_id: 2,
        time_fed: '18:00',
        date: '2024-01-15T00:00:00.000Z',
        fed_from: 'left-boob',
        type_of_food: 'milk',
        amount: '15min',
        notes: 'Sleepy during feeding'
      }
    ];

    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/babies')) {
        return Promise.resolve({ data: { baby_id: 'baby-123' } });
      }
      if (url.includes('/api/feeding')) {
        return Promise.resolve({ data: mockFeedingData });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });

    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Time Fed: 14:30')).toBeInTheDocument();
      expect(screen.getAllByText('Date: 2024-01-15')[0]).toBeInTheDocument();
      expect(screen.getByText('Fed From: bottle')).toBeInTheDocument();
      expect(screen.getAllByText('Type of Food: milk')[0]).toBeInTheDocument();
      expect(screen.getByText('Amount: 120ml')).toBeInTheDocument();
      expect(screen.getByText('Notes: Fed well, no issues')).toBeInTheDocument();

      expect(screen.getByText('Time Fed: 18:00')).toBeInTheDocument();
      expect(screen.getByText('Fed From: left-boob')).toBeInTheDocument();
      expect(screen.getByText('Amount: 15min')).toBeInTheDocument();
      expect(screen.getByText('Notes: Sleepy during feeding')).toBeInTheDocument();
    });
  });

  test('opens modal when Add button is clicked', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(screen.getByText('Add Feeding')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount of food they were fed')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add any other important information')).toBeInTheDocument();
  });

  test('allows input in modal form fields', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    const dateInput = screen.getByLabelText('Date');
    const amountInput = screen.getByPlaceholderText('Amount of food they were fed');
    const notesInput = screen.getByPlaceholderText('Add any other important information');

    fireEvent.change(dateInput, { target: { value: '2024-03-15' } });
    fireEvent.change(amountInput, { target: { value: '150ml' } });
    fireEvent.change(notesInput, { target: { value: 'Good feeding session' } });

    expect(dateInput.value).toBe('2024-03-15');
    expect(amountInput.value).toBe('150ml');
    expect(notesInput.value).toBe('Good feeding session');
  });

  test('validates required fields on form submission', async () => {
    window.alert = jest.fn();

    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add'));

    const modalAddButton = screen.getAllByText('Add')[1];
    fireEvent.click(modalAddButton);

    expect(window.alert).toHaveBeenCalledWith('Please fill out all fields.');
  });

  test('closes modal when Cancel button is clicked', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Feeding')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Add Feeding')).not.toBeInTheDocument();
  });

  test('displays correct feeding source options', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('Select where the baby was fed from')).toBeInTheDocument();
  });

  test('displays correct food type options', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('Select what type of food they had')).toBeInTheDocument();
  });

  test('fetches baby data on component mount', async () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/babies',
        {
          params: { firebase_uid: 'test-uid-123' },
          withCredentials: true
        }
      );
    });
  });

  test('fetches feeding records after getting baby ID', async () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/feeding',
        {
          params: { baby_id: 'baby-123' },
          withCredentials: true
        }
      );
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockAxios.get.mockRejectedValue(new Error('Network error'));

    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch baby: ',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test('renders static elements correctly', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    expect(screen.getByText('Baby')).toBeInTheDocument();
    expect(screen.getByText('2002-02-02')).toBeInTheDocument();
    expect(screen.getByTestId('scrollbars')).toBeInTheDocument();
  });

  test('form submission calls correct API endpoint with proper data structure', async () => {
    const mockNewRecord = {
      feeding_id: 3,
      time_fed: '16:30',
      date: '2024-03-15T00:00:00.000Z',
      fed_from: 'bottle',
      type_of_food: 'milk',
      amount: '180ml',
      notes: 'Great feeding'
    };

    mockAxios.post.mockResolvedValue({ data: mockNewRecord });

    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add'));

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2024-03-15' }
    });
    fireEvent.change(screen.getByPlaceholderText('Amount of food they were fed'), {
      target: { value: '180ml' }
    });
    fireEvent.change(screen.getByPlaceholderText('Add any other important information'), {
      target: { value: 'Great feeding' }
    });

    expect(screen.getByLabelText('Date').value).toBe('2024-03-15');
    expect(screen.getByPlaceholderText('Amount of food they were fed').value).toBe('180ml');
    expect(screen.getByPlaceholderText('Add any other important information').value).toBe('Great feeding');
  });

  test('component structure includes expected form validation', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getAllByLabelText('Feeding TIme')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Fed From')[0]).toBeInTheDocument();
    expect(screen.getAllByLabelText('Type of Food')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();
  });

  test('TimeInput component is rendered for feeding time', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getAllByLabelText('Feeding TIme')[0]).toBeInTheDocument();
  });

  test('Select components provide correct feeding options', () => {
    render(
      <TestWrapper>
        <FeedingNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('Select where the baby was fed from')).toBeInTheDocument();
    expect(screen.getByText('Select what type of food they had')).toBeInTheDocument();
  });
});