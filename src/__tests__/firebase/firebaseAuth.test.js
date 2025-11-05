jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({ name: 'mock-auth' })),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: 'LOCAL',
}));

jest.mock('../../firebase/firebase', () => ({
  app: { name: 'mock-app' },
}));

import { auth } from '../../firebase/firebaseAuth';

describe('Firebase Auth Configuration', () => {
  test('exports auth object', () => {
    expect(auth).toBeDefined();
  });

  test('auth has correct structure', () => {
    expect(auth).toHaveProperty('name');
  });
});
