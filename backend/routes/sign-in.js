// routes/sign-in.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const admin = require('../firebase-admin');

router.post('/', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Missing ID token' });

  let client;
  try {
    let firebaseUid;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      firebaseUid = decodedToken.uid;
      console.log('Firebase verification successful for UID:', firebaseUid);
    } catch (firebaseError) {
      console.log('Firebase verification failed:', firebaseError.message);
      return res.status(401).json({ error: 'Invalid Firebase token' });
    }

    // Get a dedicated client from the pool for this transaction
    client = await pool.connect();

    console.log('Database client connected, querying for user...');
    const result = await client.query(
      'SELECT * FROM account WHERE firebase_uid = $1',
      [firebaseUid]
    );

    console.log(`Found ${result.rows.length} users for UID: ${firebaseUid}`);

    if (result.rows.length === 0) {
      console.log('User not found in database');
      return res.status(404).json({ error: 'User exists in Firebase but not in database' });
    }

    const accountData = result.rows[0];
    let babyData = null;

    if (accountData.account_type === 'parent') {
      const babyResult = await client.query(
        'SELECT baby_id, first_name, last_name, birth_date, gender FROM baby WHERE parent_id = $1',
        [accountData.account_id]
      );

      if (babyResult.rows.length > 0) {
        babyData = babyResult.rows;
        console.log('Backend found baby data:', babyData);
      } else {
        console.log('Backend: No baby data found for parent_id:', accountData.account_id);
      }
    }

    res.json({ user: accountData, babyData });
  } catch (err) {
    console.error('Signin error:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    res.status(500).json({ error: 'Failed to sign in', details: err.message });
  } finally {
    // Always release the client back to the pool
    if (client) {
      client.release();
      console.log('Database client released');
    }
  }
});

module.exports = router;
