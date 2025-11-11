// routes/vaccinations.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateVaccinationData } = require('../middleware/validation');

router.get('/', async (req, res) => {
    const { baby_id } = req.query;

    try {
        let query = 'SELECT * FROM vaccinations';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = $1";
            params.push(baby_id);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching vaccinations records: ", err);
        res.status(500).json({ error: "Failed to fetch vaccinations records"})
    }
});

router.post('/', validateVaccinationData, async (req, res) => {
    const { baby_id, vaccination_name, date_of_vaccine, created_by_account_id, created_by_first_name, created_by_last_name } = req.body;

    if (!baby_id || !date_of_vaccine) {
        return res.status(400).json({ error: 'baby_id and date_of_vaccine are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO vaccinations (baby_id, vaccination_name, date_of_vaccine, created_by_account_id, created_by_first_name, created_by_last_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [baby_id, vaccination_name, date_of_vaccine, created_by_account_id, created_by_first_name, created_by_last_name]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding vaccination record:', err);
        res.status(500).json({ error: 'Failed to add vaccination record' });
    }
});

router.put('/:vaccine_id', validateVaccinationData, async (req, res) => {
    const { vaccine_id } = req.params;
    const { baby_id, vaccination_name, date_of_vaccine } = req.body;

    if (!baby_id || !date_of_vaccine) {
        return res.status(400).json({ error: 'baby_id and date_of_vaccine are required' });
    }

    try {
        const result = await pool.query(
            'UPDATE vaccinations SET baby_id = $1, vaccination_name = $2, date_of_vaccine = $3 WHERE vaccine_id = $4 RETURNING *',
            [baby_id, vaccination_name, date_of_vaccine, vaccine_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vaccination record not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating vaccination record:', err);
        res.status(500).json({ error: 'Failed to update vaccination record' });
    }
});

router.delete('/:vaccine_id', async (req, res) => {
    const { vaccine_id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM vaccinations WHERE vaccine_id = $1 RETURNING vaccine_id',
            [vaccine_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vaccination record not found' });
        }

        res.json({ message: 'Vaccination record deleted successfully', vaccine_id: result.rows[0].vaccine_id });
    } catch (err) {
        console.error('Error deleting vaccination record:', err);
        res.status(500).json({ error: 'Failed to delete vaccination record' });
    }
});

module.exports = router;