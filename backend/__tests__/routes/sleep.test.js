const request = require('supertest');
const express = require('express');
const sleepRouter = require('../../routes/sleep');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('../../middleware/validation', () => ({
  validateSleepData: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/sleep', sleepRouter);

describe('Sleep Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/sleep', () => {
    test('returns all sleep records when no baby_id provided', async () => {
      const mockRecords = [
        { sleep_id: 1, baby_id: 1, sleep_duration: 8.5, time_fell_asleep: '20:00', date: '2024-01-01' },
      ];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/sleep');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecords);
    });

    test('returns filtered sleep records by baby_id', async () => {
      const mockRecords = [{ sleep_id: 1, baby_id: 1, sleep_duration: 8.5 }];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/sleep?baby_id=1');

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM sleep WHERE baby_id = $1', ['1']);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/sleep');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch sleep records' });
    });
  });

  describe('POST /api/sleep', () => {
    const validRecord = {
      baby_id: 1,
      sleep_duration: 8.5,
      time_fell_asleep: '20:00',
      date: '2024-01-01',
      created_by_account_id: 1,
      created_by_first_name: 'John',
      created_by_last_name: 'Doe',
    };

    test('creates sleep record successfully with all fields', async () => {
      const mockResponse = { ...validRecord, sleep_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/sleep')
        .send(validRecord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
    });

    test('creates sleep record without optional fields', async () => {
      const minimalRecord = {
        baby_id: 1,
        time_fell_asleep: '20:00',
        date: '2024-01-01',
      };
      const mockResponse = { ...minimalRecord, sleep_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/sleep')
        .send(minimalRecord);

      expect(response.status).toBe(201);
    });

    test('returns 400 when baby_id is missing', async () => {
      const response = await request(app)
        .post('/api/sleep')
        .send({ time_fell_asleep: '20:00', date: '2024-01-01' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id, time_fell_asleep, and date are required' });
    });

    test('returns 400 when time_fell_asleep is missing', async () => {
      const response = await request(app)
        .post('/api/sleep')
        .send({ baby_id: 1, date: '2024-01-01' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id, time_fell_asleep, and date are required' });
    });

    test('returns 400 when date is missing', async () => {
      const response = await request(app)
        .post('/api/sleep')
        .send({ baby_id: 1, time_fell_asleep: '20:00' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id, time_fell_asleep, and date are required' });
    });

    test('handles zero sleep duration', async () => {
      const record = { ...validRecord, sleep_duration: 0 };
      pool.query.mockResolvedValue({ rows: [record] });

      const response = await request(app).post('/api/sleep').send(record);

      expect(response.status).toBe(201);
    });

    test('handles negative sleep duration', async () => {
      const record = { ...validRecord, sleep_duration: -5 };
      pool.query.mockResolvedValue({ rows: [record] });

      const response = await request(app).post('/api/sleep').send(record);

      expect(response.status).toBe(201);
    });

    test('handles sleep duration > 24 hours', async () => {
      const record = { ...validRecord, sleep_duration: 48 };
      pool.query.mockResolvedValue({ rows: [record] });

      const response = await request(app).post('/api/sleep').send(record);

      expect(response.status).toBe(201);
    });

    test('handles future date', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const record = { ...validRecord, date: futureDate.toISOString() };
      pool.query.mockResolvedValue({ rows: [record] });

      const response = await request(app).post('/api/sleep').send(record);

      expect(response.status).toBe(201);
    });

    test('handles invalid time format', async () => {
      const record = { ...validRecord, time_fell_asleep: 'invalid-time' };
      pool.query.mockRejectedValue(new Error('Invalid time format'));

      const response = await request(app).post('/api/sleep').send(record);

      expect(response.status).toBe(500);
    });

    test('handles time_fell_asleep after current time', async () => {
      const futureTime = '23:59';
      const record = { ...validRecord, time_fell_asleep: futureTime };
      pool.query.mockResolvedValue({ rows: [record] });

      const response = await request(app).post('/api/sleep').send(record);

      expect(response.status).toBe(201);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/sleep')
        .send(validRecord);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add sleep record' });
    });

    test('handles foreign key violation', async () => {
      pool.query.mockRejectedValue({ code: '23503' });

      const response = await request(app)
        .post('/api/sleep')
        .send({ ...validRecord, baby_id: 999999 });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/sleep/:sleep_id', () => {
    const validUpdate = {
      baby_id: 1,
      sleep_duration: 9.0,
      time_fell_asleep: '21:00',
      date: '2024-01-02',
    };

    test('updates sleep record successfully', async () => {
      const mockResponse = { ...validUpdate, sleep_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .put('/api/sleep/1')
        .send(validUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 404 when sleep_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/sleep/999999')
        .send(validUpdate);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Sleep record not found' });
    });

    test('returns 400 when baby_id is missing', async () => {
      const { baby_id, ...incomplete } = validUpdate;
      const response = await request(app)
        .put('/api/sleep/1')
        .send(incomplete);

      expect(response.status).toBe(400);
    });

    test('returns 400 when time_fell_asleep is missing', async () => {
      const { time_fell_asleep, ...incomplete } = validUpdate;
      const response = await request(app)
        .put('/api/sleep/1')
        .send(incomplete);

      expect(response.status).toBe(400);
    });

    test('returns 400 when date is missing', async () => {
      const { date, ...incomplete } = validUpdate;
      const response = await request(app)
        .put('/api/sleep/1')
        .send(incomplete);

      expect(response.status).toBe(400);
    });

    test('handles invalid sleep_id format', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app)
        .put('/api/sleep/invalid')
        .send(validUpdate);

      expect(response.status).toBe(500);
    });

    test('handles negative sleep_id', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/sleep/-1')
        .send(validUpdate);

      expect(response.status).toBe(404);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/sleep/1')
        .send(validUpdate);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update sleep record' });
    });
  });

  describe('DELETE /api/sleep/:sleep_id', () => {
    test('deletes sleep record successfully', async () => {
      pool.query.mockResolvedValue({ rows: [{ sleep_id: 1 }] });

      const response = await request(app).delete('/api/sleep/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Sleep record deleted successfully',
        sleep_id: 1,
      });
    });

    test('returns 404 when sleep_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/sleep/999999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Sleep record not found' });
    });

    test('handles invalid sleep_id format', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app).delete('/api/sleep/invalid');

      expect(response.status).toBe(500);
    });

    test('handles SQL injection attempt', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/sleep/1%20OR%201=1');

      expect(response.status).toBe(404);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/sleep/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete sleep record' });
    });
  });
});
