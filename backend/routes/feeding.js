// routes/feeding.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateFeedingData } = require('../middleware/validation');

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

router.post('/', validateFeedingData, async (req, res) => {
    const { baby_id, time_fed, date, fed_from, type_of_food, amount, notes, created_by_account_id, created_by_first_name, created_by_last_name } = req.body;

    if (!baby_id || !time_fed || !date || !fed_from || !type_of_food) {
        return res.status(400).json({ error: 'baby_id, time_fed, date, fed_from, and type_of_food are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO feeding (baby_id, time_fed, date, fed_from, type_of_food, amount, notes, created_by_account_id, created_by_first_name, created_by_last_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [baby_id, time_fed, date, fed_from, type_of_food, amount, notes, created_by_account_id, created_by_first_name, created_by_last_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding feeding record:', err);
        res.status(500).json({ error: 'Failed to add feeding record' });
    }
});

router.put('/:feeding_id', validateFeedingData, async (req, res) => {
    const { feeding_id } = req.params;
    const { baby_id, time_fed, date, fed_from, type_of_food, amount, notes } = req.body;

    if (!baby_id || !time_fed || !date || !fed_from || !type_of_food) {
        return res.status(400).json({ error: 'baby_id, time_fed, date, fed_from, and type_of_food are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE feeding SET baby_id = $1, time_fed = $2, date = $3, fed_from = $4, type_of_food = $5, amount = $6, notes = $7 WHERE feeding_id = $8 RETURNING *',
            [baby_id, time_fed, date, fed_from, type_of_food, amount, notes, feeding_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Feeding record not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating feeding record:', err);
        res.status(500).json({ error: 'Failed to update feeding record' });
    }
});

router.delete('/:feeding_id', async (req, res) => {
    const { feeding_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM feeding WHERE feeding_id = $1 RETURNING feeding_id',
            [feeding_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Feeding record not found' });
        }

        res.json({ message: 'Feeding record deleted successfully', feeding_id: result.rows[0].feeding_id });
    } catch (err) {
        console.error('Error deleting feeding record:', err);
        res.status(500).json({ error: 'Failed to delete feeding record' });
    }
});

module.exports = router;