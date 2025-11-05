import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PersonalInformation from '../../components/pages/settings/personal-information';
import axios from 'axios';
import { auth } from '../../firebase/firebaseAuth';
import { updatePassword } from 'firebase/auth';

jest.mock('axios');
jest.mock('firebase/auth', () => ({
  updatePassword: jest.fn(),
  getAuth: jest.fn(() => ({ name: 'mock-auth' })),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserSessionPersistence: 'SESSION',
}));

jest.mock('../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock('../../firebase/firebase', () => ({
  app: { name: 'mock-app' },
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
  {
    baby_id: 1,
    first_name: 'Emma',
    last_name: 'Doe',
    birth_date: '2023-01-01',
    gender: 'Female',
    category: 'Baby',
  },
];

describe('PersonalInformation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    console.error = jest.fn();
  });

  test('renders personal information page', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });
  });

  test('fetches and displays user data', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
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

  test('navigates back to settings', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    const backButton = document.querySelector('.back-button-header');
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/settings');
  });

  test('displays baby list for parent users', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Emma/)).toBeInTheDocument();
    });
  });

  test('shows add baby button for parent users', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Add Baby/)).toBeInTheDocument();
    });
  });

  test('does not show add baby button for babysitter users', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    const babysitterUser = { ...mockUserData, account_type: 'babysitter' };
    axios.post.mockResolvedValue({
      data: { user: babysitterUser, babyData: [] },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Add Baby/)).not.toBeInTheDocument();
  });

  test('updates password successfully', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    updatePassword.mockResolvedValue();

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

    fireEvent.change(newPasswordInput, { target: { value: 'NewPass123!' } });
    fireEvent.focus(newPasswordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: 'NewPass123!' } });
    fireEvent.focus(confirmPasswordInput);

    await waitFor(() => {
      const updateButton = screen.getByText('Accept Changes');
      expect(updateButton).not.toBeDisabled();
    });

    const updateButton = screen.getByText('Accept Changes');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalled();
    });
  });

  test('validates password requirements', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    fireEvent.change(newPasswordInput, { target: { value: 'weak' } });
    fireEvent.focus(newPasswordInput);

    await waitFor(() => {
      const updateButton = screen.getByText('Accept Changes');
      expect(updateButton).toBeDisabled();
    });
  });

  test('shows password mismatch error', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

    fireEvent.change(newPasswordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.focus(newPasswordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass!' } });
    fireEvent.focus(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/)).toBeInTheDocument();
    });
  });

  test('toggles password visibility', async () => {
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockResolvedValue({
      data: { user: mockUserData, babyData: mockBabyData },
    });

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    expect(newPasswordInput).toHaveAttribute('type', 'password');

    const toggleButtons = screen.getAllByRole('button', { name: '' });
    const toggleButton = toggleButtons.find(btn => btn.querySelector('svg'));

    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(newPasswordInput).toHaveAttribute('type', 'text');
    }
  });

  test('handles error when fetching user data', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    auth.currentUser = {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    };

    axios.post.mockRejectedValue(new Error('Network error'));

    render(
      <BrowserRouter>
        <PersonalInformation />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching user data: ', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
