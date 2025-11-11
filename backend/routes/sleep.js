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
    const { baby_id, sleep_duration, time_fell_asleep, date, created_by_account_id, created_by_first_name, created_by_last_name } = req.body;

    if (!baby_id || !time_fell_asleep || !date) {
        return res.status(400).json({ error: 'baby_id, time_fell_asleep, and date are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO sleep (baby_id, sleep_duration, time_fell_asleep, date, created_by_account_id, created_by_first_name, created_by_last_name) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [baby_id, sleep_duration, time_fell_asleep, date, created_by_account_id, created_by_first_name, created_by_last_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding sleep record:', err);
        res.status(500).json({ error: 'Failed to add sleep record' });
    }
});

router.put('/:sleep_id', validateSleepData, async (req, res) => {
    const { sleep_id } = req.params;
    const { baby_id, sleep_duration, time_fell_asleep, date } = req.body;

    if (!baby_id || !time_fell_asleep || !date) {
        return res.status(400).json({ error: 'baby_id, time_fell_asleep, and date are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE sleep SET baby_id = $1, sleep_duration = $2, time_fell_asleep = $3, date = $4 WHERE sleep_id = $5 RETURNING *',
            [baby_id, sleep_duration, time_fell_asleep, date, sleep_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sleep record not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating sleep record:', err);
        res.status(500).json({ error: 'Failed to update sleep record' });
    }
});

router.delete('/:sleep_id', async (req, res) => {
    const { sleep_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM sleep WHERE sleep_id = $1 RETURNING sleep_id',
            [sleep_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sleep record not found' });
        }

        res.json({ message: 'Sleep record deleted successfully', sleep_id: result.rows[0].sleep_id });
    } catch (err) {
        console.error('Error deleting sleep record:', err);
        res.status(500).json({ error: 'Failed to delete sleep record' });
    }
});

module.exports = router;