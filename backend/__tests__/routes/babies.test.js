const request = require('supertest');
const express = require('express');
const babiesRouter = require('../../routes/babies');
const pool = require('../../db');

jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/api/babies', babiesRouter);

describe('Babies Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/babies/:accountId', () => {
    test('returns babies for valid accountId', async () => {
      const mockBabies = [
        { baby_id: 1, parent_id: 1, first_name: 'Emma', last_name: 'Doe' },
        { baby_id: 2, parent_id: 1, first_name: 'Liam', last_name: 'Doe' },
      ];
      pool.query.mockResolvedValue({ rows: mockBabies });

      const response = await request(app).get('/api/babies/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBabies);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM baby WHERE parent_id = $1', ['1']);
    });

    test('returns empty array when no babies found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/babies/999');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('handles invalid accountId', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/babies/invalid');

      expect(response.status).toBe(200);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/babies/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch babies' });
    });
  });

  describe('GET /api/babies', () => {
    test('returns baby for valid firebase_uid', async () => {
      const mockAccount = { account_id: 1 };
      const mockBaby = { baby_id: 1, parent_id: 1, first_name: 'Emma' };

      pool.query
        .mockResolvedValueOnce({ rows: [mockAccount] })
        .mockResolvedValueOnce({ rows: [mockBaby] });

      const response = await request(app).get('/api/babies?firebase_uid=test-uid');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockBaby);
    });

    test('returns 400 when firebase_uid is missing', async () => {
      const response = await request(app).get('/api/babies');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'firebase_uid is required' });
    });

    test('returns 404 when parent not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/babies?firebase_uid=invalid-uid');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Parent not found' });
    });

    test('returns 404 when no baby found for parent', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ account_id: 1 }] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/api/babies?firebase_uid=test-uid');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'No baby found for this parent' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/babies?firebase_uid=test-uid');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch baby' });
    });
  });

  describe('POST /api/babies', () => {
    const validBaby = {
      parent_id: 1,
      first_name: 'Emma',
      last_name: 'Doe',
      birth_date: '2023-01-01',
      gender: 'female',
      category: 'infant',
    };

    test('creates baby successfully', async () => {
      pool.query.mockResolvedValue({ rows: [{ baby_id: 1 }] });

      const response = await request(app)
        .post('/api/babies')
        .send(validBaby);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        baby_id: 1,
        ...validBaby,
      });
    });

    test('returns 400 when parent_id is missing', async () => {
      const { parent_id, ...incomplete } = validBaby;
      const response = await request(app).post('/api/babies').send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('All fields are required');
    });

    test('returns 400 when first_name is missing', async () => {
      const { first_name, ...incomplete } = validBaby;
      const response = await request(app).post('/api/babies').send(incomplete);

      expect(response.status).toBe(400);
    });

    test('returns 400 when last_name is missing', async () => {
      const { last_name, ...incomplete } = validBaby;
      const response = await request(app).post('/api/babies').send(incomplete);

      expect(response.status).toBe(400);
    });

    test('returns 400 when birth_date is missing', async () => {
      const { birth_date, ...incomplete } = validBaby;
      const response = await request(app).post('/api/babies').send(incomplete);

      expect(response.status).toBe(400);
    });

    test('returns 400 when gender is missing', async () => {
      const { gender, ...incomplete } = validBaby;
      const response = await request(app).post('/api/babies').send(incomplete);

      expect(response.status).toBe(400);
    });

    test('returns 400 when category is missing', async () => {
      const { category, ...incomplete } = validBaby;
      const response = await request(app).post('/api/babies').send(incomplete);

      expect(response.status).toBe(400);
    });

    test('handles future birth date', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const baby = { ...validBaby, birth_date: futureDate.toISOString() };
      pool.query.mockResolvedValue({ rows: [{ baby_id: 1 }] });

      const response = await request(app).post('/api/babies').send(baby);

      expect(response.status).toBe(201);
    });

    test('handles invalid birth_date format', async () => {
      const baby = { ...validBaby, birth_date: 'invalid-date' };
      pool.query.mockRejectedValue(new Error('Invalid date'));

      const response = await request(app).post('/api/babies').send(baby);

      expect(response.status).toBe(500);
    });

    test('handles foreign key violation (invalid parent_id)', async () => {
      pool.query.mockRejectedValue({ code: '23503' });

      const response = await request(app)
        .post('/api/babies')
        .send({ ...validBaby, parent_id: 999999 });

      expect(response.status).toBe(500);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).post('/api/babies').send(validBaby);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to add baby' });
    });
  });

  describe('DELETE /api/babies/:baby_id', () => {
    test('deletes baby and cascade deletes related records successfully', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ baby_id: 1 }] }) // check baby exists
        .mockResolvedValueOnce({ rowCount: 1 }) // delete growth
        .mockResolvedValueOnce({ rowCount: 1 }) // delete sleep
        .mockResolvedValueOnce({ rowCount: 1 }) // delete medications
        .mockResolvedValueOnce({ rowCount: 1 }) // delete allergies
        .mockResolvedValueOnce({ rowCount: 1 }) // delete vaccinations
        .mockResolvedValueOnce({ rowCount: 1 }) // delete feeding
        .mockResolvedValueOnce({ rowCount: 1 }) // delete observation
        .mockResolvedValueOnce({ rowCount: 1 }) // delete sick_day
        .mockResolvedValueOnce({ rowCount: 1 }); // delete baby

      const response = await request(app).delete('/api/babies/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Baby and all associated records deleted successfully',
        deleted_baby_id: '1',
      });
    });

    test('returns 400 when baby_id is missing', async () => {
      const response = await request(app).delete('/api/babies/');

      expect(response.status).toBe(404); // Express routing returns 404 for missing param
    });

    test('returns 404 when baby not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/babies/999999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Baby not found' });
    });

    test('handles invalid baby_id format', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app).delete('/api/babies/invalid');

      expect(response.status).toBe(500);
    });

    test('handles negative baby_id', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/babies/-1');

      expect(response.status).toBe(404);
    });

    test('handles SQL injection attempt', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/babies/1%20OR%201=1');

      expect(response.status).toBe(404);
    });

    test('handles database error during cascade delete', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ baby_id: 1 }] })
        .mockRejectedValueOnce(new Error('Cascade delete failed'));

      const response = await request(app).delete('/api/babies/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to delete baby');
    });

    test('handles constraint violation during delete', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ baby_id: 1 }] })
        .mockRejectedValueOnce({ code: '23503' });

      const response = await request(app).delete('/api/babies/1');

      expect(response.status).toBe(500);
    });

    test('verifies all cascade deletes are called', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ baby_id: 1 }] })
        .mockResolvedValue({ rowCount: 1 });

      await request(app).delete('/api/babies/1');

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM growth WHERE baby_id = $1', ['1']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM sleep WHERE baby_id = $1', ['1']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM medications WHERE baby_id = $1', ['1']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM allergies WHERE baby_id = $1', ['1']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM vaccinations WHERE baby_id = $1', ['1']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM feeding WHERE baby_id = $1', ['1']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM observation WHERE baby_id = $1', ['1']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM sick_day WHERE baby_id = $1', ['1']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM baby WHERE baby_id = $1', ['1']);
    });
  });
});
