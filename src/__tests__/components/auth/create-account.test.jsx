import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateAccount, { genders } from '../../../components/auth/register/create-account';
import axios from 'axios';
import { createUserWithEmailAndPassword } from 'firebase/auth';

jest.mock('axios');
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(() => ({ name: 'mock-auth' })),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserSessionPersistence: 'SESSION',
}));

jest.mock('../../../firebase/firebase', () => ({
  app: { name: 'mock-app' },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../../../components/custom-select/CustomSelect', () => {
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

const mockNavigate = jest.fn();

describe('CreateAccount Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    console.error = jest.fn();
  });

  describe('Rendering', () => {
    test('renders create account form', () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const headings = screen.getAllByText('Create an account');
      expect(headings.length).toBeGreaterThan(0);
      expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    });

    test('renders account type selector', () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const selects = screen.getAllByTestId('custom-select');
      const accountTypeSelect = selects.find(
        select => select.getAttribute('aria-label') === 'Select your account type'
      );
      expect(accountTypeSelect).toBeInTheDocument();
    });

    test('shows baby fields when parent account type selected', async () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const selects = screen.getAllByTestId('custom-select');
      const accountTypeSelect = selects.find(
        select => select.getAttribute('aria-label') === 'Select your account type'
      );

      fireEvent.change(accountTypeSelect, { target: { value: 'parent' } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Enter baby's first name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter baby's last name")).toBeInTheDocument();
      });
    });

    test('does not show baby fields for babysitter account type', async () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const selects = screen.getAllByTestId('custom-select');
      const accountTypeSelect = selects.find(
        select => select.getAttribute('aria-label') === 'Select your account type'
      );

      fireEvent.change(accountTypeSelect, { target: { value: 'babysitter' } });

      await waitFor(() => {
        expect(screen.queryByPlaceholderText("Enter baby's first name")).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Validation', () => {
    test('validates password requirements', async () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password');

      fireEvent.change(passwordInput, { target: { value: 'abc' } });
      await waitFor(() => {
        const submitButtons = screen.getAllByText('Create an account');
        const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');
        expect(submitButton).toBeDisabled();
      });

      fireEvent.change(passwordInput, { target: { value: 'abcdefgh!' } });
      await waitFor(() => {
        const submitButtons = screen.getAllByText('Create an account');
        const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');
        expect(submitButton).toBeDisabled();
      });

      fireEvent.change(passwordInput, { target: { value: 'Abcdefgh' } });
      await waitFor(() => {
        const submitButtons = screen.getAllByText('Create an account');
        const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');
        expect(submitButton).toBeDisabled();
      });

      fireEvent.change(passwordInput, { target: { value: 'Abcdefgh!' } });

      await waitFor(() => {
        const submitButtons = screen.getAllByText('Create an account');
        const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    test('toggles password visibility', () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      expect(passwordInput).toHaveAttribute('type', 'password');

      const toggleButton = passwordInput.parentElement.querySelector('button');
      fireEvent.click(toggleButton);

      expect(passwordInput).toHaveAttribute('type', 'text');

      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    test('button is disabled with invalid password', async () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      fireEvent.change(passwordInput, { target: { value: 'weak' } });

      await waitFor(() => {
        const submitButtons = screen.getAllByText('Create an account');
      const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');
        expect(submitButton).toBeDisabled();
      });
    });

    test('button is disabled without account type', async () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password');
      fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });

      await waitFor(() => {
        const submitButtons = screen.getAllByText('Create an account');
      const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Gender Selection', () => {
    test('shows other gender input when Other is selected', async () => {
      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      const selects = screen.getAllByTestId('custom-select');
      const accountTypeSelect = selects.find(
        select => select.getAttribute('aria-label') === 'Select your account type'
      );

      fireEvent.change(accountTypeSelect, { target: { value: 'babysitter' } });

      await waitFor(() => {
        const genderSelect = screen.getAllByTestId('custom-select').find(
          select => select.getAttribute('aria-label') === 'Select your gender'
        );
        fireEvent.change(genderSelect, { target: { value: 'Other' } });
      });

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Enter your gender')).toBeInTheDocument();
      });
    });
  });

  describe('Account Creation - Babysitter', () => {
    test('creates babysitter account successfully', async () => {
      createUserWithEmailAndPassword.mockResolvedValue({
        user: { uid: 'test-firebase-uid' },
      });
      axios.post.mockResolvedValue({ data: { success: true } });

      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
        target: { value: 'Jane' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'jane@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'ValidPass123!' },
      });

      const selects = screen.getAllByTestId('custom-select');
      const accountTypeSelect = selects.find(
        select => select.getAttribute('aria-label') === 'Select your account type'
      );
      fireEvent.change(accountTypeSelect, { target: { value: 'babysitter' } });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Date of Birth'), {
          target: { value: '1990-01-01' },
        });
      });

      await waitFor(() => {
        const genderSelect = screen.getAllByTestId('custom-select').find(
          select => select.getAttribute('aria-label') === 'Select your gender'
        );
        fireEvent.change(genderSelect, { target: { value: 'Female' } });
      });

      const submitButtons = screen.getAllByText('Create an account');
      const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
          expect.anything(),
          'jane@example.com',
          'ValidPass123!'
        );
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/accounts'),
          expect.objectContaining({
            firebaseUid: 'test-firebase-uid',
            fName: 'Jane',
            lName: 'Doe',
            email: 'jane@example.com',
            accountType: 'babysitter',
            dob: '1990-01-01',
            gender: 'Female',
          })
        );
        expect(mockNavigate).toHaveBeenCalledWith('/account-complete', expect.any(Object));
      });
    });
  });

  describe('Account Creation - Parent', () => {
    test('creates parent account with baby info successfully', async () => {
      createUserWithEmailAndPassword.mockResolvedValue({
        user: { uid: 'test-firebase-uid' },
      });
      axios.post.mockResolvedValue({ data: { success: true } });

      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
        target: { value: 'John' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'ValidPass123!' },
      });

      const selects = screen.getAllByTestId('custom-select');
      const accountTypeSelect = selects.find(
        select => select.getAttribute('aria-label') === 'Select your account type'
      );
      fireEvent.change(accountTypeSelect, { target: { value: 'parent' } });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Date of Birth'), {
          target: { value: '1990-01-01' },
        });
      });

      await waitFor(() => {
        const genderSelect = screen.getAllByTestId('custom-select').find(
          select => select.getAttribute('aria-label') === 'Select your gender'
        );
        fireEvent.change(genderSelect, { target: { value: 'Male' } });
      });

      await waitFor(() => {
        const babyTypeSelect = screen.getAllByTestId('custom-select').find(
          select => select.getAttribute('aria-label') === "Select your baby's age group"
        );
        fireEvent.change(babyTypeSelect, { target: { value: 'Baby' } });
      });

      await waitFor(() => {
        fireEvent.change(screen.getByPlaceholderText("Enter baby's first name"), {
          target: { value: 'Emma' },
        });
        fireEvent.change(screen.getByPlaceholderText("Enter baby's last name"), {
          target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByLabelText('Baby Date of Birth'), {
          target: { value: '2023-01-01' },
        });
      });

      await waitFor(() => {
        const babyGenderSelect = screen.getAllByTestId('custom-select').find(
          select => select.getAttribute('aria-label') === "Select your baby's gender"
        );
        fireEvent.change(babyGenderSelect, { target: { value: 'Female' } });
      });

      const submitButtons = screen.getAllByText('Create an account');
      const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/accounts'),
          expect.objectContaining({
            firebaseUid: 'test-firebase-uid',
            fName: 'John',
            lName: 'Doe',
            email: 'john@example.com',
            accountType: 'parent',
            dob: '1990-01-01',
            gender: 'Male',
            baby: expect.objectContaining({
              bFName: 'Emma',
              bLName: 'Doe',
              bDob: '2023-01-01',
              bGender: 'Female',
              babyCategory: 'Baby',
            }),
          })
        );
        expect(mockNavigate).toHaveBeenCalledWith('/account-complete', expect.any(Object));
      });
    });
  });

  describe('Error Handling', () => {
    test('handles firebase creation error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      createUserWithEmailAndPassword.mockRejectedValue(new Error('Firebase error'));

      render(
        <BrowserRouter>
          <CreateAccount />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByPlaceholderText('Enter your first name'), {
        target: { value: 'Jane' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your last name'), {
        target: { value: 'Doe' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
        target: { value: 'jane@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
        target: { value: 'ValidPass123!' },
      });

      const selects = screen.getAllByTestId('custom-select');
      const accountTypeSelect = selects.find(
        select => select.getAttribute('aria-label') === 'Select your account type'
      );
      fireEvent.change(accountTypeSelect, { target: { value: 'babysitter' } });

      await waitFor(() => {
        fireEvent.change(screen.getByLabelText('Date of Birth'), {
          target: { value: '1990-01-01' },
        });
      });

      await waitFor(() => {
        const genderSelect = screen.getAllByTestId('custom-select').find(
          select => select.getAttribute('aria-label') === 'Select your gender'
        );
        fireEvent.change(genderSelect, { target: { value: 'Female' } });
      });

      const submitButtons = screen.getAllByText('Create an account');
      const submitButton = submitButtons.find(el => el.tagName === 'BUTTON');

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error creating account:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Exported Constants', () => {
    test('exports genders array', () => {
      expect(genders).toEqual([
        { key: 'Male', label: 'Male' },
        { key: 'Female', label: 'Female' },
        { key: 'Other', label: 'Other' },
      ]);
    });
  });
});
