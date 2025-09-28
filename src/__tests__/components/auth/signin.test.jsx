import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import SignIn from '../../../components/auth/sign-in/sign-in';

// Mock external dependencies
jest.mock('axios');
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));
jest.mock('../../../firebase/firebaseAuth', () => ({
  auth: {},
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  </BrowserRouter>
);

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders welcome message', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    );

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
  });

  test('renders form inputs and button', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('allows user input in email field', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  test('allows user input in password field', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    );

    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    expect(passwordInput.value).toBe('mypassword');
  });

  test('renders navigation links', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    );

    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });
});