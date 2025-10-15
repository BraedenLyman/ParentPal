// routes/custom-notifications.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:parentId', async (req, res) => {
  const { parentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT cn.*, b.first_name as baby_first_name, b.last_name as baby_last_name
       FROM custom_notifications cn
       JOIN baby b ON cn.baby_id = b.baby_id
       WHERE cn.parent_id = $1
       ORDER BY cn.date DESC, cn.time DESC`,
      [parentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching custom notifications:', error);
    res.status(500).json({ error: 'Failed to fetch custom notifications' });
  }
});

router.get('/:parentId/pending', async (req, res) => {
  const { parentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT cn.*, b.first_name as baby_first_name, b.last_name as baby_last_name
       FROM custom_notifications cn
       JOIN baby b ON cn.baby_id = b.baby_id
       WHERE cn.parent_id = $1 AND cn.is_sent = false
       ORDER BY cn.date ASC, cn.time ASC`,
      [parentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pending notifications:', error);
    res.status(500).json({ error: 'Failed to fetch pending notifications' });
  }
});

router.post('/', async (req, res) => {
  const { baby_id, parent_id, notification_type, date, time, notes } = req.body;

  if (!baby_id || !parent_id || !notification_type || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO custom_notifications
       (baby_id, parent_id, notification_type, date, time, notes, is_sent)
       VALUES ($1, $2, $3, $4, $5, $6, false)
       RETURNING *`,
      [baby_id, parent_id, notification_type, date, time, notes || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating custom notification:', error);
    res.status(500).json({ error: 'Failed to create custom notification' });
  }
});

router.put('/:notificationId', async (req, res) => {
  const { notificationId } = req.params;
  const { notification_type, date, time, notes } = req.body;

  try {
    const now = new Date();
    const notificationDateTime = new Date(`${date}T${time}`);
    const isFuture = notificationDateTime > now;
    const result = await pool.query(
      `UPDATE custom_notifications
       SET notification_type = $2,
           date = $3,
           time = $4,
           notes = $5,
           is_sent = $6
       WHERE custom_notification_id = $1
       RETURNING *`,
      [notificationId, notification_type, date, time, notes || null, !isFuture]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const message = isFuture
      ? 'Notification updated and scheduled to be sent'
      : 'Notification updated (past date/time - will not be sent)';

    res.json({
      ...result.rows[0],
      message,
      willBeSent: isFuture
    });
  } catch (error) {
    console.error('Error updating custom notification:', error);
    res.status(500).json({ error: 'Failed to update custom notification' });
  }
});

router.delete('/:notificationId', async (req, res) => {
  const { notificationId } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM custom_notifications WHERE custom_notification_id = $1 RETURNING *',
      [notificationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom notification:', error);
    res.status(500).json({ error: 'Failed to delete custom notification' });
  }
});

router.patch('/:notificationId/mark-sent', async (req, res) => {
  const { notificationId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE custom_notifications
       SET is_sent = true
       WHERE custom_notification_id = $1
       RETURNING *`,
      [notificationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error marking notification as sent:', error);
    res.status(500).json({ error: 'Failed to mark notification as sent' });
  }
});

module.exports = router;
