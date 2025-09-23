// routes/sign-in.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const admin = require('../firebase-admin');

router.post('/', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Missing ID token' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    const [rows] = await pool.query(
      'SELECT * FROM account WHERE firebase_uid = ?',
      [firebaseUid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User exists in Firebase but not in database' });
    }

    const accountData = rows[0];
    let babyData = null;

    if (accountData.account_type === 'parent') {
      const [babyRows] = await pool.query(
        'SELECT baby_id, first_name, last_name, birth_date FROM baby WHERE parent_id = ?',
        [accountData.account_id]
      );

      if (babyRows.length > 0) {
        babyData = babyRows;
        console.log('Backend found baby data:', babyData);
      } else {
        console.log('Backend: No baby data found for parent_id:', accountData.account_id);
      }
    }

    res.json({ user: accountData, babyData });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

module.exports = router;
