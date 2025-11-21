const request = require('supertest');
const express = require('express');
const vaccinationsRouter = require('../../routes/vaccinations');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('../../middleware/validation', () => ({
  validateVaccinationData: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/vaccinations', vaccinationsRouter);

describe('Vaccinations Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/vaccinations', () => {
    test('returns all vaccination records when no baby_id provided', async () => {
      const mockRecords = [
        { vaccine_id: 1, baby_id: 1, vaccination_name: 'MMR', date_of_vaccine: '2024-01-01' },
      ];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/vaccinations');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecords);
    });

    test('returns filtered vaccination records by baby_id', async () => {
      const mockRecords = [{ vaccine_id: 1, baby_id: 1, vaccination_name: 'MMR' }];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/vaccinations?baby_id=1');

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM vaccinations WHERE baby_id = $1', ['1']);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/vaccinations');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch vaccinations records' });
    });
  });

  describe('POST /api/vaccinations', () => {
    const validRecord = {
      baby_id: 1,
      vaccination_name: 'MMR',
      date_of_vaccine: '2024-01-01',
      created_by_account_id: 1,
      created_by_first_name: 'John',
      created_by_last_name: 'Doe',
    };

    test('creates vaccination record successfully', async () => {
      const mockResponse = { ...validRecord, vaccine_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/vaccinations')
        .send(validRecord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
    });

    test('creates vaccination record without optional vaccination_name', async () => {
      const minimalRecord = {
        baby_id: 1,
        date_of_vaccine: '2024-01-01',
      };
      const mockResponse = { ...minimalRecord, vaccine_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/vaccinations')
        .send(minimalRecord);

      expect(response.status).toBe(201);
    });

    test('returns 400 when baby_id is missing', async () => {
      const response = await request(app)
        .post('/api/vaccinations')
        .send({ vaccination_name: 'MMR', date_of_vaccine: '2024-01-01' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id and date_of_vaccine are required' });
    });

    test('returns 400 when date_of_vaccine is missing', async () => {
      const response = await request(app)
        .post('/api/vaccinations')
        .send({ baby_id: 1, vaccination_name: 'MMR' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id and date_of_vaccine are required' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/vaccinations')
        .send(validRecord);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add vaccination record' });
    });
  });

  describe('PUT /api/vaccinations/:vaccine_id', () => {
    const validUpdate = {
      baby_id: 1,
      vaccination_name: 'Hepatitis B',
      date_of_vaccine: '2024-01-02',
    };

    test('updates vaccination record successfully', async () => {
      const mockResponse = { ...validUpdate, vaccine_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .put('/api/vaccinations/1')
        .send(validUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 404 when vaccine_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/vaccinations/999999')
        .send(validUpdate);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Vaccination record not found' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/vaccinations/1')
        .send(validUpdate);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update vaccination record' });
    });
  });

  describe('DELETE /api/vaccinations/:vaccine_id', () => {
    test('deletes vaccination record successfully', async () => {
      pool.query.mockResolvedValue({ rows: [{ vaccine_id: 1 }] });

      const response = await request(app).delete('/api/vaccinations/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Vaccination record deleted successfully',
        vaccine_id: 1,
      });
    });

    test('returns 404 when vaccine_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/vaccinations/999999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Vaccination record not found' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/vaccinations/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete vaccination record' });
    });
  });
});
