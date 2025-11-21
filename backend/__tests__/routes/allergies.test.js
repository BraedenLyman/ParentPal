const request = require('supertest');
const express = require('express');
const allergiesRouter = require('../../routes/allergies');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('../../middleware/validation', () => ({
  validateAllergyData: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/allergies', allergiesRouter);

describe('Allergies Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/allergies', () => {
    test('returns all allergy records when no baby_id provided', async () => {
      const mockRecords = [
        { allergy_id: 1, baby_id: 1, allergy_name: 'Peanuts', severity: 'severe', epi_pen: true },
      ];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/allergies');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecords);
    });

    test('returns filtered allergy records by baby_id', async () => {
      const mockRecords = [{ allergy_id: 1, baby_id: 1, allergy_name: 'Milk' }];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/allergies?baby_id=1');

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM allergies WHERE baby_id = $1', ['1']);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/allergies');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch allergies records' });
    });
  });

  describe('POST /api/allergies', () => {
    const validRecord = {
      baby_id: 1,
      allergy_name: 'Peanuts',
      severity: 'severe',
      epi_pen: true,
      notes: 'Causes anaphylaxis',
      created_by_account_id: 1,
      created_by_first_name: 'John',
      created_by_last_name: 'Doe',
    };

    test('creates allergy record successfully', async () => {
      const mockResponse = { ...validRecord, allergy_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/allergies')
        .send(validRecord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 400 when baby_id is missing', async () => {
      const response = await request(app)
        .post('/api/allergies')
        .send({ allergy_name: 'Peanuts', severity: 'severe', epi_pen: true });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id, allergy_name, severity, and epi_pen are required' });
    });

    test('returns 400 when allergy_name is missing', async () => {
      const response = await request(app)
        .post('/api/allergies')
        .send({ baby_id: 1, severity: 'severe', epi_pen: true });

      expect(response.status).toBe(400);
    });

    test('returns 400 when severity is missing', async () => {
      const response = await request(app)
        .post('/api/allergies')
        .send({ baby_id: 1, allergy_name: 'Peanuts', epi_pen: true });

      expect(response.status).toBe(400);
    });

    test('returns 400 when epi_pen is missing', async () => {
      const response = await request(app)
        .post('/api/allergies')
        .send({ baby_id: 1, allergy_name: 'Peanuts', severity: 'severe' });

      expect(response.status).toBe(400);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/allergies')
        .send(validRecord);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add allergies record' });
    });
  });

  describe('PUT /api/allergies/:allergy_id', () => {
    const validUpdate = {
      baby_id: 1,
      allergy_name: 'Milk',
      severity: 'moderate',
      epi_pen: false,
      notes: 'Updated notes',
    };

    test('updates allergy record successfully', async () => {
      const mockResponse = { ...validUpdate, allergy_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .put('/api/allergies/1')
        .send(validUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 404 when allergy_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/allergies/999999')
        .send(validUpdate);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Allergy record not found' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/allergies/1')
        .send(validUpdate);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update allergies record' });
    });
  });

  describe('DELETE /api/allergies/:allergy_id', () => {
    test('deletes allergy record successfully', async () => {
      pool.query.mockResolvedValue({ rows: [{ allergy_id: 1 }] });

      const response = await request(app).delete('/api/allergies/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Allergy record deleted successfully',
        allergy_id: 1,
      });
    });

    test('returns 404 when allergy_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/allergies/999999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Allergy record not found' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/allergies/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete allergies record' });
    });
  });
});
