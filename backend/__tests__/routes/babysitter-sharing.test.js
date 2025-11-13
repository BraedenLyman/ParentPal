const request = require('supertest');
const express = require('express');
const babysitterSharingRouter = require('../../routes/babysitter-sharing');
const pool = require('../../db');
const { sendEmail } = require('../../services/emailService');

jest.mock('../../db');
jest.mock('../../services/emailService');

const app = express();
app.use(express.json());
app.use('/api/babysitter-sharing', babysitterSharingRouter);

describe('Babysitter Sharing Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('POST /api/babysitter-sharing/invite', () => {
    const validInvite = {
      parent_id: 1,
      babysitter_email: 'babysitter@example.com',
      babysitter_name: 'Jane Smith',
    };

    test('sends invitation successfully', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] }) // check existing invite
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] }) // insert
        .mockResolvedValueOnce({ rows: [{ first_name: 'John', last_name: 'Doe' }] }); // get parent

      sendEmail.mockResolvedValue({ provider: 'test' });

      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(validInvite);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Invitation sent successfully');
      expect(response.body).toHaveProperty('share_id');
      expect(sendEmail).toHaveBeenCalled();
    });

    test('returns 400 when parent_id is missing', async () => {
      const { parent_id, ...incomplete } = validInvite;
      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when babysitter_email is missing', async () => {
      const { babysitter_email, ...incomplete } = validInvite;
      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when babysitter_name is missing', async () => {
      const { babysitter_name, ...incomplete } = validInvite;
      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(incomplete);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when active invitation already exists', async () => {
      pool.query.mockResolvedValue({ rows: [{ share_id: 1 }] });

      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(validInvite);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'An active invitation already exists for this babysitter'
      });
    });

    test('generates 4-digit verification code', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ first_name: 'John', last_name: 'Doe' }] });

      sendEmail.mockResolvedValue({ provider: 'test' });

      await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(validInvite);

      const insertCall = pool.query.mock.calls[1];
      const verificationCode = insertCall[1][3];
      expect(verificationCode).toMatch(/^\d{4}$/);
    });

    test('verification code is within valid range (1000-9999)', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ first_name: 'John', last_name: 'Doe' }] });

      sendEmail.mockResolvedValue({ provider: 'test' });

      await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(validInvite);

      const insertCall = pool.query.mock.calls[1];
      const verificationCode = parseInt(insertCall[1][3]);
      expect(verificationCode).toBeGreaterThanOrEqual(1000);
      expect(verificationCode).toBeLessThanOrEqual(9999);
    });

    test('sets expiration date to 7 days from now', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ first_name: 'John', last_name: 'Doe' }] });

      sendEmail.mockResolvedValue({ provider: 'test' });

      await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(validInvite);

      const insertCall = pool.query.mock.calls[1];
      const expiresAt = insertCall[1][4];

      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() + 7);

      const expirationDate = new Date(expiresAt);
      expect(expirationDate.getDate()).toBe(expectedDate.getDate());
    });

    test('handles invalid email format', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ first_name: 'John', last_name: 'Doe' }] });

      sendEmail.mockRejectedValue(new Error('Invalid email'));

      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send({ ...validInvite, babysitter_email: 'invalid-email' });

      expect(response.status).toBe(201); // Still succeeds, email failure is logged
    });

    test('handles email service failure gracefully', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [{ first_name: 'John', last_name: 'Doe' }] });

      sendEmail.mockRejectedValue(new Error('Email service down'));

      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(validInvite);

      expect(response.status).toBe(201);
      expect(console.error).toHaveBeenCalled();
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send(validInvite);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to send invitation' });
    });

    test('handles foreign key violation (invalid parent_id)', async () => {
      pool.query.mockRejectedValue({ code: '23503' });

      const response = await request(app)
        .post('/api/babysitter-sharing/invite')
        .send({ ...validInvite, parent_id: 999999 });

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/babysitter-sharing/verify', () => {
    const validVerify = {
      verification_code: '1234',
      babysitter_id: 2,
    };

    test('verifies code successfully', async () => {
      const mockShare = {
        share_id: 1,
        parent_id: 1,
        babysitter_email: 'babysitter@example.com',
      };

      pool.query
        .mockResolvedValueOnce({ rows: [mockShare] }) // find share
        .mockResolvedValueOnce({ rows: [{ email_address: 'babysitter@example.com' }] }) // get babysitter
        .mockResolvedValueOnce({ rowCount: 1 }) // update share
        .mockResolvedValueOnce({ rows: [mockShare] }); // verify update

      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send(validVerify);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Verification successful' });
    });

    test('returns 400 when verification_code is missing', async () => {
      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send({ babysitter_id: 2 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing verification code or babysitter ID' });
    });

    test('returns 400 when babysitter_id is missing', async () => {
      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send({ verification_code: '1234' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing verification code or babysitter ID' });
    });

    test('returns 400 for invalid verification code', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send({ verification_code: '9999', babysitter_id: 2 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid or expired verification code' });
    });

    test('returns 400 for expired verification code', async () => {
      pool.query.mockResolvedValue({ rows: [] }); // Query checks expires_at > NOW()

      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send(validVerify);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid or expired verification code' });
    });

    test('returns 400 when babysitter account not found', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1, babysitter_email: 'test@example.com' }] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send(validVerify);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Babysitter account not found' });
    });

    test('returns 400 when email mismatch', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1, babysitter_email: 'correct@example.com' }] })
        .mockResolvedValueOnce({ rows: [{ email_address: 'wrong@example.com' }] });

      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send(validVerify);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Email address does not match the invitation' });
    });

    test('handles code reuse attempt (is_verified = TRUE)', async () => {
      pool.query.mockResolvedValue({ rows: [] }); // Query filters is_verified = FALSE

      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send(validVerify);

      expect(response.status).toBe(400);
    });

    test('handles brute force with invalid codes', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const attempts = Array(100).fill().map((_, i) =>
        request(app)
          .post('/api/babysitter-sharing/verify')
          .send({ verification_code: i.toString().padStart(4, '0'), babysitter_id: 2 })
      );

      const responses = await Promise.all(attempts);

      responses.forEach(response => {
        expect(response.status).toBe(400);
      });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/babysitter-sharing/verify')
        .send(validVerify);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to verify code' });
    });
  });

  describe('GET /api/babysitter-sharing/children/:babysitter_id', () => {
    test('returns accessible children for babysitter', async () => {
      const mockChildren = [
        {
          baby_id: 1,
          first_name: 'Emma',
          parent_first_name: 'John',
          is_verified: true
        },
      ];

      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: mockChildren });

      const response = await request(app).get('/api/babysitter-sharing/children/2');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('children');
      expect(response.body.children).toEqual(mockChildren);
    });

    test('returns empty array when babysitter has no access', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/api/babysitter-sharing/children/999');

      expect(response.status).toBe(200);
      expect(response.body.children).toEqual([]);
    });

    test('handles invalid babysitter_id', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app).get('/api/babysitter-sharing/children/invalid');

      expect(response.status).toBe(500);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/babysitter-sharing/children/2');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get accessible children' });
    });
  });

  describe('GET /api/babysitter-sharing/babysitters/:parent_id', () => {
    test('returns babysitters for parent', async () => {
      const mockBabysitters = [
        {
          share_id: 1,
          babysitter_name: 'Jane Smith',
          is_verified: true
        },
      ];

      pool.query.mockResolvedValue({ rows: mockBabysitters });

      const response = await request(app).get('/api/babysitter-sharing/babysitters/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('babysitters');
      expect(response.body.babysitters).toEqual(mockBabysitters);
    });

    test('returns empty array when parent has no babysitters', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/babysitter-sharing/babysitters/999');

      expect(response.status).toBe(200);
      expect(response.body.babysitters).toEqual([]);
    });

    test('includes pending and verified babysitters', async () => {
      const mockBabysitters = [
        { share_id: 1, is_verified: true },
        { share_id: 2, is_verified: false },
      ];

      pool.query.mockResolvedValue({ rows: mockBabysitters });

      const response = await request(app).get('/api/babysitter-sharing/babysitters/1');

      expect(response.status).toBe(200);
      expect(response.body.babysitters).toHaveLength(2);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/babysitter-sharing/babysitters/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to get babysitters' });
    });
  });

  describe('DELETE /api/babysitter-sharing/remove/:share_id', () => {
    test('removes babysitter access successfully', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const response = await request(app)
        .delete('/api/babysitter-sharing/remove/1')
        .send({ parent_id: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Babysitter access removed successfully' });
    });

    test('returns 404 when share not found', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });

      const response = await request(app)
        .delete('/api/babysitter-sharing/remove/999')
        .send({ parent_id: 1 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Share not found or unauthorized' });
    });

    test('returns 404 when parent_id mismatch (unauthorized)', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });

      const response = await request(app)
        .delete('/api/babysitter-sharing/remove/1')
        .send({ parent_id: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Share not found or unauthorized' });
    });

    test('handles invalid share_id', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app)
        .delete('/api/babysitter-sharing/remove/invalid')
        .send({ parent_id: 1 });

      expect(response.status).toBe(500);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/babysitter-sharing/remove/1')
        .send({ parent_id: 1 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to remove access' });
    });
  });
});
