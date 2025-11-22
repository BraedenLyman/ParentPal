const request = require('supertest');
const express = require('express');
const signInRouter = require('../../routes/sign-in');
const pool = require('../../db');
const admin = require('../../firebase-admin');

jest.mock('../../db');

// Create a persistent mock for verifyIdToken
const mockVerifyIdToken = jest.fn();
jest.mock('../../firebase-admin', () => ({
  apps: [{ name: 'mock-app' }], // Mock apps array to indicate Firebase is initialized
  auth: jest.fn(() => ({
    verifyIdToken: mockVerifyIdToken,
  })),
}));

const app = express();
app.use(express.json());
app.use('/api/sign-in', signInRouter);

describe('POST /api/sign-in', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('Validation', () => {
    test('returns 400 when idToken is missing', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing ID token' });
    });

    test('returns 400 when idToken is null', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: null });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing ID token' });
    });

    test('returns 400 when idToken is empty string', async () => {
      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing ID token' });
    });
  });

  describe('Firebase Token Verification', () => {
    test('successfully verifies valid Firebase token', async () => {
      const mockDecodedToken = {
        uid: 'firebase-uid-123',
        email: 'test@example.com',
      };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = {
        account_id: 'account-123',
        firebase_uid: 'firebase-uid-123',
        account_type: 'parent',
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'test@example.com',
      };

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [mockUserData] })
        .mockResolvedValueOnce({ rows: [] });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-token');
      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUserData);
    });

    test('returns 401 when Firebase verification fails', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'invalid-token' });

      expect(console.log).toHaveBeenCalledWith(
        'Firebase verification failed:',
        'Invalid token'
      );
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid Firebase token' });
    });
  });

  describe('Parent User Sign-In', () => {
    test('returns parent user data with babies', async () => {
      const mockDecodedToken = { uid: 'parent-uid-123' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockParentData = {
        account_id: 'parent-123',
        firebase_uid: 'parent-uid-123',
        account_type: 'parent',
        first_name: 'Jane',
        last_name: 'Smith',
        email_address: 'jane@example.com',
      };

      const mockBabies = [
        {
          baby_id: 'baby-1',
          first_name: 'Alice',
          last_name: 'Smith',
          birth_date: '2023-01-01',
          gender: 'female',
        },
        {
          baby_id: 'baby-2',
          first_name: 'Bob',
          last_name: 'Smith',
          birth_date: '2023-06-15',
          gender: 'male',
        },
      ];

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [mockParentData] })
        .mockResolvedValueOnce({ rows: mockBabies });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-parent-token' });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockParentData);
      expect(response.body.babyData).toEqual(mockBabies);

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM account WHERE firebase_uid = $1',
        ['parent-uid-123']
      );

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT baby_id, first_name, last_name, birth_date, gender FROM baby WHERE parent_id = $1',
        ['parent-123']
      );
    });

    test('returns parent user data with no babies', async () => {
      const mockDecodedToken = { uid: 'parent-no-babies-uid' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockParentData = {
        account_id: 'parent-456',
        firebase_uid: 'parent-no-babies-uid',
        account_type: 'parent',
        first_name: 'NoKids',
      };

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [mockParentData] })
        .mockResolvedValueOnce({ rows: [] });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockParentData);
      expect(response.body.babyData).toEqual([]);

      expect(console.log).toHaveBeenCalledWith(
        'Backend: No baby data found for parent_id:',
        'parent-456'
      );
    });
  });

  describe('Babysitter User Sign-In', () => {
    test('returns babysitter user data without baby query', async () => {
      const mockDecodedToken = { uid: 'babysitter-uid-123' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockBabysitterData = {
        account_id: 'babysitter-123',
        firebase_uid: 'babysitter-uid-123',
        account_type: 'babysitter',
        first_name: 'Mary',
        last_name: 'Poppins',
        email_address: 'mary@example.com',
      };

      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [mockBabysitterData] });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-babysitter-token' });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockBabysitterData);
      expect(response.body.babyData).toBe(null);
      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM account WHERE firebase_uid = $1',
        ['babysitter-uid-123']
      );
    });
  });

  describe('Error Handling', () => {
    test('returns 404 when user not found in database', async () => {
      const mockDecodedToken = { uid: 'nonexistent-uid' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [] });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token-but-no-user' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'User exists in Firebase but not in database',
      });

      expect(console.log).toHaveBeenCalledWith(
        'User not found in database'
      );
    });

    test('returns 500 on database query error', async () => {
      const mockDecodedToken = { uid: 'test-uid' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockRelease = jest.fn();
      pool.connect = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(response.status).toBe(500);
      expect(response.body.error).toEqual('Failed to sign in');

      expect(console.error).toHaveBeenCalledWith(
        'Signin error:',
        expect.any(Error)
      );
    });

    test('returns 500 when baby query fails for parent', async () => {
      const mockDecodedToken = { uid: 'parent-uid' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockParentData = {
        account_id: 'parent-789',
        account_type: 'parent',
      };

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [mockParentData] })
        .mockRejectedValueOnce(new Error('Baby query failed'));

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(response.status).toBe(500);
      expect(response.body.error).toEqual('Failed to sign in');
    });
  });

  describe('Logging', () => {
    test('logs successful Firebase verification', async () => {
      const mockDecodedToken = { uid: 'test-uid-log' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = {
        firebase_uid: 'test-uid-log',
        account_type: 'parent',
      };

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [mockUserData] })
        .mockResolvedValueOnce({ rows: [] });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(console.log).toHaveBeenCalledWith(
        'Firebase verification successful for UID:',
        'test-uid-log'
      );
    });

    test('logs user count found', async () => {
      const mockDecodedToken = { uid: 'test-uid' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = { firebase_uid: 'test-uid', account_type: 'babysitter' };

      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [mockUserData] });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(console.log).toHaveBeenCalledWith(
        'Found 1 users for UID: test-uid'
      );
    });

    test('logs baby data found for parent', async () => {
      const mockDecodedToken = { uid: 'parent-uid' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockParentData = {
        account_id: 'parent-999',
        account_type: 'parent',
      };

      const mockBabies = [{ baby_id: 'baby-1', first_name: 'Test' }];

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [mockParentData] })
        .mockResolvedValueOnce({ rows: mockBabies });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(console.log).toHaveBeenCalledWith(
        'Backend found baby data:',
        mockBabies
      );
    });
  });

  describe('Response Structure', () => {
    test('returns correct response structure', async () => {
      const mockDecodedToken = { uid: 'test-uid' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = {
        account_id: 'account-123',
        firebase_uid: 'test-uid',
        account_type: 'babysitter',
      };

      const mockQuery = jest.fn().mockResolvedValueOnce({ rows: [mockUserData] });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('babyData');
      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Edge Cases', () => {
    test('handles malformed idToken gracefully', async () => {
      mockVerifyIdToken.mockRejectedValue(new Error('Malformed token'));

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'malformed-token-12345' });

      expect(response.status).toBe(401);
    });

    test('handles very long idToken', async () => {
      const longToken = 'a'.repeat(10000);

      mockVerifyIdToken.mockRejectedValue(new Error('Token too long'));

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: longToken });

      expect(response.status).toBe(401);
    });

    test('handles null values in user data', async () => {
      const mockDecodedToken = { uid: 'test-uid' };

      mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = {
        account_id: 'account-123',
        firebase_uid: 'test-uid',
        account_type: 'parent',
        first_name: null,
        last_name: null,
      };

      const mockQuery = jest.fn()
        .mockResolvedValueOnce({ rows: [mockUserData] })
        .mockResolvedValueOnce({ rows: [] });

      pool.connect = jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(response.status).toBe(200);
      expect(response.body.user.first_name).toBe(null);
    });
  });
});
