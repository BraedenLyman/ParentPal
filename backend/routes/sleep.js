// routes/sleep.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateSleepData } = require('../middleware/validation');

router.get('/', async (req, res) => {
    const { baby_id } = req.query;
    
    try {
        let query = 'SELECT * FROM sleep';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = $1";
            params.push(baby_id);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching sleep records: ", err);
        res.status(500).json({ error: "Failed to fetch sleep records"})
    }
});

router.post('/', validateSleepData, async (req, res) => {
    const { baby_id, sleep_duration, time_fell_asleep, date } = req.body;

    if (!baby_id || !time_fell_asleep || !date) {
        return res.status(400).json({ error: 'baby_id, time_fell_asleep, and date are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO sleep (baby_id, sleep_duration, time_fell_asleep, date) VALUES ($1, $2, $3, $4) RETURNING sleep_id',
            [baby_id, sleep_duration, time_fell_asleep, date]
        );

        res.status(201).json({ sleep_id: result.rows[0], baby_id, sleep_duration, time_fell_asleep, date });
    } catch (err) {
        console.error('Error adding sleep record:', err);
        res.status(500).json({ error: 'Failed to add sleep record' });
    }
});

module.exports = router;