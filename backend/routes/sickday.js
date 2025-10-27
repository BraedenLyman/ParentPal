// routes/vaccinations.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

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

router.post('/', async (req, res) => {
    const { baby_id, date,  meds_taken, temp } = req.body;

    if (!baby_id || !date || !meds_taken || !temp) {
        return res.status(400).json({ error: 'baby_id, date, meds_taken, and temp are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO sick_day (baby_id, date, meds_taken, temp) VALUES ($1, $2, $3, $4) RETURNING sick_id',
            [baby_id, date, meds_taken, temp]
        );

        res.status(201).json({ sick_id: result.rows[0], baby_id, date, meds_taken, temp });
    } catch (err) {
        console.error('Error adding sick day record:', err);
        res.status(500).json({ error: 'Failed to add sick day record' });
    }
});

module.exports = router;