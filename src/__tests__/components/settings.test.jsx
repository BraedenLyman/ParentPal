import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Settings from '../../components/pages/settings/settings';
import axios from 'axios';
import { auth } from '../../firebase/firebaseAuth';
import { signOut, deleteUser } from 'firebase/auth';

jest.mock('axios');
jest.mock('../../firebase/firebaseAuth', () => ({
  auth: {
    currentUser: null,
  },
}));

jest.mock('firebase/auth', () => ({
  signOut: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('../../components/pages/nav-bar/navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

const mockParentUser = {
  account_id: 1,
  account_type: 'parent',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
};

const mockBabysitterUser = {
  account_id: 2,
  account_type: 'babysitter',
  first_name: 'Jane',
  last_name: 'Smith',
  email: 'jane@example.com',
};

describe('Settings Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    global.alert = jest.fn();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('Rendering', () => {
    test('renders settings page for parent user', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByText('Log Out')).toBeInTheDocument();
      expect(screen.getByText('Delete Account')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getAllByText('Shared Accounts').length).toBeGreaterThan(0);
        expect(screen.getByText('Data Export')).toBeInTheDocument();
      });
    });

    test('renders settings page for babysitter user', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'babysitter-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockBabysitterUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getAllByText('Shared Accounts').length).toBeGreaterThan(0);
      });

      expect(screen.queryByText('Data Export')).not.toBeInTheDocument();
    });

    test('renders avatar with user initial', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      const { container } = render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        const avatar = container.querySelector('.avatar');
        expect(avatar).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    test('fetches user data on mount', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(auth.currentUser.getIdToken).toHaveBeenCalled();
        expect(axios.post).toHaveBeenCalledWith(
          expect.stringContaining('/api/sign-in'),
          { idToken: 'mock-token' },
          { withCredentials: true }
        );
      });
    });

    test('does not fetch when no current user', () => {
      auth.currentUser = null;

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      expect(axios.post).not.toHaveBeenCalled();
    });

    test('handles error when fetching user data', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockRejectedValue(new Error('Network error'));

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error fetching user data: ',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Navigation', () => {
    test('navigates to personal information', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });

      const personalInfoCard = screen.getByText('Personal Information').closest('.settings-option-card');
      fireEvent.click(personalInfoCard);

      expect(mockNavigate).toHaveBeenCalledWith('/settings/personal-information');
    });

    test('parent navigates to shared accounts', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Shared Accounts').length).toBeGreaterThan(0);
      });

      const sharedAccountsCard = screen.getAllByText('Shared Accounts')[0].closest('.settings-option-card');
      fireEvent.click(sharedAccountsCard);

      expect(mockNavigate).toHaveBeenCalledWith('/settings/shared-accounts');
    });

    test('babysitter navigates to babysitter shared accounts', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'babysitter-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockBabysitterUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Shared Accounts').length).toBeGreaterThan(0);
      });

      const sharedAccountsCard = screen.getAllByText('Shared Accounts')[0].closest('.settings-option-card');
      fireEvent.click(sharedAccountsCard);

      expect(mockNavigate).toHaveBeenCalledWith('/settings/babysitter-shared-accounts');
    });

    test('parent navigates to data export', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Data Export')).toBeInTheDocument();
      });

      const dataExportCard = screen.getByText('Data Export').closest('.settings-option-card');
      fireEvent.click(dataExportCard);

      expect(mockNavigate).toHaveBeenCalledWith('/settings/data-export');
    });
  });

  describe('Logout', () => {
    test('logs out successfully', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      signOut.mockResolvedValue();

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Log Out')).toBeInTheDocument();
      });

      const logoutButton = screen.getByText('Log Out');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledWith(auth);
        expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
      });
    });

    test('handles logout error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      signOut.mockRejectedValue(new Error('Logout failed'));

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Log Out')).toBeInTheDocument();
      });

      const logoutButton = screen.getByText('Log Out');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error logging out: ',
          expect.any(Error)
        );
        expect(global.alert).toHaveBeenCalledWith('Failed to log out. Please try again.');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Delete Account Modal', () => {
    test('opens delete confirmation modal', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });

      const deleteButton = screen.getByText('Delete Account');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.')).toBeInTheDocument();
        expect(screen.getByText('Yes, Delete Account')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
    });

    test('closes modal when cancel is clicked', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });

      const deleteButton = screen.getByText('Delete Account');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('Yes, Delete Account')).not.toBeInTheDocument();
      });
    });
  });

  describe('Delete Account', () => {
    test('deletes account successfully', async () => {
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.delete.mockResolvedValue({ data: { success: true } });
      deleteUser.mockResolvedValue();

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });

      const deleteButton = screen.getByText('Delete Account');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Yes, Delete Account')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Yes, Delete Account');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith(
          expect.stringContaining('/api/user'),
          {
            params: { firebase_uid: 'parent-uid' },
            withCredentials: true,
          }
        );
        expect(deleteUser).toHaveBeenCalledWith(auth.currentUser);
        expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
      });
    });

    test('shows alert when no user found', async () => {
      auth.currentUser = null;

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });

      auth.currentUser = null;

      const deleteButton = screen.getByText('Delete Account');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Yes, Delete Account')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Yes, Delete Account');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('No user found. Please log in again.');
      });
    });

    test('handles database deletion error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.delete.mockRejectedValue({
        response: {
          data: { message: 'Database error' },
          statusText: 'Internal Server Error',
        },
      });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });

      const deleteButton = screen.getByText('Delete Account');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Yes, Delete Account')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Yes, Delete Account');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error deleting account: ',
          expect.any(Object)
        );
        expect(global.alert).toHaveBeenCalledWith(
          'Failed to delete account from database: Database error'
        );
      });

      consoleSpy.mockRestore();
    });

    test('handles Firebase deletion error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.delete.mockResolvedValue({ data: { success: true } });
      deleteUser.mockRejectedValue({
        code: 'auth/requires-recent-login',
        message: 'Recent login required',
      });

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });

      const deleteButton = screen.getByText('Delete Account');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Yes, Delete Account')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Yes, Delete Account');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith(
          'Failed to delete Firebase account: Recent login required'
        );
      });

      consoleSpy.mockRestore();
    });

    test('handles generic deletion error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      auth.currentUser = {
        getIdToken: jest.fn().mockResolvedValue('mock-token'),
        uid: 'parent-uid',
      };

      axios.post.mockResolvedValue({ data: { user: mockParentUser } });
      axios.delete.mockRejectedValue(new Error('Unknown error'));

      render(
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Delete Account')).toBeInTheDocument();
      });

      const deleteButton = screen.getByText('Delete Account');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Yes, Delete Account')).toBeInTheDocument();
      });

      const confirmButton = screen.getByText('Yes, Delete Account');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith(
          'Failed to delete account. Please try again.'
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
