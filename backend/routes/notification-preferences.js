// routes/notification-preferences.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:accountId', async (req, res) => {
  const { accountId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM notification_preferences WHERE account_id = $1',
      [accountId]
    );

    if (result.rows.length === 0) {
      const insertResult = await pool.query(
        `INSERT INTO notification_preferences
         (account_id, sleep_reminders, feeding_reminders, doctors_appointments, games_development, playdates_development)
         VALUES ($1, true, true, true, true, true)
         RETURNING *`,
        [accountId]
      );
      return res.json(insertResult.rows[0]);
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

router.put('/:accountId', async (req, res) => {
  const { accountId } = req.params;
  const {
    sleep_reminders,
    feeding_reminders,
    doctors_appointments,
    games_development,
    playdates_development
  } = req.body;

  try {
    const checkResult = await pool.query(
      'SELECT * FROM notification_preferences WHERE account_id = $1',
      [accountId]
    );

    let result;
    if (checkResult.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO notification_preferences
         (account_id, sleep_reminders, feeding_reminders, doctors_appointments, games_development, playdates_development)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [accountId, sleep_reminders, feeding_reminders, doctors_appointments, games_development, playdates_development]
      );
    } else {
      result = await pool.query(
        `UPDATE notification_preferences
         SET sleep_reminders = $2,
             feeding_reminders = $3,
             doctors_appointments = $4,
             games_development = $5,
             playdates_development = $6,
             updated_at = CURRENT_TIMESTAMP
         WHERE account_id = $1
         RETURNING *`,
        [accountId, sleep_reminders, feeding_reminders, doctors_appointments, games_development, playdates_development]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

module.exports = router;
