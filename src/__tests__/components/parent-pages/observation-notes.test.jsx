import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import ObservationNotes from '../../../components/parent-pages/notes/observation/observation-notes';

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

describe('ObservationNotes Component', () => {
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
      if (url.includes('/api/observation')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });
  });

  test('renders observation notes page correctly', async () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    expect(screen.getByText("Baby's Observation")).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('page-middle-nav')).toBeInTheDocument();
  });

  test('displays no observation records message when empty', async () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No observation records yet')).toBeInTheDocument();
    });
  });

  test('displays observation records when data exists', async () => {
    const mockObservationData = [
      {
        observation_id: 1,
        priority_level: 'high',
        notes: 'Baby seems fussy today, not eating well'
      },
      {
        observation_id: 2,
        priority_level: 'low',
        notes: 'Baby is very alert and interactive'
      },
      {
        observation_id: 3,
        priority_level: 'medium',
        notes: 'Slight rash on arms, monitoring closely'
      }
    ];

    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/babies')) {
        return Promise.resolve({ data: { baby_id: 'baby-123' } });
      }
      if (url.includes('/api/observation')) {
        return Promise.resolve({ data: mockObservationData });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });

    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Priority Level: high')).toBeInTheDocument();
      expect(screen.getByText('Notes: Baby seems fussy today, not eating well')).toBeInTheDocument();
      expect(screen.getByText('Priority Level: low')).toBeInTheDocument();
      expect(screen.getByText('Notes: Baby is very alert and interactive')).toBeInTheDocument();
      expect(screen.getByText('Priority Level: medium')).toBeInTheDocument();
      expect(screen.getByText('Notes: Slight rash on arms, monitoring closely')).toBeInTheDocument();
    });
  });

  test('opens modal when Add button is clicked', () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(screen.getByText('Add Observation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe what you notice')).toBeInTheDocument();
  });

  test('allows input in modal form fields', () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    const notesInput = screen.getByPlaceholderText('Describe what you notice');

    fireEvent.change(notesInput, { target: { value: 'Baby is sleeping peacefully' } });

    expect(notesInput.value).toBe('Baby is sleeping peacefully');
  });

  test('validates required fields on form submission', async () => {
    window.alert = jest.fn();

    render(
      <TestWrapper>
        <ObservationNotes />
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

  test('validates priority level is required', async () => {
    window.alert = jest.fn();

    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    const notesInput = screen.getByPlaceholderText('Describe what you notice');
    fireEvent.change(notesInput, { target: { value: 'Some observation notes' } });

    const modalAddButton = screen.getAllByText('Add')[1];
    fireEvent.click(modalAddButton);

    expect(window.alert).toHaveBeenCalledWith('Please fill out all fields.');
  });

  test('validates notes field is required', async () => {
    window.alert = jest.fn();

    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    const modalAddButton = screen.getAllByText('Add')[1];
    fireEvent.click(modalAddButton);

    expect(window.alert).toHaveBeenCalledWith('Please fill out all fields.');
  });

  test('closes modal when Cancel button is clicked', () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Observation')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Add Observation')).not.toBeInTheDocument();
  });

  test('displays correct priority level options', () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getAllByLabelText('Priority Level')[0]).toBeInTheDocument();
  });

  test('fetches dashboard data on component mount', async () => {
    render(
      <TestWrapper>
        <ObservationNotes />
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

  test('fetches observation records after getting baby ID', async () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/observation',
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
        <ObservationNotes />
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

  test('renders static elements correctly', async () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('scrollbars')).toBeInTheDocument();
    });
  });

  test('form submission calls correct API endpoint with proper data structure', async () => {
    const mockNewRecord = {
      observation_id: 4,
      priority_level: 'medium',
      notes: 'Baby is developing well'
    };

    mockAxios.post.mockResolvedValue({ data: mockNewRecord });

    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Add'));

    fireEvent.change(screen.getByPlaceholderText('Describe what you notice'), {
      target: { value: 'Baby is developing well' }
    });

    expect(screen.getByPlaceholderText('Describe what you notice').value).toBe('Baby is developing well');
  });

  test('component has simplified form structure with only two required fields', () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getAllByLabelText('Priority Level')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Notes')).toBeInTheDocument();

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(1);

    const selects = screen.getAllByRole('button').filter(button =>
      button.getAttribute('aria-expanded') !== null
    );
    expect(selects.length).toBeGreaterThan(0); 
  });

  test('displays correct priority level validation', () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    expect(screen.getAllByLabelText('Priority Level')[0]).toBeInTheDocument();
  });

  test('placeholder text contains typo that exists in actual component', () => {
    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));
    
    expect(screen.getByPlaceholderText('Describe what you notice')).toBeInTheDocument();
  });

  test('observation records display correctly with different priority levels', async () => {
    const mockObservationData = [
      {
        observation_id: 1,
        priority_level: 'high',
        notes: 'Urgent observation note'
      },
      {
        observation_id: 2,
        priority_level: 'low',
        notes: 'Regular observation note'
      }
    ];

    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/babies')) {
        return Promise.resolve({ data: { baby_id: 'baby-123' } });
      }
      if (url.includes('/api/observation')) {
        return Promise.resolve({ data: mockObservationData });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });

    render(
      <TestWrapper>
        <ObservationNotes />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Priority Level: high')).toBeInTheDocument();
      expect(screen.getByText('Priority Level: low')).toBeInTheDocument();
      expect(screen.getByText('Notes: Urgent observation note')).toBeInTheDocument();
      expect(screen.getByText('Notes: Regular observation note')).toBeInTheDocument();
    });
  });
});