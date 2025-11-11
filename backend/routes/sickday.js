// routes/sickday.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateSickDayData } = require('../middleware/validation');

router.get('/', async (req, res) => {
    const { baby_id } = req.query;

    try {
        let query = 'SELECT * FROM sick_day';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = $1";
            params.push(baby_id);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching sick day records: ", err);
        res.status(500).json({ error: "Failed to fetch sick day records"})
    }
});

router.post('/', validateSickDayData, async (req, res) => {
    const { baby_id, date, meds_taken, temp } = req.body;

    if (!baby_id || !date) {
        return res.status(400).json({ error: 'baby_id and date are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO sick_day (baby_id, date, meds_taken, temp) VALUES ($1, $2, $3, $4) RETURNING *',
            [baby_id, date, meds_taken, temp]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding sick day record:', err);
        res.status(500).json({ error: 'Failed to add sick day record' });
    }
});

router.put('/:sick_id', validateSickDayData, async (req, res) => {
    const { sick_id } = req.params;
    const { baby_id, date, meds_taken, temp } = req.body;

    if (!baby_id || !date) {
        return res.status(400).json({ error: 'baby_id and date are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE sick_day SET baby_id = $1, date = $2, meds_taken = $3, temp = $4 WHERE sick_id = $5 RETURNING *',
            [baby_id, date, meds_taken, temp, sick_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sick day record not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating sick day record:', err);
        res.status(500).json({ error: 'Failed to update sick day record' });
    }
});

router.delete('/:sick_id', async (req, res) => {
    const { sick_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM sick_day WHERE sick_id = $1 RETURNING sick_id',
            [sick_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sick day record not found' });
        }

        res.json({ message: 'Sick day record deleted successfully', sick_id: result.rows[0].sick_id });
    } catch (err) {
        console.error('Error deleting sick day record:', err);
        res.status(500).json({ error: 'Failed to delete sick day record' });
    }
});

module.exports = router;