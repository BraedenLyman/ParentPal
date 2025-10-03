// routes/accounts.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { firebaseUid, fName, lName, email, accountType, dob, gender, baby } = req.body;

  if (!firebaseUid || !fName || !lName || !email || !accountType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const accountResultResult = await pool.query(
      `INSERT INTO account (firebase_uid, first_name, last_name, email_address, account_type, birth_date, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firebaseUid, fName, lName, email, accountType, dob || null, gender || null]
    );

    const parentId = accountResult.insertId;

    if (baby) {
      const { bFName, bLName, bDob, bGender } = baby;

      await pool.query(
        `INSERT INTO baby (parent_id, first_name, last_name, birth_date, gender)
         VALUES (?, ?, ?, ?, ?)`,
        [parentId, bFName, bLName, bDob || null, bGender || null]
      );
    }

    res.status(201).json({ accountId: parentId });
  } catch (err) {
      console.error('Failed to create account in DB:', err);
      res.status(500).json({ error: 'Failed to create account in DB' });
  }
});

module.exports = router;
