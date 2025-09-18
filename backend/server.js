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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));