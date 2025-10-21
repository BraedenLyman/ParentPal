// routes/feeding.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/** GET all feeding records */
router.get('/', async (req, res) => {
    const { baby_id } = req.query;
    
    try {
        let query = 'SELECT * FROM feeding';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = $1";
            params.push(baby_id);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching feeding records: ", err);
        res.status(500).json({ error: "Failed to fetch feeding records"})
    }
});

/** Add feeding record */
router.post('/', async (req, res) => {
    const { baby_id, time_fed, date, fed_from, type_of_food, amount, notes } = req.body;

    if (!baby_id || !time_fed || !date || !fed_from || !type_of_food || !amount || !notes) {
        return res.status(400).json({ error: 'baby_id, time_fed, date, fed_from, type_of_food, amount and notes are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO feeding (baby_id, time_fed, date, fed_from, type_of_food, amount, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING feeding_id',
            [baby_id, time_fed, date, fed_from, type_of_food, amount, notes]
        );

        res.status(201).json({ feeding_id: result.rows[0].feeding_id, baby_id, time_fed, date, fed_from, type_of_food, amount, notes });
    } catch (err) {
        console.error('Error adding feeding record:', err);
        res.status(500).json({ error: 'Failed to add feeding record' });
    }
});

module.exports = router;