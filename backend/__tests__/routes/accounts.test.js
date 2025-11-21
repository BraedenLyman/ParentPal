const request = require('supertest');
const express = require('express');
const accountsRouter = require('../../routes/accounts');
const pool = require('../../db');

jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/api/accounts', accountsRouter);

describe('Accounts Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('POST /api/accounts', () => {
    const validAccount = {
      firebaseUid: 'test-firebase-uid-123',
      fName: 'John',
      lName: 'Doe',
      email: 'john.doe@example.com',
      accountType: 'parent',
      dob: '1990-01-01',
      gender: 'male',
    };

    test('creates account successfully without baby', async () => {
      pool.query.mockResolvedValue({ rows: [{ account_id: 1 }] });

      const response = await request(app)
        .post('/api/accounts')
        .send(validAccount);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ accountId: 1 });
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO account'),
        ['test-firebase-uid-123', 'John', 'Doe', 'john.doe@example.com', 'parent', '1990-01-01', 'male']
      );
    });

    test('creates account successfully with baby', async () => {
      const accountWithBaby = {
        ...validAccount,
        baby: {
          bFName: 'Emma',
          bLName: 'Doe',
          bDob: '2023-01-01',
          bGender: 'female',
        },
      };

      pool.query
        .mockResolvedValueOnce({ rows: [{ account_id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ baby_id: 1 }] });

      const response = await request(app)
        .post('/api/accounts')
        .send(accountWithBaby);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ accountId: 1 });
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('INSERT INTO baby'),
        [1, 'Emma', 'Doe', '2023-01-01', 'female']
      );
    });

    test('creates account without optional dob', async () => {
      const { dob, ...accountWithoutDob } = validAccount;
      pool.query.mockResolvedValue({ rows: [{ account_id: 1 }] });

      const response = await request(app)
        .post('/api/accounts')
        .send(accountWithoutDob);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ accountId: 1 });
    });

    test('creates account without optional gender', async () => {
      const { gender, ...accountWithoutGender } = validAccount;
      pool.query.mockResolvedValue({ rows: [{ account_id: 1 }] });

      const response = await request(app)
        .post('/api/accounts')
        .send(accountWithoutGender);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ accountId: 1 });
    });

    test('truncates gender to 7 characters', async () => {
      const accountWithLongGender = {
        ...validAccount,
        gender: 'very-long-gender-string',
      };
      pool.query.mockResolvedValue({ rows: [{ account_id: 1 }] });

      const response = await request(app)
        .post('/api/accounts')
        .send(accountWithLongGender);

      expect(response.status).toBe(201);
      expect(pool.query).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['very-lo'])
      );
    });

    test('returns 400 when firebaseUid is missing', async () => {
      const { firebaseUid, ...incomplete } = validAccount;
      const response = await request(app).post('/api/accounts').send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when fName is missing', async () => {
      const { fName, ...incomplete } = validAccount;
      const response = await request(app).post('/api/accounts').send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when lName is missing', async () => {
      const { lName, ...incomplete } = validAccount;
      const response = await request(app).post('/api/accounts').send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when email is missing', async () => {
      const { email, ...incomplete } = validAccount;
      const response = await request(app).post('/api/accounts').send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when accountType is missing', async () => {
      const { accountType, ...incomplete } = validAccount;
      const response = await request(app).post('/api/accounts').send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('handles database error during account creation', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/accounts')
        .send(validAccount);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to create account in DB' });
    });

    test('handles database error during baby creation', async () => {
      const accountWithBaby = {
        ...validAccount,
        baby: {
          bFName: 'Emma',
          bLName: 'Doe',
          bDob: '2023-01-01',
          bGender: 'female',
        },
      };

      pool.query
        .mockResolvedValueOnce({ rows: [{ account_id: 1 }] })
        .mockRejectedValueOnce(new Error('Baby insert failed'));

      const response = await request(app)
        .post('/api/accounts')
        .send(accountWithBaby);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to create account in DB' });
    });

    test('handles duplicate firebaseUid', async () => {
      pool.query.mockRejectedValue({ code: '23505', constraint: 'account_firebase_uid_key' });

      const response = await request(app)
        .post('/api/accounts')
        .send(validAccount);

      expect(response.status).toBe(500);
    });

    test('handles duplicate email', async () => {
      pool.query.mockRejectedValue({ code: '23505', constraint: 'account_email_key' });

      const response = await request(app)
        .post('/api/accounts')
        .send(validAccount);

      expect(response.status).toBe(500);
    });
  });
});
