// routes/vaccinations.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/** GET all vaccinations records */
router.get('/', async (req, res) => {
    const { baby_id } = req.query;
    
    try {
        let query = 'SELECT * FROM vaccinations';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = ?";
            params.push(baby_id);
        }

        const rowsResult = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching vaccinations records: ", err);
        res.status(500).json({ error: "Failed to fetch vaccinations records"})
    }
});

/** Add vaccination record */
router.post('/', async (req, res) => {
    const { baby_id, vaccination_name, date_of_vaccine } = req.body;

    if (!baby_id || !vaccination_name || !date_of_vaccine) {
        return res.status(400).json({ error: 'baby_id, vaccination_name and date_of_vaccine are required' });
    }

    try {
        const resultResult = await pool.query(
            'INSERT INTO vaccinations (baby_id, vaccination_name, date_of_vaccine) VALUES (?, ?, ?)',
            [baby_id, vaccination_name, date_of_vaccine]
        );

        res.status(201).json({ vaccine_id: result.insertId, baby_id, vaccination_name, date_of_vaccine });
    } catch (err) {
        console.error('Error adding vaccination record:', err);
        res.status(500).json({ error: 'Failed to add vaccination record' });
    }
});

module.exports = router;