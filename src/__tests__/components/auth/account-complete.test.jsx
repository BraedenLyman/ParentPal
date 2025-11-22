import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AccountComplete from '../../components/auth/register/account-complete';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockNavigate = jest.fn();
const mockLocation = { state: { accountType: 'parent' } };

describe('AccountComplete Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);
    console.log = jest.fn();
  });

  test('renders account complete page', () => {
    render(
      <BrowserRouter>
        <AccountComplete />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to ParentPal!')).toBeInTheDocument();
    expect(screen.getByText(/Your account has been successfully created!/)).toBeInTheDocument();
    expect(screen.getByText(/Sign in now to access Growth Tracker/)).toBeInTheDocument();
    expect(screen.getByText('Sign In to Get Started')).toBeInTheDocument();
  });

  test('navigates to sign-in on button click', () => {
    render(
      <BrowserRouter>
        <AccountComplete />
      </BrowserRouter>
    );

    const button = screen.getByText('Sign In to Get Started');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
  });

  test('handles missing state', () => {
    require('react-router-dom').useLocation.mockReturnValue({ state: null });

    render(
      <BrowserRouter>
        <AccountComplete />
      </BrowserRouter>
    );

    expect(screen.getByText('Welcome to ParentPal!')).toBeInTheDocument();
  });

  test('logs received state', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    render(
      <BrowserRouter>
        <AccountComplete />
      </BrowserRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Account Complete received state:',
      expect.objectContaining({ accountType: 'parent' })
    );

    consoleSpy.mockRestore();
  });
});
