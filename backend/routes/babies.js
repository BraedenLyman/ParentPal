// routes/babies.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    const { firebase_uid } = req.query;
    
    if (!firebase_uid) {
        return res.status(400).json({ error: "firebase_uid is required" });
    }

    try {
        // Get account_id of parent
        const [accountRows] = await pool.query(
            'SELECT account_id FROM account WHERE firebase_uid = ? AND account_type = "parent"',
            [firebase_uid]
        );

        if (accountRows.length === 0) {
            return res.status(404).json({ error: "Parent not found" });
        }

        const parentId = accountRows[0].account_id;

        // Get baby for that parent
        const [babyRows] = await pool.query(
            'SELECT * FROM baby WHERE parent_id = ?',
            [parentId]
        );

        if (babyRows.length === 0) {
            return res.status(404).json({ error: "No baby found for this parent" });
        }

        res.json(babyRows[0]); // assuming one baby per parent
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch baby" });
    }
});

module.exports = router;
