import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DataExport from '../../components/pages/settings/data-export';
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

jest.mock('../../components/custom-select/CustomSelect', () => {
  return function MockSelect({ options, value, onChange, placeholder }) {
    return (
      <select
        data-testid="baby-select"
        value={value?.value || ''}
        onChange={(e) => {
          const option = options.find(opt => opt.value === parseInt(e.target.value));
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

jest.mock('@heroui/checkbox', () => ({
  Checkbox: ({ children, isSelected, onValueChange }) => {
    return (
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onValueChange(e.target.checked)}
        />
        {children}
      </label>
    );
  },
}));

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    setFontSize: jest.fn(),
    setFont: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    internal: {
      pageSize: {
        width: 210,
        height: 297,
      },
    },
  }));
});

jest.mock('jspdf-autotable', () => jest.fn());

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

const mockUserData = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
};

const mockBabyData = [
  { baby_id: 1, first_name: 'Emma', last_name: 'Doe', date_of_birth: '2023-01-15', gender: 'Female' },
  { baby_id: 2, first_name: 'Oliver', last_name: 'Doe', date_of_birth: '2022-06-20', gender: 'Male' },
];

const mockGrowthData = [
  { growth_id: 1, baby_id: 1, date: '2024-01-01', height: '50', weight: '7.5', head_circumference: '35' },
  { growth_id: 2, baby_id: 1, date: '2024-02-01', height: '52', weight: '8.0', head_circumference: '36' },
];

const mockSleepData = [
  { sleep_id: 1, baby_id: 1, date: '2024-01-01', sleep_duration: '8.5' },
  { sleep_id: 2, baby_id: 1, date: '2024-01-02', sleep_duration: '9.0' },
];

const mockMedsData = [
  { meds_id: 1, baby_id: 1, med_name: 'Tylenol', dosage: '5ml', date: '2024-01-15', symptom_description: 'Fever' },
];

const mockAllergiesData = [
  { allergy_id: 1, baby_id: 1, allergy: 'Peanuts', severity: 'High', epi_pen: 'Yes', notes: 'Severe reaction' },
];

const mockVaccinationsData = [
  { vaccination_id: 1, baby_id: 1, vaccine_name: 'MMR', date: '2024-01-10' },
];

const mockFeedingData = [
  { feeding_id: 1, baby_id: 1, feeding_type: 'bottle', amount: '120ml', date: '2024-01-01' },
];

const mockObservationData = [
  { observation_id: 1, baby_id: 1, note: 'First smile', date: '2024-01-05' },
];

describe('DataExport Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    console.error = jest.fn();
    console.log = jest.fn();
    global.alert = jest.fn();
  });

  describe('Rendering', () => {
    test('renders data export page', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Data Export')).toBeInTheDocument();
      });
    });

    test('displays baby selector', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('baby-select')).toBeInTheDocument();
      });
    });

    test('displays all export checkboxes', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Growth Charts')).toBeInTheDocument();
        expect(screen.getByText('Sleep Analytics')).toBeInTheDocument();
        expect(screen.getByText('Medications')).toBeInTheDocument();
        expect(screen.getByText('Allergies')).toBeInTheDocument();
        expect(screen.getByText('Vaccinations')).toBeInTheDocument();
        expect(screen.getByText('Feeding Notes')).toBeInTheDocument();
        expect(screen.getByText('Observation Notes')).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches user and baby data on mount', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { idToken: 'mock-token' },
          { withCredentials: true }
        );
      });
    });

    test('handles error when fetching data', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });

    test('sets selected baby to first baby by default', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        const select = screen.getByTestId('baby-select');
        expect(select.value).toBe('1');
      });
    });

    test('handles no babies', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Data Export')).toBeInTheDocument();
      });
    });
  });

  describe('Checkbox Interactions', () => {
    test('toggles growth charts checkbox', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        const growthCheckbox = screen.getByText('Growth Charts').parentElement.querySelector('input[type="checkbox"]');
        expect(growthCheckbox).toBeChecked();

        fireEvent.click(growthCheckbox);
        expect(growthCheckbox).not.toBeChecked();
      });
    });

    test('toggles feeding notes checkbox', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        const feedingCheckbox = screen.getByText('Feeding Notes').parentElement.querySelector('input[type="checkbox"]');
        expect(feedingCheckbox).not.toBeChecked();

        fireEvent.click(feedingCheckbox);
        expect(feedingCheckbox).toBeChecked();
      });
    });
  });

  describe('Baby Selection', () => {
    test('changes selected baby', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        const select = screen.getByTestId('baby-select');
        fireEvent.change(select, { target: { value: '2' } });
        expect(select.value).toBe('2');
      });
    });
  });

  describe('Navigation', () => {
    test('navigates back to settings', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Data Export')).toBeInTheDocument();
      });

      const backButton = document.querySelector('.back-button-header');
      if (backButton) {
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith('/settings');
      }
    });
  });

  describe('PDF Generation', () => {
    test('handles empty baby list', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: [] },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Data Export')).toBeInTheDocument();
      });

      expect(axios.post).toHaveBeenCalled();
    });

    test('initiates PDF generation with selected options', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      axios.get.mockImplementation((url) => {
        if (url.includes('/api/growth')) return Promise.resolve({ data: mockGrowthData });
        if (url.includes('/api/sleep')) return Promise.resolve({ data: mockSleepData });
        if (url.includes('/api/meds')) return Promise.resolve({ data: mockMedsData });
        if (url.includes('/api/allergies')) return Promise.resolve({ data: mockAllergiesData });
        if (url.includes('/api/vaccinations')) return Promise.resolve({ data: mockVaccinationsData });
        return Promise.resolve({ data: [] });
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Data Export')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const generateButton = screen.getByRole('button', { name: /Generate PDF/i });
      fireEvent.click(generateButton);

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

    test('handles PDF generation error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      axios.get.mockRejectedValue(new Error('Failed to fetch data'));

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Data Export')).toBeInTheDocument();
      });

      const generateButton = screen.getByRole('button', { name: /Generate PDF/i });
      fireEvent.click(generateButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Loading State', () => {
    test('handles loading state', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
      };

      axios.post.mockResolvedValue({
        data: { user: mockUserData, babyData: mockBabyData },
      });

      render(
        <BrowserRouter>
          <DataExport />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Data Export')).toBeInTheDocument();
      });
    });
  });
});
