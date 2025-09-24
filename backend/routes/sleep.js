// routes/sleep.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/** GET all sleep records */
router.get('/', async (req, res) => {
    const { baby_id } = req.query;
    
    try {
        let query = 'SELECT * FROM sleep';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = ?";
            params.push(baby_id);
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching sleep records: ", err);
        res.status(500).json({ error: "Failed to fetch sleep records"})
    }
});

/** Add sleep record */
router.post('/', async (req, res) => {
    const { baby_id, sleep_duration, time_fell_asleep, date } = req.body;

    if (!baby_id || !sleep_duration || !time_fell_asleep || !date) {
        return res.status(400).json({ error: 'baby_id, sleep_duration, time_fell_asleep, and date are required' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO sleep (baby_id, sleep_duration, time_fell_asleep, date) VALUES (?, ?, ?, ?)',
            [baby_id, sleep_duration, time_fell_asleep, date]
        );

        res.status(201).json({ sleep_id: result.insertId, baby_id, sleep_duration, time_fell_asleep, date });
    } catch (err) {
        console.error('Error adding sleep record:', err);
        res.status(500).json({ error: 'Failed to add sleep record' });
    }
});

module.exports = router;