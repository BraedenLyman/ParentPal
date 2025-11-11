// routes/allergies.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateAllergyData } = require('../middleware/validation');

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

router.post('/', validateAllergyData, async (req, res) => {
    const { baby_id, allergy_name, severity, epi_pen, notes } = req.body;

    if (!baby_id || !allergy_name || !severity || !epi_pen) {
        return res.status(400).json({ error: 'baby_id, allergy_name, severity, and epi_pen are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO allergies (baby_id, allergy_name, severity, epi_pen, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [baby_id, allergy_name, severity, epi_pen, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding allergies record:', err);
        res.status(500).json({ error: 'Failed to add allergies record' });
    }
});

router.put('/:allergy_id', validateAllergyData, async (req, res) => {
    const { allergy_id } = req.params;
    const { baby_id, allergy_name, severity, epi_pen, notes } = req.body;

    if (!baby_id || !allergy_name || !severity || !epi_pen) {
        return res.status(400).json({ error: 'baby_id, allergy_name, severity, and epi_pen are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE allergies SET baby_id = $1, allergy_name = $2, severity = $3, epi_pen = $4, notes = $5 WHERE allergy_id = $6 RETURNING *',
            [baby_id, allergy_name, severity, epi_pen, notes, allergy_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Allergy record not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating allergies record:', err);
        res.status(500).json({ error: 'Failed to update allergies record' });
    }
});

router.delete('/:allergy_id', async (req, res) => {
    const { allergy_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM allergies WHERE allergy_id = $1 RETURNING allergy_id',
            [allergy_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Allergy record not found' });
        }

        res.json({ message: 'Allergy record deleted successfully', allergy_id: result.rows[0].allergy_id });
    } catch (err) {
        console.error('Error deleting allergies record:', err);
        res.status(500).json({ error: 'Failed to delete allergies record' });
    }
});

module.exports = router;