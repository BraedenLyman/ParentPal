// routes/meds.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateMedicationData } = require('../middleware/validation');

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

router.post('/', validateMedicationData, async (req, res) => {
    const { baby_id, medication_name, time_taken, date, dosage, symptoms, created_by_account_id, created_by_first_name, created_by_last_name } = req.body;

    if (!baby_id || !medication_name || !time_taken || !date || !dosage || !symptoms) {
        return res.status(400).json({ error: 'baby_id, medication_name, time_taken, date, dosage and symptoms are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO medications (baby_id, medication_name, time_taken, date, dosage, symptoms, created_by_account_id, created_by_first_name, created_by_last_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [baby_id, medication_name, time_taken, date, dosage, symptoms, created_by_account_id, created_by_first_name, created_by_last_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding meds record:', err);
        res.status(500).json({ error: 'Failed to add meds record' });
    }
});

router.put('/:med_id', validateMedicationData, async (req, res) => {
    const { med_id } = req.params;
    const { baby_id, medication_name, time_taken, date, dosage, symptoms } = req.body;

    if (!baby_id || !medication_name || !time_taken || !date || !dosage || !symptoms) {
        return res.status(400).json({ error: 'baby_id, medication_name, time_taken, date, dosage and symptoms are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE medications SET baby_id = $1, medication_name = $2, time_taken = $3, date = $4, dosage = $5, symptoms = $6 WHERE med_id = $7 RETURNING *',
            [baby_id, medication_name, time_taken, date, dosage, symptoms, med_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Medication record not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating meds record:', err);
        res.status(500).json({ error: 'Failed to update meds record' });
    }
});

router.delete('/:med_id', async (req, res) => {
    const { med_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM medications WHERE med_id = $1 RETURNING med_id',
            [med_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Medication record not found' });
        }

        res.json({ message: 'Medication record deleted successfully', med_id: result.rows[0].med_id });
    } catch (err) {
        console.error('Error deleting meds record:', err);
        res.status(500).json({ error: 'Failed to delete meds record' });
    }
});

module.exports = router;