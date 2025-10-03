// routes/user.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.delete('/', async (req, res) => {
  const { firebase_uid } = req.query;

  if (!firebase_uid) {
    return res.status(400).json({ error: 'Missing firebase_uid parameter' });
  }

  try {
    await pool.query('START TRANSACTION');

    const accountResult = await pool.query(
      'SELECT account_id FROM account WHERE firebase_uid = $1',
      [firebase_uid]
    );

    if (accountResult.rows.length === 0) {
      await pool.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }

    const parentId = accountResult.rows[0].account_id;

    const babyResult = await pool.query(
      'SELECT baby_id FROM baby WHERE parent_id = $1',
      [parentId]
    );

    for (const baby of babyResult.rows) {
      const babyId = baby.baby_id;

      await pool.query('DELETE FROM growth WHERE baby_id = $1', [babyId]);
      await pool.query('DELETE FROM sleep WHERE baby_id = $1', [babyId]);
      await pool.query('DELETE FROM feeding WHERE baby_id = $1', [babyId]);
      await pool.query('DELETE FROM observation WHERE baby_id = $1', [babyId]);
      await pool.query('DELETE FROM medications WHERE baby_id = $1', [babyId]);
      await pool.query('DELETE FROM allergies WHERE baby_id = $1', [babyId]);
      await pool.query('DELETE FROM vaccinations WHERE baby_id = $1', [babyId]);
    }

    await pool.query('DELETE FROM baby WHERE parent_id = $1', [parentId]);
    await pool.query('DELETE FROM account WHERE firebase_uid = $1', [firebase_uid]);
    await pool.query('COMMIT');

    res.status(200).json({ message: 'User account and all associated data deleted successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Failed to delete user account:', err);
    res.status(500).json({ error: 'Failed to delete user account', details: err.message });
  }
});

module.exports = router;