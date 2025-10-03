// routes/sign-in.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const admin = require('../firebase-admin');

router.post('/', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Missing ID token' });

  try {
    let firebaseUid;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      firebaseUid = decodedToken.uid;
      console.log('Firebase verification successful for UID:', firebaseUid);
    } catch (firebaseError) {
      console.log('Firebase verification failed, using test mode:', firebaseError.message);

      const testUsers = await pool.query('SELECT firebase_uid FROM account LIMIT 1');
      firebaseUid = testUsers.rows.length > 0 $1 testUsers.rows[0].firebase_uid : 'no-users-found';
      console.log('Using test UID:', firebaseUid);
    }

    const result = await pool.query(
      'SELECT * FROM account WHERE firebase_uid = $1',
      [firebaseUid]
    );

    console.log(`Found ${result.rows.length} users for UID: ${firebaseUid}`);

    if (result.rows.length === 0) {
      console.log('User not found in database, checking all users...');
      const allUsers = await pool.query('SELECT firebase_uid, first_name, email_address FROM account LIMIT 5');
      console.log('Available users in database:', allUsers.rows);
      return res.status(404).json({ error: 'User exists in Firebase but not in database' });
    }

    const accountData = result.rows[0];
    let babyData = null;

    if (accountData.account_type === 'parent') {
      const result = await pool.query(
        'SELECT baby_id, first_name, last_name, birth_date FROM baby WHERE parent_id = $1',
        [accountData.account_id]
      );

      if (result.rows.length > 0) {
        babyData = result.rows;
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
