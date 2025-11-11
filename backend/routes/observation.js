// routes/observation.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateObservationData } = require('../middleware/validation');

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

router.post('/', validateObservationData, async (req, res) => {
    const { baby_id, priority_level, notes, created_by_account_id, created_by_first_name, created_by_last_name } = req.body;

    if (!baby_id || !priority_level) {
        return res.status(400).json({ error: 'baby_id and priority_level are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO observation (baby_id, priority_level, notes, created_by_account_id, created_by_first_name, created_by_last_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [baby_id, priority_level, notes, created_by_account_id, created_by_first_name, created_by_last_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding observation record:', err);
        res.status(500).json({ error: 'Failed to add observation record' });
    }
});

router.put('/:observation_id', validateObservationData, async (req, res) => {
    const { observation_id } = req.params;
    const { baby_id, priority_level, notes } = req.body;

    if (!baby_id || !priority_level) {
        return res.status(400).json({ error: 'baby_id and priority_level are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE observation SET baby_id = $1, priority_level = $2, notes = $3 WHERE observation_id = $4 RETURNING *',
            [baby_id, priority_level, notes, observation_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Observation record not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating observation record:', err);
        res.status(500).json({ error: 'Failed to update observation record' });
    }
});

router.delete('/:observation_id', async (req, res) => {
    const { observation_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM observation WHERE observation_id = $1 RETURNING observation_id',
            [observation_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Observation record not found' });
        }

        res.json({ message: 'Observation record deleted successfully', observation_id: result.rows[0].observation_id });
    } catch (err) {
        console.error('Error deleting observation record:', err);
        res.status(500).json({ error: 'Failed to delete observation record' });
    }
});

module.exports = router;