import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import HealthJournal from '../../../components/pages/health/health-journal';

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

describe('HealthJournal Component', () => {
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
      if (url.includes('/api/meds')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/allergies')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/vaccinations')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });
  });

  test('renders health journal page correctly', async () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    expect(screen.getByText("Baby's Health")).toBeInTheDocument();
    expect(screen.getByText('Medications')).toBeInTheDocument();
    expect(screen.getByText('Allergies')).toBeInTheDocument();
    expect(screen.getByText('Vaccinations')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('displays no med records message when empty', async () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No med records yet')).toBeInTheDocument();
    });
  });

  test('displays medication records when data exists', async () => {
    const mockMedsData = [
      {
        meds_id: 1,
        medication_name: 'Tylenol',
        time_taken: '14:30',
        dosage: '5ml',
        symptoms: 'Fever and headache',
        date: '2024-01-15T00:00:00.000Z'
      }
    ];

    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/babies')) {
        return Promise.resolve({ data: { baby_id: 'baby-123' } });
      }
      if (url.includes('/api/meds')) {
        return Promise.resolve({ data: mockMedsData });
      }
      if (url.includes('/api/allergies')) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes('/api/vaccinations')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Unhandled API call'));
    });

    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Tylenol')).toBeInTheDocument();
      expect(screen.getByText('Time Taken')).toBeInTheDocument();
      // 14:30 in 24-hour format = 2:30 PM in 12-hour format
      expect(screen.getByText('2:30 PM')).toBeInTheDocument();
      expect(screen.getByText('Dosage')).toBeInTheDocument();
      expect(screen.getByText('5ml fl oz')).toBeInTheDocument();
      expect(screen.getByText('Fever and headache')).toBeInTheDocument();
    });
  });

  test('switches between tabs correctly', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    expect(screen.getByText('No med records yet')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Allergies'));
    expect(screen.getByText('No allergy records yet')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Vaccinations'));
    expect(screen.getByText('No vaccinations records yet')).toBeInTheDocument();
  });

  test('opens medication modal when Add button is clicked in Meds tab', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(screen.getByText('Add Medication')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter medication name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount in fluid ounces')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe how they are feeling')).toBeInTheDocument();
  });

  test('opens allergy modal when Add button is clicked in Allergies tab', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Allergies'));

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(screen.getByText('Add Allergy')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What are they allergic to')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add any other important info')).toBeInTheDocument();
  });

  test('opens vaccination modal when Add button is clicked in Vaccinations tab', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Vaccinations'));

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(screen.getByText('Add Vaccination')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Vaccination they have')).toBeInTheDocument();
  });

  test('validates required fields for medication form', async () => {
    window.alert = jest.fn();

    render(
      <TestWrapper>
        <HealthJournal />
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

  test('validates required fields for allergy form', async () => {
    window.alert = jest.fn();

    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Allergies'));
    fireEvent.click(screen.getByText('Add'));

    const modalAddButton = screen.getAllByText('Add')[1];
    fireEvent.click(modalAddButton);

    expect(window.alert).toHaveBeenCalledWith('Please fill out all fields.');
  });

  test('validates required fields for vaccination form', async () => {
    window.alert = jest.fn();

    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Vaccinations'));
    fireEvent.click(screen.getByText('Add'));

    const modalAddButton = screen.getAllByText('Add')[1];
    fireEvent.click(modalAddButton);

    expect(window.alert).toHaveBeenCalledWith('Please fill out all fields.');
  });

  test('allows input in medication form fields', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));

    const medNameInput = screen.getByPlaceholderText('Enter medication name');
    const dosageInput = screen.getByPlaceholderText('Amount in fluid ounces');
    const symptomsInput = screen.getByPlaceholderText('Describe how they are feeling');
    const dateInput = screen.getByLabelText('Date');

    fireEvent.change(medNameInput, { target: { value: 'Tylenol' } });
    fireEvent.change(dosageInput, { target: { value: '5' } });
    fireEvent.change(symptomsInput, { target: { value: 'Fever' } });
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } });

    expect(medNameInput.value).toBe('Tylenol');
    expect(dosageInput.value).toBe('5');
    expect(symptomsInput.value).toBe('Fever');
    expect(dateInput.value).toBe('2024-03-15');
  });

  test('allows input in allergy form fields', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Allergies'));
    fireEvent.click(screen.getByText('Add'));

    const allergyInput = screen.getByPlaceholderText('What are they allergic to');
    const notesInput = screen.getByPlaceholderText('Add any other important info');

    fireEvent.change(allergyInput, { target: { value: 'Peanuts' } });
    fireEvent.change(notesInput, { target: { value: 'Severe reaction' } });

    expect(allergyInput.value).toBe('Peanuts');
    expect(notesInput.value).toBe('Severe reaction');
  });

  test('closes modals when Cancel button is clicked', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Medication')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add Medication')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Allergies'));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Allergy')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add Allergy')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Vaccinations'));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Vaccination')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add Vaccination')).not.toBeInTheDocument();
  });

  test('fetches dashboard data on component mount', async () => {
    render(
      <TestWrapper>
        <HealthJournal />
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

  test('fetches all health records after getting baby ID', async () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/meds',
        {
          params: { baby_id: 'baby-123' },
          withCredentials: true
        }
      );
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/allergies',
        {
          params: { baby_id: 'baby-123' },
          withCredentials: true
        }
      );
      expect(mockAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/vaccinations',
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
        <HealthJournal />
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
        <HealthJournal />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('scrollbars')).toBeInTheDocument();
    });
  });
});