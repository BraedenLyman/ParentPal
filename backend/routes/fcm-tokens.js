// routes/fcm-tokens.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { accountId, token, deviceType } = req.body;

  if (!accountId || !token) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existingToken = await pool.query(
      'SELECT * FROM fcm_tokens WHERE account_id = $1 AND token = $2',
      [accountId, token]
    );

    if (existingToken.rows.length > 0) {
      const result = await pool.query(
        `UPDATE fcm_tokens
         SET last_used = CURRENT_TIMESTAMP, device_type = $3
         WHERE account_id = $1 AND token = $2
         RETURNING *`,
        [accountId, token, deviceType || 'web']
      );
      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO fcm_tokens (account_id, token, device_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [accountId, token, deviceType || 'web']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving FCM token:', error);
    res.status(500).json({ error: 'Failed to save FCM token' });
  }
});

router.get('/:accountId', async (req, res) => {
  const { accountId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM fcm_tokens WHERE account_id = $1 AND is_active = true',
      [accountId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching FCM tokens:', error);
    res.status(500).json({ error: 'Failed to fetch FCM tokens' });
  }
});

router.delete('/:tokenId', async (req, res) => {
  const { tokenId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE fcm_tokens
       SET is_active = false
       WHERE token_id = $1
       RETURNING *`,
      [tokenId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Token not found' });
    }

    res.json({ message: 'Token deactivated successfully' });
  } catch (error) {
    console.error('Error deleting FCM token:', error);
    res.status(500).json({ error: 'Failed to delete FCM token' });
  }
});

module.exports = router;
