// routes/allergies.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/** GET all allergies records */
router.get('/', async (req, res) => {
    const { baby_id } = req.query;
    
    try {
        let query = 'SELECT * FROM allergies';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = $1";
            params.push(baby_id);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching allergies records: ", err);
        res.status(500).json({ error: "Failed to fetch allergies records"})
    }
});

/** Add allergies record */
router.post('/', async (req, res) => {
    const { baby_id, allergy_name, severity, epi_pen, notes } = req.body;

    if (!baby_id || !allergy_name || !severity || !epi_pen, !notes) {
        return res.status(400).json({ error: 'baby_id, allergy_name, severity, epi_pen, and notes are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO allergies (baby_id, allergy_name, severity, epi_pen, notes) VALUES ($1, $2, $3, $4, $5) RETURNING allergy_id',
            [baby_id, allergy_name, severity, epi_pen, notes]
        );

        res.status(201).json({ allergy_id: result.rows[0], baby_id, allergy_name, severity, epi_pen, notes });
    } catch (err) {
        console.error('Error adding allergies record:', err);
        res.status(500).json({ error: 'Failed to add allergies record' });
    }
});

module.exports = router;