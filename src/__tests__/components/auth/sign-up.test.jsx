import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from '../../../components/auth/register/sign-up';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders sign up page', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByText(/Track your baby/i)).toBeInTheDocument();
    expect(screen.getByText(/Your essential companion for managing/)).toBeInTheDocument();
    expect(screen.getByText(/embark on this exciting journey/)).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('navigates to create-account on button click', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    const button = screen.getByText('Get Started');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/create-account');
  });
});
