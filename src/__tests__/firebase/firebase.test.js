import { app } from '../../firebase/firebase';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({ name: 'mock-app' })),
}));

describe('Firebase Configuration', () => {
  test('exports firebase app', () => {
    expect(app).toBeDefined();
  });

  test('firebase app has correct structure', () => {
    expect(app).toHaveProperty('name');
  });
});
