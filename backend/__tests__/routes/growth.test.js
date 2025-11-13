const request = require('supertest');
const express = require('express');
const growthRouter = require('../../routes/growth');
const pool = require('../../db');

jest.mock('../../db');
jest.mock('../../middleware/validation', () => ({
  validateGrowthData: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/api/growth', growthRouter);

describe('Growth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/growth', () => {
    describe('Success Cases', () => {
      test('returns all growth records when no baby_id provided', async () => {
        const mockRecords = [
          { growth_id: 1, baby_id: 1, weight: 10.5, height: 55, date: '2024-01-01' },
          { growth_id: 2, baby_id: 2, weight: 12.3, height: 60, date: '2024-01-02' },
        ];

        pool.query.mockResolvedValue({ rows: mockRecords });

        const response = await request(app).get('/api/growth');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRecords);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM growth', []);
      });

      test('returns filtered growth records when baby_id provided', async () => {
        const mockRecords = [
          { growth_id: 1, baby_id: 1, weight: 10.5, height: 55, date: '2024-01-01' },
        ];

        pool.query.mockResolvedValue({ rows: mockRecords });

        const response = await request(app).get('/api/growth?baby_id=1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRecords);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM growth WHERE baby_id = $1', ['1']);
      });

      test('returns empty array when no records found', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).get('/api/growth?baby_id=999');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });
    });

    describe('Edge Cases', () => {
      test('handles invalid baby_id (non-numeric)', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).get('/api/growth?baby_id=invalid');

        expect(response.status).toBe(200);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM growth WHERE baby_id = $1', ['invalid']);
      });

      test('handles baby_id as string number', async () => {
        const mockRecords = [{ growth_id: 1, baby_id: 123, weight: 10.5, height: 55, date: '2024-01-01' }];
        pool.query.mockResolvedValue({ rows: mockRecords });

        const response = await request(app).get('/api/growth?baby_id=123');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockRecords);
      });

      test('handles negative baby_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).get('/api/growth?baby_id=-1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      test('handles very large baby_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).get('/api/growth?baby_id=999999999999');

        expect(response.status).toBe(200);
      });

      test('handles SQL injection attempt in baby_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).get('/api/growth?baby_id=1%20OR%201=1');

        expect(response.status).toBe(200);
        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM growth WHERE baby_id = $1', ['1 OR 1=1']);
      });
    });

    describe('Error Cases', () => {
      test('handles database connection error', async () => {
        pool.query.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app).get('/api/growth');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch growth records' });
        expect(console.error).toHaveBeenCalledWith('Error fetching growth records: ', expect.any(Error));
      });

      test('handles database timeout', async () => {
        pool.query.mockRejectedValue(new Error('Query timeout'));

        const response = await request(app).get('/api/growth?baby_id=1');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch growth records' });
      });
    });
  });

  describe('POST /api/growth', () => {
    describe('Success Cases', () => {
      test('creates growth record with all fields', async () => {
        const newRecord = {
          baby_id: 1,
          weight: 10.5,
          height: 55.5,
          date: '2024-01-01',
        };

        const mockResponse = { ...newRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockResponse);
        expect(pool.query).toHaveBeenCalledWith(
          'INSERT INTO growth (baby_id, weight, height, date) VALUES ($1, $2, $3, $4) RETURNING *',
          [1, 10.5, 55.5, '2024-01-01']
        );
      });

      test('creates growth record without optional weight', async () => {
        const newRecord = {
          baby_id: 1,
          height: 55.5,
          date: '2024-01-01',
        };

        const mockResponse = { ...newRecord, growth_id: 1, weight: null };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockResponse);
      });

      test('creates growth record without optional height', async () => {
        const newRecord = {
          baby_id: 1,
          weight: 10.5,
          date: '2024-01-01',
        };

        const mockResponse = { ...newRecord, growth_id: 1, height: null };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
      });
    });

    describe('Validation Edge Cases', () => {
      test('returns 400 when baby_id is missing', async () => {
        const response = await request(app)
          .post('/api/growth')
          .send({ weight: 10.5, height: 55, date: '2024-01-01' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'baby_id and date are required' });
      });

      test('returns 400 when date is missing', async () => {
        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: 1, weight: 10.5, height: 55 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'baby_id and date are required' });
      });

      test('returns 400 when baby_id is null', async () => {
        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: null, weight: 10.5, height: 55, date: '2024-01-01' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'baby_id and date are required' });
      });

      test('returns 400 when date is null', async () => {
        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: 1, weight: 10.5, height: 55, date: null });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'baby_id and date are required' });
      });

      test('returns 400 when baby_id is empty string', async () => {
        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: '', weight: 10.5, height: 55, date: '2024-01-01' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'baby_id and date are required' });
      });

      test('returns 400 when date is empty string', async () => {
        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: 1, weight: 10.5, height: 55, date: '' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'baby_id and date are required' });
      });
    });

    describe('Data Edge Cases', () => {
      test('handles zero weight', async () => {
        const newRecord = { baby_id: 1, weight: 0, height: 55, date: '2024-01-01' };
        const mockResponse = { ...newRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
      });

      test('handles zero height', async () => {
        const newRecord = { baby_id: 1, weight: 10.5, height: 0, date: '2024-01-01' };
        const mockResponse = { ...newRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
      });

      test('handles negative weight', async () => {
        const newRecord = { baby_id: 1, weight: -5, height: 55, date: '2024-01-01' };
        const mockResponse = { ...newRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
      });

      test('handles extremely large weight value', async () => {
        const newRecord = { baby_id: 1, weight: 999999, height: 55, date: '2024-01-01' };
        const mockResponse = { ...newRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
      });

      test('handles extremely large height value', async () => {
        const newRecord = { baby_id: 1, weight: 10.5, height: 999999, date: '2024-01-01' };
        const mockResponse = { ...newRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
      });

      test('handles decimal precision in weight', async () => {
        const newRecord = { baby_id: 1, weight: 10.123456789, height: 55, date: '2024-01-01' };
        const mockResponse = { ...newRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
      });

      test('handles future date', async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);
        const newRecord = { baby_id: 1, weight: 10.5, height: 55, date: futureDate.toISOString() };
        const mockResponse = { ...newRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .post('/api/growth')
          .send(newRecord);

        expect(response.status).toBe(201);
      });

      test('handles invalid date format', async () => {
        pool.query.mockRejectedValue(new Error('Invalid date format'));

        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: 1, weight: 10.5, height: 55, date: 'invalid-date' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to add growth record' });
      });

      test('handles non-existent baby_id (foreign key violation)', async () => {
        pool.query.mockRejectedValue({ code: '23503', message: 'Foreign key violation' });

        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: 999999, weight: 10.5, height: 55, date: '2024-01-01' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to add growth record' });
      });
    });

    describe('Error Cases', () => {
      test('handles database connection error', async () => {
        pool.query.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: 1, weight: 10.5, height: 55, date: '2024-01-01' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to add growth record' });
        expect(console.error).toHaveBeenCalledWith('Error adding growth record:', expect.any(Error));
      });

      test('handles duplicate entry attempt', async () => {
        pool.query.mockRejectedValue({ code: '23505', message: 'Duplicate entry' });

        const response = await request(app)
          .post('/api/growth')
          .send({ baby_id: 1, weight: 10.5, height: 55, date: '2024-01-01' });

        expect(response.status).toBe(500);
      });
    });
  });

  describe('PUT /api/growth/:growth_id', () => {
    describe('Success Cases', () => {
      test('updates growth record successfully', async () => {
        const updatedRecord = {
          baby_id: 1,
          weight: 11.5,
          height: 56.5,
          date: '2024-01-02',
        };

        const mockResponse = { ...updatedRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .put('/api/growth/1')
          .send(updatedRecord);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockResponse);
        expect(pool.query).toHaveBeenCalledWith(
          'UPDATE growth SET baby_id = $1, weight = $2, height = $3, date = $4 WHERE growth_id = $5 RETURNING *',
          [1, 11.5, 56.5, '2024-01-02', '1']
        );
      });

      test('updates with null weight', async () => {
        const updatedRecord = {
          baby_id: 1,
          weight: null,
          height: 56.5,
          date: '2024-01-02',
        };

        const mockResponse = { ...updatedRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .put('/api/growth/1')
          .send(updatedRecord);

        expect(response.status).toBe(200);
      });

      test('updates with null height', async () => {
        const updatedRecord = {
          baby_id: 1,
          weight: 11.5,
          height: null,
          date: '2024-01-02',
        };

        const mockResponse = { ...updatedRecord, growth_id: 1 };
        pool.query.mockResolvedValue({ rows: [mockResponse] });

        const response = await request(app)
          .put('/api/growth/1')
          .send(updatedRecord);

        expect(response.status).toBe(200);
      });
    });

    describe('Validation Edge Cases', () => {
      test('returns 400 when baby_id is missing', async () => {
        const response = await request(app)
          .put('/api/growth/1')
          .send({ weight: 11.5, height: 56.5, date: '2024-01-02' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'baby_id and date are required' });
      });

      test('returns 400 when date is missing', async () => {
        const response = await request(app)
          .put('/api/growth/1')
          .send({ baby_id: 1, weight: 11.5, height: 56.5 });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'baby_id and date are required' });
      });

      test('returns 404 when growth_id does not exist', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app)
          .put('/api/growth/999999')
          .send({ baby_id: 1, weight: 11.5, height: 56.5, date: '2024-01-02' });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Growth record not found' });
      });

      test('handles invalid growth_id format', async () => {
        pool.query.mockRejectedValue(new Error('Invalid input syntax'));

        const response = await request(app)
          .put('/api/growth/invalid')
          .send({ baby_id: 1, weight: 11.5, height: 56.5, date: '2024-01-02' });

        expect(response.status).toBe(500);
      });

      test('handles negative growth_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app)
          .put('/api/growth/-1')
          .send({ baby_id: 1, weight: 11.5, height: 56.5, date: '2024-01-02' });

        expect(response.status).toBe(404);
      });

      test('handles zero growth_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app)
          .put('/api/growth/0')
          .send({ baby_id: 1, weight: 11.5, height: 56.5, date: '2024-01-02' });

        expect(response.status).toBe(404);
      });
    });

    describe('Error Cases', () => {
      test('handles database connection error', async () => {
        pool.query.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app)
          .put('/api/growth/1')
          .send({ baby_id: 1, weight: 11.5, height: 56.5, date: '2024-01-02' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to update growth record' });
        expect(console.error).toHaveBeenCalledWith('Error updating growth record:', expect.any(Error));
      });

      test('handles foreign key violation on baby_id change', async () => {
        pool.query.mockRejectedValue({ code: '23503', message: 'Foreign key violation' });

        const response = await request(app)
          .put('/api/growth/1')
          .send({ baby_id: 999999, weight: 11.5, height: 56.5, date: '2024-01-02' });

        expect(response.status).toBe(500);
      });
    });
  });

  describe('DELETE /api/growth/:growth_id', () => {
    describe('Success Cases', () => {
      test('deletes growth record successfully', async () => {
        pool.query.mockResolvedValue({ rows: [{ growth_id: 1 }] });

        const response = await request(app).delete('/api/growth/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          message: 'Growth record deleted successfully',
          growth_id: 1,
        });
        expect(pool.query).toHaveBeenCalledWith(
          'DELETE FROM growth WHERE growth_id = $1 RETURNING growth_id',
          ['1']
        );
      });
    });

    describe('Edge Cases', () => {
      test('returns 404 when growth_id does not exist', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).delete('/api/growth/999999');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Growth record not found' });
      });

      test('handles invalid growth_id format', async () => {
        pool.query.mockRejectedValue(new Error('Invalid input syntax'));

        const response = await request(app).delete('/api/growth/invalid');

        expect(response.status).toBe(500);
      });

      test('handles negative growth_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).delete('/api/growth/-1');

        expect(response.status).toBe(404);
      });

      test('handles zero growth_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).delete('/api/growth/0');

        expect(response.status).toBe(404);
      });

      test('handles SQL injection attempt in growth_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).delete('/api/growth/1%20OR%201=1');

        expect(response.status).toBe(404);
      });

      test('handles very large growth_id', async () => {
        pool.query.mockResolvedValue({ rows: [] });

        const response = await request(app).delete('/api/growth/999999999999999');

        expect(response.status).toBe(404);
      });
    });

    describe('Error Cases', () => {
      test('handles database connection error', async () => {
        pool.query.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app).delete('/api/growth/1');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to delete growth record' });
        expect(console.error).toHaveBeenCalledWith('Error deleting growth record:', expect.any(Error));
      });

      test('handles constraint violation during delete', async () => {
        pool.query.mockRejectedValue({ code: '23503', message: 'Foreign key constraint violation' });

        const response = await request(app).delete('/api/growth/1');

        expect(response.status).toBe(500);
      });
    });
  });

  describe('Concurrent Operations', () => {
    test('handles simultaneous GET requests', async () => {
      pool.query.mockResolvedValue({ rows: [{ growth_id: 1, baby_id: 1, weight: 10.5, height: 55, date: '2024-01-01' }] });

      const requests = Array(10).fill().map(() => request(app).get('/api/growth?baby_id=1'));
      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      expect(pool.query).toHaveBeenCalledTimes(10);
    });

    test('handles simultaneous POST requests', async () => {
      pool.query.mockResolvedValue({ rows: [{ growth_id: 1, baby_id: 1, weight: 10.5, height: 55, date: '2024-01-01' }] });

      const requests = Array(5).fill().map(() =>
        request(app)
          .post('/api/growth')
          .send({ baby_id: 1, weight: 10.5, height: 55, date: '2024-01-01' })
      );
      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(201);
      });
    });
  });
});
