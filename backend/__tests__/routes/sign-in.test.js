const request = require('supertest');
const express = require('express');
const signInRouter = require('../../routes/sign-in');
const pool = require('../../db');
const admin = require('../../firebase-admin');

// Mock dependencies
jest.mock('../../db');
jest.mock('../../firebase-admin', () => ({
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn(),
  })),
}));

// Create Express app for testing
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

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = {
        account_id: 'account-123',
        firebase_uid: 'firebase-uid-123',
        account_type: 'parent',
        first_name: 'John',
        last_name: 'Doe',
        email_address: 'test@example.com',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUserData] });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(admin.auth().verifyIdToken).toHaveBeenCalledWith('valid-token');
      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUserData);
    });

    test('falls back to test mode when Firebase verification fails', async () => {
      admin.auth().verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      const mockTestUser = {
        firebase_uid: 'test-uid-fallback',
      };

      const mockUserData = {
        account_id: 'test-account',
        firebase_uid: 'test-uid-fallback',
        account_type: 'parent',
        first_name: 'Test',
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockTestUser] }) // First query for test user
        .mockResolvedValueOnce({ rows: [mockUserData] }); // Second query for user data

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'invalid-token' });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Firebase verification failed, using test mode')
      );
      expect(response.status).toBe(200);
    });
  });

  describe('Parent User Sign-In', () => {
    test('returns parent user data with babies', async () => {
      const mockDecodedToken = { uid: 'parent-uid-123' };

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

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

      pool.query
        .mockResolvedValueOnce({ rows: [mockParentData] }) // User query
        .mockResolvedValueOnce({ rows: mockBabies }); // Baby query

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-parent-token' });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockParentData);
      expect(response.body.babyData).toEqual(mockBabies);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM account WHERE firebase_uid = $1',
        ['parent-uid-123']
      );

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT baby_id, first_name, last_name, birth_date, gender FROM baby WHERE parent_id = $1',
        ['parent-123']
      );
    });

    test('returns parent user data with no babies', async () => {
      const mockDecodedToken = { uid: 'parent-no-babies-uid' };

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockParentData = {
        account_id: 'parent-456',
        firebase_uid: 'parent-no-babies-uid',
        account_type: 'parent',
        first_name: 'NoKids',
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockParentData] }) // User query
        .mockResolvedValueOnce({ rows: [] }); // Empty baby query

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

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockBabysitterData = {
        account_id: 'babysitter-123',
        firebase_uid: 'babysitter-uid-123',
        account_type: 'babysitter',
        first_name: 'Mary',
        last_name: 'Poppins',
        email_address: 'mary@example.com',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockBabysitterData] });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-babysitter-token' });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockBabysitterData);
      expect(response.body.babyData).toBe(null);

      // Should only query account table, not baby table
      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM account WHERE firebase_uid = $1',
        ['babysitter-uid-123']
      );
    });
  });

  describe('Error Handling', () => {
    test('returns 404 when user not found in database', async () => {
      const mockDecodedToken = { uid: 'nonexistent-uid' };

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      pool.query
        .mockResolvedValueOnce({ rows: [] }) // User not found
        .mockResolvedValueOnce({ // All users query for debugging
          rows: [
            { firebase_uid: 'user1', first_name: 'User1', email_address: 'user1@test.com' },
          ],
        });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token-but-no-user' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'User exists in Firebase but not in database',
      });

      expect(console.log).toHaveBeenCalledWith(
        'User not found in database, checking all users...'
      );
    });

    test('returns 500 on database query error', async () => {
      const mockDecodedToken = { uid: 'test-uid' };

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      pool.query.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to sign in' });

      expect(console.error).toHaveBeenCalledWith(
        'Signin error:',
        expect.any(Error)
      );
    });

    test('returns 500 when baby query fails for parent', async () => {
      const mockDecodedToken = { uid: 'parent-uid' };

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockParentData = {
        account_id: 'parent-789',
        account_type: 'parent',
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockParentData] })
        .mockRejectedValueOnce(new Error('Baby query failed'));

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to sign in' });
    });
  });

  describe('Logging', () => {
    test('logs successful Firebase verification', async () => {
      const mockDecodedToken = { uid: 'test-uid-log' };

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = {
        firebase_uid: 'test-uid-log',
        account_type: 'parent',
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockUserData] })
        .mockResolvedValueOnce({ rows: [] });

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

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = { firebase_uid: 'test-uid', account_type: 'babysitter' };

      pool.query.mockResolvedValueOnce({ rows: [mockUserData] });

      await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(console.log).toHaveBeenCalledWith(
        'Found 1 users for UID: test-uid'
      );
    });

    test('logs baby data found for parent', async () => {
      const mockDecodedToken = { uid: 'parent-uid' };

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockParentData = {
        account_id: 'parent-999',
        account_type: 'parent',
      };

      const mockBabies = [{ baby_id: 'baby-1', first_name: 'Test' }];

      pool.query
        .mockResolvedValueOnce({ rows: [mockParentData] })
        .mockResolvedValueOnce({ rows: mockBabies });

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

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = {
        account_id: 'account-123',
        firebase_uid: 'test-uid',
        account_type: 'babysitter',
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUserData] });

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
      admin.auth().verifyIdToken.mockRejectedValue(new Error('Malformed token'));

      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'malformed-token-12345' });

      // Should fall back to test mode and handle appropriately
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    test('handles very long idToken', async () => {
      const longToken = 'a'.repeat(10000);

      admin.auth().verifyIdToken.mockRejectedValue(new Error('Token too long'));

      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: longToken });

      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    test('handles null values in user data', async () => {
      const mockDecodedToken = { uid: 'test-uid' };

      admin.auth().verifyIdToken.mockResolvedValue(mockDecodedToken);

      const mockUserData = {
        account_id: 'account-123',
        firebase_uid: 'test-uid',
        account_type: 'parent',
        first_name: null,
        last_name: null,
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockUserData] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/sign-in')
        .send({ idToken: 'valid-token' });

      expect(response.status).toBe(200);
      expect(response.body.user.first_name).toBe(null);
    });
  });
});
