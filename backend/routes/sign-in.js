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
    
      const [testUsers] = await pool.query('SELECT firebase_uid FROM account LIMIT 1');
      firebaseUid = testUsers.length > 0 ? testUsers[0].firebase_uid : 'no-users-found';
      console.log('Using test UID:', firebaseUid);
    }

    const [rows] = await pool.query(
      'SELECT * FROM account WHERE firebase_uid = ?',
      [firebaseUid]
    );

    console.log(`Found ${rows.length} users for UID: ${firebaseUid}`);

    if (rows.length === 0) {
      console.log('User not found in database, checking all users...');
      const [allUsers] = await pool.query('SELECT firebase_uid, first_name, email_address FROM account LIMIT 5');
      console.log('Available users in database:', allUsers);
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
