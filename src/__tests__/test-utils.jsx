import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';

// Reusable test wrapper that all components can use
export const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <HeroUIProvider>
      {children}
    </HeroUIProvider>
  </BrowserRouter>
);

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, {
    wrapper: TestWrapper,
    ...options,
  });
};

// Common mock functions
export const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

// Common test data
export const mockBabyData = {
  baby_id: 'test-baby-123',
  name: 'Test Baby',
  birthdate: '2024-01-01'
};

export const mockUserData = {
  uid: 'test-user-123',
  email: 'test@example.com'
};