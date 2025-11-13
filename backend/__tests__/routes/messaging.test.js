const request = require('supertest');
const express = require('express');
const messagingRouter = require('../../routes/messaging');
const pool = require('../../db');

jest.mock('../../db');

const app = express();
app.use(express.json());
app.use('/api/messaging', messagingRouter);

describe('Messaging Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('GET /api/messaging/conversations/:account_id', () => {
    test('returns conversations for account', async () => {
      const mockConversations = [
        {
          conversation_id: 1,
          other_user_name: 'Jane Smith',
          last_message: 'Hello',
          unread_count: 2
        },
      ];
      pool.query.mockResolvedValue({ rows: mockConversations });

      const response = await request(app).get('/api/messaging/conversations/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockConversations);
    });

    test('returns empty array when no conversations', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/messaging/conversations/999');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('handles invalid account_id', async () => {
      pool.query.mockRejectedValue(new Error('Invalid input'));

      const response = await request(app).get('/api/messaging/conversations/invalid');

      expect(response.status).toBe(500);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/messaging/conversations/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch conversations' });
    });
  });

  describe('GET /api/messaging/messages/:conversation_id', () => {
    test('returns messages and marks them as read', async () => {
      const mockMessages = [
        { message_id: 1, content: 'Hello', sender_id: 1, is_read: false },
        { message_id: 2, content: 'Hi there', sender_id: 2, is_read: true },
      ];

      pool.query
        .mockResolvedValueOnce({ rows: mockMessages })
        .mockResolvedValueOnce({ rowCount: 1 }); // mark as read

      const response = await request(app)
        .get('/api/messaging/messages/1?account_id=2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMessages);
      expect(pool.query).toHaveBeenCalledTimes(2); // fetch + mark read
    });

    test('returns messages without marking read when account_id not provided', async () => {
      const mockMessages = [{ message_id: 1, content: 'Hello' }];
      pool.query.mockResolvedValue({ rows: mockMessages });

      const response = await request(app).get('/api/messaging/messages/1');

      expect(response.status).toBe(200);
      expect(pool.query).toHaveBeenCalledTimes(1); // Only fetch, no mark read
    });

    test('handles empty conversation', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/messaging/messages/999');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/messaging/messages/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch messages' });
    });
  });

  describe('POST /api/messaging/send', () => {
    const validMessage = {
      sender_id: 1,
      recipient_id: 2,
      content: 'Hello, this is a test message',
    };

    test('sends message successfully (new conversation)', async () => {
      const mockMessage = { message_id: 1, ...validMessage, created_at: new Date(), is_read: false };

      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] }) // verify relationship
        .mockResolvedValueOnce({ rows: [
          { account_id: 1, account_type: 'parent' },
          { account_id: 2, account_type: 'babysitter' }
        ]}) // get user types
        .mockResolvedValueOnce({ rows: [] }) // check conversation (doesn't exist)
        .mockResolvedValueOnce({ rows: [{ conversation_id: 1 }] }) // create conversation
        .mockResolvedValueOnce({ rows: [mockMessage] }); // insert message

      const response = await request(app)
        .post('/api/messaging/send')
        .send(validMessage);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message_id');
      expect(response.body.content).toBe(validMessage.content);
    });

    test('sends message successfully (existing conversation)', async () => {
      const mockMessage = { message_id: 1, ...validMessage, created_at: new Date(), is_read: false };

      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [
          { account_id: 1, account_type: 'parent' },
          { account_id: 2, account_type: 'babysitter' }
        ]})
        .mockResolvedValueOnce({ rows: [{ conversation_id: 1 }] }) // conversation exists
        .mockResolvedValueOnce({ rowCount: 1 }) // update last_message_at
        .mockResolvedValueOnce({ rows: [mockMessage] });

      const response = await request(app)
        .post('/api/messaging/send')
        .send(validMessage);

      expect(response.status).toBe(201);
    });

    test('returns 400 when sender_id is missing', async () => {
      const response = await request(app)
        .post('/api/messaging/send')
        .send({ recipient_id: 2, content: 'Hello' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when recipient_id is missing', async () => {
      const response = await request(app)
        .post('/api/messaging/send')
        .send({ sender_id: 1, content: 'Hello' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when content is missing', async () => {
      const response = await request(app)
        .post('/api/messaging/send')
        .send({ sender_id: 1, recipient_id: 2 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when content is empty string', async () => {
      const response = await request(app)
        .post('/api/messaging/send')
        .send({ sender_id: 1, recipient_id: 2, content: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 400 when content is only whitespace', async () => {
      const response = await request(app)
        .post('/api/messaging/send')
        .send({ sender_id: 1, recipient_id: 2, content: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('returns 403 when no verified relationship exists', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/messaging/send')
        .send(validMessage);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'No verified relationship between users' });
    });

    test('returns 400 when invalid user types', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [
          { account_id: 1, account_type: 'invalid' },
          { account_id: 2, account_type: 'invalid' }
        ]});

      const response = await request(app)
        .post('/api/messaging/send')
        .send(validMessage);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid user types' });
    });

    test('handles very long message content', async () => {
      const longContent = 'a'.repeat(10000);
      const message = { ...validMessage, content: longContent };

      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [
          { account_id: 1, account_type: 'parent' },
          { account_id: 2, account_type: 'babysitter' }
        ]})
        .mockResolvedValueOnce({ rows: [{ conversation_id: 1 }] })
        .mockResolvedValueOnce({ rowCount: 1 })
        .mockResolvedValueOnce({ rows: [{ message_id: 1, ...message }] });

      const response = await request(app)
        .post('/api/messaging/send')
        .send(message);

      expect(response.status).toBe(201);
    });

    test('handles special characters in message', async () => {
      const specialContent = '!@#$%^&*()_+{}:"<>?[];\',./`~';
      const message = { ...validMessage, content: specialContent };

      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [
          { account_id: 1, account_type: 'parent' },
          { account_id: 2, account_type: 'babysitter' }
        ]})
        .mockResolvedValueOnce({ rows: [{ conversation_id: 1 }] })
        .mockResolvedValueOnce({ rowCount: 1 })
        .mockResolvedValueOnce({ rows: [{ message_id: 1, ...message }] });

      const response = await request(app)
        .post('/api/messaging/send')
        .send(message);

      expect(response.status).toBe(201);
    });

    test('handles unicode/emoji in message', async () => {
      const emojiContent = 'Hello 👋 How are you? 😊🎉';
      const message = { ...validMessage, content: emojiContent };

      pool.query
        .mockResolvedValueOnce({ rows: [{ share_id: 1 }] })
        .mockResolvedValueOnce({ rows: [
          { account_id: 1, account_type: 'parent' },
          { account_id: 2, account_type: 'babysitter' }
        ]})
        .mockResolvedValueOnce({ rows: [{ conversation_id: 1 }] })
        .mockResolvedValueOnce({ rowCount: 1 })
        .mockResolvedValueOnce({ rows: [{ message_id: 1, ...message }] });

      const response = await request(app)
        .post('/api/messaging/send')
        .send(message);

      expect(response.status).toBe(201);
    });

    test('handles rapid successive messages', async () => {
      // Mock needs to return proper values for each call in the sequence
      pool.query.mockImplementation(() => {
        const callCount = pool.query.mock.calls.length;
        const step = (callCount - 1) % 5;

        switch(step) {
          case 0: return Promise.resolve({ rows: [{ share_id: 1 }] });
          case 1: return Promise.resolve({ rows: [
            { account_id: 1, account_type: 'parent' },
            { account_id: 2, account_type: 'babysitter' }
          ]});
          case 2: return Promise.resolve({ rows: [{ conversation_id: 1 }] });
          case 3: return Promise.resolve({ rowCount: 1 });
          case 4: return Promise.resolve({ rows: [{ message_id: callCount, ...validMessage }] });
          default: return Promise.resolve({ rows: [] });
        }
      });

      const requests = Array(3).fill().map(() =>
        request(app).post('/api/messaging/send').send(validMessage)
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(201);
      });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/messaging/send')
        .send(validMessage);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to send message' });
    });
  });

  describe('GET /api/messaging/recipients/:account_id', () => {
    test('returns recipients for parent account', async () => {
      const mockRecipients = [
        { account_id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ];

      pool.query
        .mockResolvedValueOnce({ rows: [{ account_type: 'parent' }] })
        .mockResolvedValueOnce({ rows: mockRecipients });

      const response = await request(app).get('/api/messaging/recipients/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecipients);
    });

    test('returns recipients for babysitter account', async () => {
      const mockRecipients = [
        { account_id: 1, name: 'John Doe', email: 'john@example.com' },
      ];

      pool.query
        .mockResolvedValueOnce({ rows: [{ account_type: 'babysitter' }] })
        .mockResolvedValueOnce({ rows: mockRecipients });

      const response = await request(app).get('/api/messaging/recipients/2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecipients);
    });

    test('returns 404 when user not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/messaging/recipients/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });

    test('returns 400 for invalid account type', async () => {
      pool.query.mockResolvedValue({ rows: [{ account_type: 'invalid' }] });

      const response = await request(app).get('/api/messaging/recipients/1');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid account type' });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/messaging/recipients/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch recipients' });
    });
  });

  describe('PUT /api/messaging/read/:conversation_id', () => {
    test('marks messages as read successfully', async () => {
      pool.query.mockResolvedValue({ rowCount: 3 });

      const response = await request(app)
        .put('/api/messaging/read/1')
        .send({ account_id: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    test('handles marking with no unread messages', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });

      const response = await request(app)
        .put('/api/messaging/read/1')
        .send({ account_id: 2 });

      expect(response.status).toBe(200);
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/messaging/read/1')
        .send({ account_id: 2 });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to mark messages as read' });
    });
  });

  describe('GET /api/messaging/unread-count/:account_id', () => {
    test('returns unread message count', async () => {
      pool.query.mockResolvedValue({ rows: [{ count: '5' }] });

      const response = await request(app).get('/api/messaging/unread-count/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ count: 5 });
    });

    test('returns zero when no unread messages', async () => {
      pool.query.mockResolvedValue({ rows: [{ count: '0' }] });

      const response = await request(app).get('/api/messaging/unread-count/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ count: 0 });
    });

    test('handles database error', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/messaging/unread-count/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch unread count' });
    });
  });
});
