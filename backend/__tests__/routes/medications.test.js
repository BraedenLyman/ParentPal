const request = require('supertest');
const express = require('express');
const medsRouter = require('../../routes/medications');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('../../middleware/validation', () => ({
  validateMedicationData: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/medications', medsRouter);

describe('Medications Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/medications', () => {
    test('returns all medication records when no baby_id provided', async () => {
      const mockRecords = [
        { med_id: 1, baby_id: 1, medication_name: 'Tylenol', dosage: '5ml', symptoms: 'Fever' },
      ];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/medications');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecords);
    });

    test('returns filtered medication records by baby_id', async () => {
      const mockRecords = [{ med_id: 1, baby_id: 1, medication_name: 'Tylenol' }];
      pool.query.mockResolvedValue({ rows: mockRecords });

      const response = await request(app).get('/api/medications?baby_id=1');

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM medications WHERE baby_id = $1', ['1']);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/medications');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch meds records' });
    });
  });

  describe('POST /api/medications', () => {
    const validRecord = {
      baby_id: 1,
      medication_name: 'Tylenol',
      time_taken: '10:00',
      date: '2024-01-01',
      dosage: '5ml',
      symptoms: 'Fever and headache',
      created_by_account_id: 1,
      created_by_first_name: 'John',
      created_by_last_name: 'Doe',
    };

    test('creates medication record successfully', async () => {
      const mockResponse = { ...validRecord, med_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .post('/api/medications')
        .send(validRecord);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 400 when baby_id is missing', async () => {
      const response = await request(app)
        .post('/api/medications')
        .send({ medication_name: 'Tylenol', time_taken: '10:00', date: '2024-01-01', dosage: '5ml', symptoms: 'Fever' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'baby_id, medication_name, time_taken, date, dosage and symptoms are required' });
    });

    test('returns 400 when medication_name is missing', async () => {
      const response = await request(app)
        .post('/api/medications')
        .send({ baby_id: 1, time_taken: '10:00', date: '2024-01-01', dosage: '5ml', symptoms: 'Fever' });

      expect(response.status).toBe(400);
    });

    test('returns 400 when time_taken is missing', async () => {
      const response = await request(app)
        .post('/api/medications')
        .send({ baby_id: 1, medication_name: 'Tylenol', date: '2024-01-01', dosage: '5ml', symptoms: 'Fever' });

      expect(response.status).toBe(400);
    });

    test('returns 400 when date is missing', async () => {
      const response = await request(app)
        .post('/api/medications')
        .send({ baby_id: 1, medication_name: 'Tylenol', time_taken: '10:00', dosage: '5ml', symptoms: 'Fever' });

      expect(response.status).toBe(400);
    });

    test('returns 400 when dosage is missing', async () => {
      const response = await request(app)
        .post('/api/medications')
        .send({ baby_id: 1, medication_name: 'Tylenol', time_taken: '10:00', date: '2024-01-01', symptoms: 'Fever' });

      expect(response.status).toBe(400);
    });

    test('returns 400 when symptoms is missing', async () => {
      const response = await request(app)
        .post('/api/medications')
        .send({ baby_id: 1, medication_name: 'Tylenol', time_taken: '10:00', date: '2024-01-01', dosage: '5ml' });

      expect(response.status).toBe(400);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/medications')
        .send(validRecord);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add meds record' });
    });
  });

  describe('PUT /api/medications/:med_id', () => {
    const validUpdate = {
      baby_id: 1,
      medication_name: 'Ibuprofen',
      time_taken: '11:00',
      date: '2024-01-02',
      dosage: '10ml',
      symptoms: 'Pain',
    };

    test('updates medication record successfully', async () => {
      const mockResponse = { ...validUpdate, med_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockResponse] });

      const response = await request(app)
        .put('/api/medications/1')
        .send(validUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    test('returns 404 when med_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/medications/999999')
        .send(validUpdate);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Medication record not found' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/medications/1')
        .send(validUpdate);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update meds record' });
    });
  });

  describe('DELETE /api/medications/:med_id', () => {
    test('deletes medication record successfully', async () => {
      pool.query.mockResolvedValue({ rows: [{ med_id: 1 }] });

      const response = await request(app).delete('/api/medications/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Medication record deleted successfully',
        med_id: 1,
      });
    });

    test('returns 404 when med_id not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/medications/999999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Medication record not found' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/medications/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete meds record' });
    });
  });
});
