const request = require('supertest');
const express = require('express');
const sickdayRouter = require('../../routes/sickday');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('../../middleware/validation', () => ({
  validateSickDayData: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/sickday', sickdayRouter);

describe('Sick Day Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/sickday', () => {
    test('returns all sick day records when no baby_id provided', async () => {
      const mockRecords = [
        { sick_id: 1, baby_id: 1, date: '2024-01-01', meds_taken: 'Tylenol', temp: 101.5 },
      ];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/sickday');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecords);
    });

    test('returns filtered sick day records by baby_id', async () => {
      const mockRecords = [{ sick_id: 1, baby_id: 1, date: '2024-01-01' }];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/sickday?baby_id=1');

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM sick_day WHERE baby_id = $1', ['1']);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/sickday');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch sick day records' });
    });
  });

  describe('POST /api/sickday', () => {
    const validRecord = {
      baby_id: 1,
      date: '2024-01-01',
      meds_taken: 'Tylenol 5ml',
      temp: 101.5,
      created_by_account_id: 1,
      created_by_first_name: 'John',
      created_by_last_name: 'Doe',
    };

    test('creates sick day record successfully with all fields', async () => {
      const mockResponse = { ...validRecord, sick_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/sickday')
        .send(validRecord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
    });

    test('creates sick day record without optional fields', async () => {
      const minimalRecord = {
        baby_id: 1,
        date: '2024-01-01',
      };
      const mockResponse = { ...minimalRecord, sick_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/sickday')
        .send(minimalRecord);

      expect(response.status).toBe(201);
    });

    test('returns 400 when baby_id is missing', async () => {
      const response = await request(app)
        .post('/api/sickday')
        .send({ date: '2024-01-01', meds_taken: 'Tylenol', temp: 101.5 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id and date are required' });
    });

    test('returns 400 when date is missing', async () => {
      const response = await request(app)
        .post('/api/sickday')
        .send({ baby_id: 1, meds_taken: 'Tylenol', temp: 101.5 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id and date are required' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/sickday')
        .send(validRecord);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add sick day record' });
    });

    test('handles foreign key violation', async () => {
      pool.query.mockRejectedValue({ code: '23503' });

      const response = await request(app)
        .post('/api/sickday')
        .send({ ...validRecord, baby_id: 999999 });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/sickday/:sick_id', () => {
    const validUpdate = {
      baby_id: 1,
      date: '2024-01-02',
      meds_taken: 'Ibuprofen 10ml',
      temp: 100.5,
    };

    test('updates sick day record successfully', async () => {
      const mockResponse = { ...validUpdate, sick_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .put('/api/sickday/1')
        .send(validUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 404 when sick_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/sickday/999999')
        .send(validUpdate);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Sick day record not found' });
    });

    test('returns 400 when baby_id is missing', async () => {
      const { baby_id, ...incomplete } = validUpdate;
      const response = await request(app)
        .put('/api/sickday/1')
        .send(incomplete);

      expect(response.status).toBe(400);
    });

    test('returns 400 when date is missing', async () => {
      const { date, ...incomplete } = validUpdate;
      const response = await request(app)
        .put('/api/sickday/1')
        .send(incomplete);

      expect(response.status).toBe(400);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/sickday/1')
        .send(validUpdate);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update sick day record' });
    });
  });

  describe('DELETE /api/sickday/:sick_id', () => {
    test('deletes sick day record successfully', async () => {
      pool.query.mockResolvedValue({ rows: [{ sick_id: 1 }] });

      const response = await request(app).delete('/api/sickday/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Sick day record deleted successfully',
        sick_id: 1,
      });
    });

    test('returns 404 when sick_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/sickday/999999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Sick day record not found' });
    });

    test('handles invalid sick_id format', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app).delete('/api/sickday/invalid');

      expect(response.status).toBe(500);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/sickday/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete sick day record' });
    });
  });
});
