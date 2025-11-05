import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../components/protected-route', () => {
  return function MockProtectedRoute({ children }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

jest.mock('../components/auth/sign-in/sign-in', () => {
  return function MockSignIn() {
    return <div data-testid="sign-in">Sign In Page</div>;
  };
});

jest.mock('../components/auth/register/sign-up', () => {
  return function MockSignUp() {
    return <div data-testid="sign-up">Sign Up Page</div>;
  };
});

jest.mock('../components/auth/sign-in/forgot-password/forgot-password', () => {
  return function MockForgotPassword() {
    return <div data-testid="forgot-password">Forgot Password Page</div>;
  };
});

jest.mock('../components/auth/sign-in/forgot-password/reset-password', () => {
  return function MockResetPassword() {
    return <div data-testid="reset-password">Reset Password Page</div>;
  };
});

jest.mock('../components/auth/register/create-account', () => {
  return function MockCreateAccount() {
    return <div data-testid="create-account">Create Account Page</div>;
  };
});

jest.mock('../components/auth/register/account-complete', () => {
  return function MockAccountComplete() {
    return <div data-testid="account-complete">Account Complete Page</div>;
  };
});

jest.mock('../components/pages/dashboard/parent-dashboard', () => {
  return function MockParentDashboard() {
    return <div data-testid="parent-dashboard">Parent Dashboard</div>;
  };
});

jest.mock('../components/pages/dashboard/babysitter-dashboard', () => {
  return function MockBabysitterDashboard() {
    return <div data-testid="babysitter-dashboard">Babysitter Dashboard</div>;
  };
});

jest.mock('../components/pages/babysitter-assigned-tasks/assigned-tasks', () => {
  return function MockAssignedTasks() {
    return <div data-testid="assigned-tasks">Assigned Tasks</div>;
  };
});

jest.mock('../components/pages/parent-assigned-tasks/parent-assigned-tasks', () => {
  return function MockParentAssignedTasks() {
    return <div data-testid="parent-assigned-tasks">Parent Assigned Tasks</div>;
  };
});

jest.mock('../components/pages/growth/growth-tracker', () => {
  return function MockGrowthTracker() {
    return <div data-testid="growth-tracker">Growth Tracker</div>;
  };
});

jest.mock('../components/pages/sleep/sleep-analytics', () => {
  return function MockSleepAnalytics() {
    return <div data-testid="sleep-analytics">Sleep Analytics</div>;
  };
});

jest.mock('../components/pages/health/health-journal', () => {
  return function MockHealthJournal() {
    return <div data-testid="health-journal">Health Journal</div>;
  };
});

jest.mock('../components/pages/notes/feeding/feeding-notes', () => {
  return function MockFeedingNotes() {
    return <div data-testid="feeding-notes">Feeding Notes</div>;
  };
});

jest.mock('../components/pages/notes/observation/observation-notes', () => {
  return function MockObservationNotes() {
    return <div data-testid="observation-notes">Observation Notes</div>;
  };
});

jest.mock('../components/pages/settings/settings', () => {
  return function MockSettings() {
    return <div data-testid="settings">Settings</div>;
  };
});

jest.mock('../components/pages/settings/personal-information', () => {
  return function MockPersonalInformation() {
    return <div data-testid="personal-information">Personal Information</div>;
  };
});

jest.mock('../components/pages/settings/shared-accounts', () => {
  return function MockSharedAccounts() {
    return <div data-testid="shared-accounts">Shared Accounts</div>;
  };
});

jest.mock('../components/pages/settings/babysitter-shared-accounts', () => {
  return function MockBabysitterSharedAccounts() {
    return <div data-testid="babysitter-shared-accounts">Babysitter Shared Accounts</div>;
  };
});

jest.mock('../components/pages/settings/data-export', () => {
  return function MockDataExport() {
    return <div data-testid="data-export">Data Export</div>;
  };
});

jest.mock('../components/pages/photo-gallery/photo-gallery', () => {
  return function MockPhotoGallery() {
    return <div data-testid="photo-gallery">Photo Gallery</div>;
  };
});

jest.mock('../components/pages/reports/Reports', () => {
  return function MockReports() {
    return <div data-testid="reports">Reports</div>;
  };
});

describe('App Component', () => {
  describe('Public Routes', () => {
    test('renders sign-in page at /sign-in', () => {
      render(
        <MemoryRouter initialEntries={['/sign-in']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('sign-in')).toBeInTheDocument();
    });

    test('renders sign-up page at /sign-up', () => {
      render(
        <MemoryRouter initialEntries={['/sign-up']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('sign-up')).toBeInTheDocument();
    });

    test('renders forgot password page at /forgot-password', () => {
      render(
        <MemoryRouter initialEntries={['/forgot-password']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('forgot-password')).toBeInTheDocument();
    });

    test('renders reset password page at /reset-password', () => {
      render(
        <MemoryRouter initialEntries={['/reset-password']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('reset-password')).toBeInTheDocument();
    });

    test('renders create account page at /create-account', () => {
      render(
        <MemoryRouter initialEntries={['/create-account']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('create-account')).toBeInTheDocument();
    });

    test('renders account complete page at /account-complete', () => {
      render(
        <MemoryRouter initialEntries={['/account-complete']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('account-complete')).toBeInTheDocument();
    });

    test('renders sign-in page at root /', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('sign-in')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Dashboard', () => {
    test('renders parent dashboard at /parent-dashboard', () => {
      render(
        <MemoryRouter initialEntries={['/parent-dashboard']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('parent-dashboard')).toBeInTheDocument();
    });

    test('renders babysitter dashboard at /babysitter-dashboard', () => {
      render(
        <MemoryRouter initialEntries={['/babysitter-dashboard']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('babysitter-dashboard')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Tasks', () => {
    test('renders assigned tasks at /assigned-tasks', () => {
      render(
        <MemoryRouter initialEntries={['/assigned-tasks']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('assigned-tasks')).toBeInTheDocument();
    });

    test('renders parent assigned tasks at /parent-assigned-tasks', () => {
      render(
        <MemoryRouter initialEntries={['/parent-assigned-tasks']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('parent-assigned-tasks')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Tracking', () => {
    test('renders growth tracker at /growth-tracker', () => {
      render(
        <MemoryRouter initialEntries={['/growth-tracker']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('growth-tracker')).toBeInTheDocument();
    });

    test('renders sleep analytics at /sleep-analytics', () => {
      render(
        <MemoryRouter initialEntries={['/sleep-analytics']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('sleep-analytics')).toBeInTheDocument();
    });

    test('renders health journal at /health-journal', () => {
      render(
        <MemoryRouter initialEntries={['/health-journal']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('health-journal')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Notes', () => {
    test('renders feeding notes at /feeding-notes', () => {
      render(
        <MemoryRouter initialEntries={['/feeding-notes']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('feeding-notes')).toBeInTheDocument();
    });

    test('renders observation notes at /observation-notes', () => {
      render(
        <MemoryRouter initialEntries={['/observation-notes']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('observation-notes')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Media & Reports', () => {
    test('renders photo gallery at /photo-gallery', () => {
      render(
        <MemoryRouter initialEntries={['/photo-gallery']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('photo-gallery')).toBeInTheDocument();
    });

    test('renders reports at /reports', () => {
      render(
        <MemoryRouter initialEntries={['/reports']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('reports')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Settings', () => {
    test('renders settings at /settings', () => {
      render(
        <MemoryRouter initialEntries={['/settings']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('settings')).toBeInTheDocument();
    });

    test('renders personal information at /settings/personal-information', () => {
      render(
        <MemoryRouter initialEntries={['/settings/personal-information']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('personal-information')).toBeInTheDocument();
    });

    test('renders shared accounts at /settings/shared-accounts', () => {
      render(
        <MemoryRouter initialEntries={['/settings/shared-accounts']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('shared-accounts')).toBeInTheDocument();
    });

    test('renders babysitter shared accounts at /settings/babysitter-shared-accounts', () => {
      render(
        <MemoryRouter initialEntries={['/settings/babysitter-shared-accounts']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('babysitter-shared-accounts')).toBeInTheDocument();
    });

    test('renders data export at /settings/data-export', () => {
      render(
        <MemoryRouter initialEntries={['/settings/data-export']}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('data-export')).toBeInTheDocument();
    });
  });
});
