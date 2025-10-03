// routes/feeding.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/** GET all observation records */
router.get('/', async (req, res) => {
    const { baby_id } = req.query;
    
    try {
        let query = 'SELECT * FROM observation';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = $1";
            params.push(baby_id);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching observation records: ", err);
        res.status(500).json({ error: "Failed to fetch observation records"})
    }
});

/** Add observation record */
router.post('/', async (req, res) => {
    const { baby_id, priority_level, notes } = req.body;

    if (!baby_id || !priority_level || !notes) {
        return res.status(400).json({ error: 'baby_id, priority_level and notes notes are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO observation (baby_id, priority_level, notes) VALUES ($1, $2, $3) RETURNING observation_id',
            [baby_id, priority_level, notes]
        );

        res.status(201).json({ observation_id: result.rows[0], baby_id, priority_level, notes });
    } catch (err) {
        console.error('Error adding observation record:', err);
        res.status(500).json({ error: 'Failed to add observation record' });
    }
});

module.exports = router;