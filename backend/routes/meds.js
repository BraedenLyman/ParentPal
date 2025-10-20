// routes/meds.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/** GET all meds records */
router.get('/', async (req, res) => {
    const { baby_id } = req.query;
    
    try {
        let query = 'SELECT * FROM medications';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = $1";
            params.push(baby_id);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching meds records: ", err);
        res.status(500).json({ error: "Failed to fetch meds records"})
    }
});

/** Add growth record */
router.post('/', async (req, res) => {
    const { baby_id, medication_name, time_taken, date, dosage, symptoms } = req.body;

    if (!baby_id || !medication_name || !time_taken || !date, !dosage || !symptoms) {
        return res.status(400).json({ error: 'baby_id, medication_name, time_taken, date, dosage and symptoms are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO medications (baby_id, medication_name, time_taken, date, dosage, symptoms) VALUES ($1, $2, $3, $4, $5, $6) RETURNING med_id',
            [baby_id, medication_name, time_taken, date, dosage, symptoms]
        );

        res.status(201).json({ meds_id: result.rows[0].med_id, baby_id, medication_name, time_taken, date, dosage, symptoms });
    } catch (err) {
        console.error('Error adding meds record:', err);
        res.status(500).json({ error: 'Failed to add meds record' });
    }
});

module.exports = router;