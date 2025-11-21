const request = require('supertest');
const express = require('express');
const observationRouter = require('../../routes/observation');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('../../middleware/validation', () => ({
  validateObservationData: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/observation', observationRouter);

describe('Observation Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/observation', () => {
    test('returns all observation records when no baby_id provided', async () => {
      const mockRecords = [
        { observation_id: 1, baby_id: 1, priority_level: 'high', notes: 'Fever observed' },
      ];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/observation');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecords);
    });

    test('returns filtered observation records by baby_id', async () => {
      const mockRecords = [{ observation_id: 1, baby_id: 1, priority_level: 'medium' }];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/observation?baby_id=1');

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM observation WHERE baby_id = $1', ['1']);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/observation');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch observation records' });
    });
  });

  describe('POST /api/observation', () => {
    const validRecord = {
      baby_id: 1,
      priority_level: 'high',
      notes: 'Observed rash on arm',
      created_by_account_id: 1,
      created_by_first_name: 'John',
      created_by_last_name: 'Doe',
    };

    test('creates observation record successfully with all fields', async () => {
      const mockResponse = { ...validRecord, observation_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/observation')
        .send(validRecord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
    });

    test('creates observation record without optional fields', async () => {
      const minimalRecord = {
        baby_id: 1,
        priority_level: 'low',
      };
      const mockResponse = { ...minimalRecord, observation_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/observation')
        .send(minimalRecord);

      expect(response.status).toBe(201);
    });

    test('returns 400 when baby_id is missing', async () => {
      const response = await request(app)
        .post('/api/observation')
        .send({ priority_level: 'high', notes: 'Test observation' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id and priority_level are required' });
    });

    test('returns 400 when priority_level is missing', async () => {
      const response = await request(app)
        .post('/api/observation')
        .send({ baby_id: 1, notes: 'Test observation' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id and priority_level are required' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/observation')
        .send(validRecord);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add observation record' });
    });

    test('handles foreign key violation', async () => {
      pool.query.mockRejectedValue({ code: '23503' });

      const response = await request(app)
        .post('/api/observation')
        .send({ ...validRecord, baby_id: 999999 });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/observation/:observation_id', () => {
    const validUpdate = {
      baby_id: 1,
      priority_level: 'medium',
      notes: 'Updated observation notes',
    };

    test('updates observation record successfully', async () => {
      const mockResponse = { ...validUpdate, observation_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .put('/api/observation/1')
        .send(validUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 404 when observation_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/observation/999999')
        .send(validUpdate);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Observation record not found' });
    });

    test('returns 400 when baby_id is missing', async () => {
      const { baby_id, ...incomplete } = validUpdate;
      const response = await request(app)
        .put('/api/observation/1')
        .send(incomplete);

      expect(response.status).toBe(400);
    });

    test('returns 400 when priority_level is missing', async () => {
      const { priority_level, ...incomplete } = validUpdate;
      const response = await request(app)
        .put('/api/observation/1')
        .send(incomplete);

      expect(response.status).toBe(400);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/observation/1')
        .send(validUpdate);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update observation record' });
    });
  });

  describe('DELETE /api/observation/:observation_id', () => {
    test('deletes observation record successfully', async () => {
      pool.query.mockResolvedValue({ rows: [{ observation_id: 1 }] });

      const response = await request(app).delete('/api/observation/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Observation record deleted successfully',
        observation_id: 1,
      });
    });

    test('returns 404 when observation_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/observation/999999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Observation record not found' });
    });

    test('handles invalid observation_id format', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app).delete('/api/observation/invalid');

      expect(response.status).toBe(500);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/observation/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete observation record' });
    });
  });
});
