import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HealthJournal from '../../components/pages/health/health-journal';
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
const mockLocation = { pathname: '/health-journal', state: {} };

const mockUserData = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
};

const mockBabyData = [
  { baby_id: 1, first_name: 'Emma', last_name: 'Doe' },
];

const mockMedsRecords = [
  {
    meds_id: 1,
    baby_id: 1,
    med_name: 'Tylenol',
    dosage: '5',
    time_taken: '14:00:00',
    date: '2024-01-15',
    symptom_description: 'Fever',
  },
];

const mockAllergiesRecords = [
  {
    allergy_id: 1,
    baby_id: 1,
    allergy: 'Peanuts',
    severity: 'high',
    epi_pen: 'Yes',
    notes: 'Severe reaction',
  },
];

const mockVaccinationsRecords = [
  {
    vaccination_id: 1,
    baby_id: 1,
    vaccine_name: 'MMR',
    date: '2024-01-15',
  },
];

describe('HealthJournal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
    console.error = jest.fn();
    console.log = jest.fn();
  });

  test('renders health journal page', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/meds')) return Promise.resolve({ data: mockMedsRecords });
      if (url.includes('/api/allergies')) return Promise.resolve({ data: mockAllergiesRecords });
      if (url.includes('/api/vaccinations')) return Promise.resolve({ data: mockVaccinationsRecords });
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <HealthJournal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Health Journal')).toBeInTheDocument();
    });
  });

  test('fetches and displays health records', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/meds')) return Promise.resolve({ data: mockMedsRecords });
      if (url.includes('/api/allergies')) return Promise.resolve({ data: mockAllergiesRecords });
      if (url.includes('/api/vaccinations')) return Promise.resolve({ data: mockVaccinationsRecords });
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <HealthJournal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/meds'),
        expect.objectContaining({
          params: { baby_id: 1 },
          withCredentials: true,
        })
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/allergies'),
        expect.objectContaining({
          params: { baby_id: 1 },
          withCredentials: true,
        })
      );
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/vaccinations'),
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
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/meds')) return Promise.resolve({ data: mockMedsRecords });
      if (url.includes('/api/allergies')) return Promise.resolve({ data: mockAllergiesRecords });
      if (url.includes('/api/vaccinations')) return Promise.resolve({ data: mockVaccinationsRecords });
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <HealthJournal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Health Journal')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: '' });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/parent-dashboard');
  });

  test('opens add health entry modal', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/meds')) return Promise.resolve({ data: mockMedsRecords });
      if (url.includes('/api/allergies')) return Promise.resolve({ data: mockAllergiesRecords });
      if (url.includes('/api/vaccinations')) return Promise.resolve({ data: mockVaccinationsRecords });
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <HealthJournal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Health Journal')).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Add Medication')).toBeInTheDocument();
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
        <HealthJournal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching dashboard data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('handles error when fetching health records', async () => {
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
        <HealthJournal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch meds records: ', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('uses baby from location state if provided', async () => {
    const locationWithBaby = {
      pathname: '/health-journal',
      state: { baby: mockBabyData[0] },
    };
    require('react-router-dom').useLocation.mockReturnValue(locationWithBaby);

    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });
    axios.get.mockImplementation((url) => {
      if (url.includes('/api/meds')) return Promise.resolve({ data: mockMedsRecords });
      if (url.includes('/api/allergies')) return Promise.resolve({ data: mockAllergiesRecords });
      if (url.includes('/api/vaccinations')) return Promise.resolve({ data: mockVaccinationsRecords });
      return Promise.resolve({ data: [] });
    });

    render(
      <BrowserRouter>
        <HealthJournal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/health'),
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
        <HealthJournal />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });

    expect(axios.get).not.toHaveBeenCalled();
  });
});
