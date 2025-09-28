// routes/babies.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    const { firebase_uid } = req.query;

    if (!firebase_uid) {
        return res.status(400).json({ error: "firebase_uid is required" });
    }

    try {
        const [accountRows] = await pool.query(
            'SELECT account_id FROM account WHERE firebase_uid = ? AND account_type = "parent"',
            [firebase_uid]
        );

        if (accountRows.length === 0) {
            return res.status(404).json({ error: "Parent not found" });
        }

        const parentId = accountRows[0].account_id;

        const [babyRows] = await pool.query(
            'SELECT * FROM baby WHERE parent_id = ?',
            [parentId]
        );

        if (babyRows.length === 0) {
            return res.status(404).json({ error: "No baby found for this parent" });
        }

        res.json(babyRows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch baby" });
    }
});

router.post('/', async (req, res) => {
    const { parent_id, first_name, last_name, birth_date, gender, category } = req.body;

    if (!parent_id || !first_name || !last_name || !birth_date || !gender || !category) {
        return res.status(400).json({ error: 'All fields are required: parent_id, first_name, last_name, birth_date, gender, category' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO baby (parent_id, first_name, last_name, birth_date, gender, category) VALUES (?, ?, ?, ?, ?, ?)',
            [parent_id, first_name, last_name, birth_date, gender, category]
        );

        const newBaby = {
            baby_id: result.insertId,
            parent_id,
            first_name,
            last_name,
            birth_date,
            gender,
            category
        };

        res.status(201).json(newBaby);
    } catch (err) {
        console.error('Error adding baby:', err);
        res.status(500).json({ error: 'Failed to add baby' });
    }
});

module.exports = router;
