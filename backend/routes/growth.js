// routes/growth.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

/** GET all growth records */
router.get('/', async (req, res) => {
    const { baby_id } = req.query;
    
    try {
        let query = 'SELECT * FROM growth';
        const params = [];

        if (baby_id) {
            query += " WHERE baby_id = ?";
            params.push(baby_id);
        }

        const rowsResult = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching growth records: ", err);
        res.status(500).json({ error: "Failed to fetch growth records"})
    }
});

/** Add growth record */
router.post('/', async (req, res) => {
    const { baby_id, weight, height, date } = req.body;

    if (!baby_id || !weight || !height || !date) {
        return res.status(400).json({ error: 'baby_id, weight, height, and date are required' });
    }

    try {
        const resultResult = await pool.query(
            'INSERT INTO growth (baby_id, weight, height, date) VALUES (?, ?, ?, ?)',
            [baby_id, weight, height, date]
        );

        res.status(201).json({ growth_id: result.insertId, baby_id, weight, height, date });
    } catch (err) {
        console.error('Error adding growth record:', err);
        res.status(500).json({ error: 'Failed to add growth record' });
    }
});

/** Edit growth record */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { baby_id, weight, height, date } = req.body;
    
    if (!baby_id || !weight || !height || !date) {
        return res.status(400).json({ error: 'baby_id, weight, height, and date are required' });
    }
    
    try {
        const resultResult = await pool.query(
            'UPDATE growth SET baby_id = ?, weight = ?, height = ?, date = ? WHERE growth_id = ?',
            [baby_id, weight, height, date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Growth record not found' });
        }

        res.json({ growth_id: id, baby_id, weight, height, date });
    } catch (err) {
        console.error('Error updating growth record:', err);
        res.status(500).json({ error: 'Failed to update growth record' });
    }
});

/** Delete growth record */
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const resultResult = await pool.query('DELETE FROM growth WHERE growth_id = $1', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Growth record not found' });
        }

        res.json({ message: 'Growth record deleted successfully', growth_id: id });
    } catch (err) {
        console.error('Error deleting growth record:', err);
        res.status(500).json({ error: 'Failed to delete growth record' });
    }
});

module.exports = router;