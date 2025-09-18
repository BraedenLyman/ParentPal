// server.js (Node.js with Express)
const express = require('express');
const mysql = require('mysql2/promise');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const pool = mysql.createPool({
  host: 'localhost',
  user: 'parentpal_user',
  password: 'Password123!',
  database: 'parentpal_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post("/api/accounts", async (req, res) => {
  const { firebaseUid, fName, lName, email, accountType, dob, gender, baby } = req.body;

  if (!firebaseUid || !fName || !lName || !email || !accountType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [accountResult] = await pool.query(
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
    console.error("Failed to create account in DB:", err);
    res.status(500).json({ error: "Failed to create account in DB" });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));