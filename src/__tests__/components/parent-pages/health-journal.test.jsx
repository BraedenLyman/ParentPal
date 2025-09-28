import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import HealthJournal from '../../../components/parent-pages/health/health-journal';

// Mock external dependencies
jest.mock('axios');
const mockAxios = require('axios');

jest.mock('../../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: { uid: 'test-uid-123' }
  },
}));

// Mock child components
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

// Test wrapper
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
    // Mock successful API responses
    mockAxios.get.mockImplementation((url) => {
      if (url.includes('/api/babies')) {
        return Promise.resolve({ data: { baby_id: 'baby-123' } });
      }
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
    expect(screen.getByText('Meds')).toBeInTheDocument();
    expect(screen.getByText('Allergies')).toBeInTheDocument();
    expect(screen.getByText('Vaccinations')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('page-middle-nav')).toBeInTheDocument();
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
      expect(screen.getByText('Medication Name: Tylenol')).toBeInTheDocument();
      expect(screen.getByText('Time taken at: 14:30')).toBeInTheDocument();
      expect(screen.getByText('Dosage: 5ml')).toBeInTheDocument();
      expect(screen.getByText('Symptoms/Description: Fever and headache')).toBeInTheDocument();
      expect(screen.getByText('Date: 2024-01-15')).toBeInTheDocument();
    });
  });

  test('switches between tabs correctly', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    // Initially on Meds tab
    expect(screen.getByText('No med records yet')).toBeInTheDocument();

    // Switch to Allergies tab
    fireEvent.click(screen.getByText('Allergies'));
    expect(screen.getByText('No allergy records yet')).toBeInTheDocument();

    // Switch to Vaccinations tab
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
    expect(screen.getByPlaceholderText('Amount of meds taken')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Describe how they are feeling')).toBeInTheDocument();
  });

  test('opens allergy modal when Add button is clicked in Allergies tab', () => {
    render(
      <TestWrapper>
        <HealthJournal />
      </TestWrapper>
    );

    // Switch to Allergies tab
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

    // Switch to Vaccinations tab
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

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Add')).toBeInTheDocument();
    });

    // Open modal and try to submit without filling fields
    fireEvent.click(screen.getByText('Add'));

    const modalAddButton = screen.getAllByText('Add')[1]; // Second Add button is in modal
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

    // Switch to Allergies tab and open modal
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

    // Switch to Vaccinations tab and open modal
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

    // Open medication modal
    fireEvent.click(screen.getByText('Add'));

    // Fill out form
    const medNameInput = screen.getByPlaceholderText('Enter medication name');
    const dosageInput = screen.getByPlaceholderText('Amount of meds taken');
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

    // Switch to Allergies tab and open modal
    fireEvent.click(screen.getByText('Allergies'));
    fireEvent.click(screen.getByText('Add'));

    // Fill out form
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

    // Test medication modal
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Medication')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add Medication')).not.toBeInTheDocument();

    // Test allergy modal
    fireEvent.click(screen.getByText('Allergies'));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Allergy')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add Allergy')).not.toBeInTheDocument();

    // Test vaccination modal
    fireEvent.click(screen.getByText('Vaccinations'));
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('Add Vaccination')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add Vaccination')).not.toBeInTheDocument();
  });

  test('fetches baby data on component mount', async () => {
    render(
      <TestWrapper>
        <HealthJournal />
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

    mockAxios.get.mockRejectedValue(new Error('Network error'));

    render(
      <TestWrapper>
        <HealthJournal />
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
        <HealthJournal />
      </TestWrapper>
    );

    // Test static elements
    expect(screen.getByText('Baby')).toBeInTheDocument();
    expect(screen.getByText('2002-02-02')).toBeInTheDocument();
    expect(screen.getByTestId('scrollbars')).toBeInTheDocument();
  });
});