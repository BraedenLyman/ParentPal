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

app.post("/api/signin", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: "Missing ID token" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const [rows] = await pool.query(
      "SELECT * FROM account WHERE firebase_uid = ?",
      [firebaseUid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User exists in Firebase but not in database" });
    }

    const accountData = rows[0];
    let babyData = null;

    if (accountData.account_type === "parent") {
      const [babyRows] = await pool.query(
        "SELECT baby_id, first_name, last_name, birth_date FROM baby WHERE parent_id = ?",
        [accountData.account_id]
      );
      
    if (babyRows.length > 0) {
      babyData = babyRows;
        console.log("Backend found baby data:", babyData);
    } else {
      console.log("Backend: No baby data found for parent_id:", accountData.account_id);
    }
  }
    console.log("Backend sending response:", { user: accountData, babyData });
    res.json({ user: accountData, babyData });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ error: "Failed to sign in" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));