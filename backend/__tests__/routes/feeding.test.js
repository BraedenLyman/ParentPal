const request = require('supertest');
const express = require('express');
const feedingRouter = require('../../routes/feeding');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('../../middleware/validation', () => ({
  validateFeedingData: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/feeding', feedingRouter);

describe('Feeding Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/feeding', () => {
    test('returns all feeding records when no baby_id provided', async () => {
      const mockRecords = [
        { feeding_id: 1, baby_id: 1, time_fed: '10:00', date: '2024-01-01', fed_from: 'bottle', type_of_food: 'formula' },
      ];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/feeding');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecords);
    });

    test('returns filtered feeding records by baby_id', async () => {
      const mockRecords = [{ feeding_id: 1, baby_id: 1, time_fed: '10:00' }];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/feeding?baby_id=1');

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM feeding WHERE baby_id = $1', ['1']);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/feeding');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch feeding records' });
    });
  });

  describe('POST /api/feeding', () => {
    const validRecord = {
      baby_id: 1,
      time_fed: '10:00',
      date: '2024-01-01',
      fed_from: 'bottle',
      type_of_food: 'formula',
      amount: 6,
      notes: 'Fed well',
      created_by_account_id: 1,
      created_by_first_name: 'John',
      created_by_last_name: 'Doe',
    };

    test('creates feeding record successfully with all fields', async () => {
      const mockResponse = { ...validRecord, feeding_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/feeding')
        .send(validRecord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
    });

    test('creates feeding record without optional fields', async () => {
      const minimalRecord = {
        baby_id: 1,
        time_fed: '10:00',
        date: '2024-01-01',
        fed_from: 'bottle',
        type_of_food: 'formula',
      };
      const mockResponse = { ...minimalRecord, feeding_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/feeding')
        .send(minimalRecord);

      expect(response.status).toBe(201);
    });

    test('returns 400 when baby_id is missing', async () => {
      const response = await request(app)
        .post('/api/feeding')
        .send({ time_fed: '10:00', date: '2024-01-01', fed_from: 'bottle', type_of_food: 'formula' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id, time_fed, date, fed_from, and type_of_food are required' });
    });

    test('returns 400 when time_fed is missing', async () => {
      const response = await request(app)
        .post('/api/feeding')
        .send({ baby_id: 1, date: '2024-01-01', fed_from: 'bottle', type_of_food: 'formula' });

      expect(response.status).toBe(400);
    });

    test('returns 400 when date is missing', async () => {
      const response = await request(app)
        .post('/api/feeding')
        .send({ baby_id: 1, time_fed: '10:00', fed_from: 'bottle', type_of_food: 'formula' });

      expect(response.status).toBe(400);
    });

    test('returns 400 when fed_from is missing', async () => {
      const response = await request(app)
        .post('/api/feeding')
        .send({ baby_id: 1, time_fed: '10:00', date: '2024-01-01', type_of_food: 'formula' });

      expect(response.status).toBe(400);
    });

    test('returns 400 when type_of_food is missing', async () => {
      const response = await request(app)
        .post('/api/feeding')
        .send({ baby_id: 1, time_fed: '10:00', date: '2024-01-01', fed_from: 'bottle' });

      expect(response.status).toBe(400);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/feeding')
        .send(validRecord);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add feeding record' });
    });
  });

  describe('PUT /api/feeding/:feeding_id', () => {
    const validUpdate = {
      baby_id: 1,
      time_fed: '11:00',
      date: '2024-01-02',
      fed_from: 'breast',
      type_of_food: 'breast milk',
      amount: 8,
      notes: 'Good feeding',
    };

    test('updates feeding record successfully', async () => {
      const mockResponse = { ...validUpdate, feeding_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .put('/api/feeding/1')
        .send(validUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 404 when feeding_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/feeding/999999')
        .send(validUpdate);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Feeding record not found' });
    });

    test('returns 400 when required fields are missing', async () => {
      const { baby_id, ...incomplete } = validUpdate;
      const response = await request(app)
        .put('/api/feeding/1')
        .send(incomplete);

      expect(response.status).toBe(400);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/feeding/1')
        .send(validUpdate);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update feeding record' });
    });
  });

  describe('DELETE /api/feeding/:feeding_id', () => {
    test('deletes feeding record successfully', async () => {
      pool.query.mockResolvedValue({ rows: [{ feeding_id: 1 }] });

      const response = await request(app).delete('/api/feeding/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Feeding record deleted successfully',
        feeding_id: 1,
      });
    });

    test('returns 404 when feeding_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/feeding/999999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Feeding record not found' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/feeding/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete feeding record' });
    });
  });
});
