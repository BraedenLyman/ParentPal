// routes/shared-tasks.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { validateTaskData } = require('../middleware/validation');

router.get('/share/:shareId', async (req, res) => {
    const { shareId } = req.params;

    try {
        const result = await pool.query(
            `SELECT st.*,
                    a.first_name as parent_first_name, a.last_name as parent_last_name,
                    b.first_name as babysitter_first_name, b.last_name as babysitter_last_name
             FROM shared_tasks st
             JOIN account a ON st.parent_id = a.account_id
             LEFT JOIN babysitter b ON st.babysitter_id = b.babysitter_id
             WHERE st.share_id = $1
             ORDER BY st.is_completed ASC, st.due_date ASC NULLS LAST, st.created_at DESC`,
            [shareId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching shared tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.get('/parent/:parentId', async (req, res) => {
    const { parentId } = req.params;

    try {
        const result = await pool.query(
            `SELECT st.*,
                    bs.babysitter_name, bs.babysitter_email,
                    b.first_name as babysitter_first_name, b.last_name as babysitter_last_name,
                    baby.first_name as baby_first_name
             FROM shared_tasks st
             JOIN babysitter_shares bs ON st.share_id = bs.share_id
             LEFT JOIN babysitter b ON st.babysitter_id = b.babysitter_id
             LEFT JOIN baby ON st.baby_id = baby.baby_id
             WHERE st.parent_id = $1
             ORDER BY st.is_completed ASC, st.due_date ASC NULLS LAST, st.created_at DESC`,
            [parentId]
        );

        res.json({ tasks: result.rows });
    } catch (error) {
        console.error('Error fetching parent tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.get('/babysitter/:babysitterId', async (req, res) => {
    const { babysitterId } = req.params;

    try {
        const result = await pool.query(
            `SELECT st.*,
                    a.first_name as parent_first_name, a.last_name as parent_last_name,
                    bs.babysitter_name,
                    baby.first_name as baby_first_name
             FROM shared_tasks st
             JOIN account a ON st.parent_id = a.account_id
             JOIN babysitter_shares bs ON st.share_id = bs.share_id
             LEFT JOIN baby ON st.baby_id = baby.baby_id
             WHERE st.babysitter_id = $1
             ORDER BY st.is_completed ASC, st.due_date ASC NULLS LAST, st.created_at DESC`,
            [babysitterId]
        );

        res.json({ tasks: result.rows });
    } catch (error) {
        console.error('Error fetching babysitter tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

router.post('/', validateTaskData, async (req, res) => {
    const { share_id, parent_id, babysitter_id, baby_id, task_title, task_description, due_date } = req.body;

    if (!share_id || !parent_id) {
        return res.status(400).json({ error: 'Missing required fields: share_id, parent_id' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO shared_tasks (share_id, parent_id, babysitter_id, baby_id, task_title, task_description, due_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [share_id, parent_id, babysitter_id || null, baby_id || null, task_title, task_description || null, due_date || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

router.put('/:taskId', validateTaskData, async (req, res) => {
    const { taskId } = req.params;
    const { share_id, babysitter_id, baby_id, task_title, task_description, due_date } = req.body;

    try{
        const result = await pool.query(
            `UPDATE shared_tasks
             SET share_id = $2,
                 babysitter_id = $3,
                 baby_id = $4,
                 task_title = $5,
                 task_description = $6,
                 due_date = $7,
                 updated_at = CURRENT_TIMESTAMP
             WHERE task_id = $1
             RETURNING *`,
            [taskId, share_id, babysitter_id || null, baby_id || null, task_title, task_description || null, due_date || null]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

router.patch('/:taskId/complete', validateTaskData, async (req, res) => {
    const { taskId } = req.params;
    const { babysitter_notes } = req.body;

    try {
        const result = await pool.query(
            `UPDATE shared_tasks
             SET is_completed = true,
                 completed_at = CURRENT_TIMESTAMP,
                 babysitter_notes = $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE task_id = $1
             RETURNING *`,
            [taskId, babysitter_notes || null]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Failed to complete task' });
    }
});

router.patch('/:taskId/incomplete', async (req, res) => {
    const { taskId } = req.params;

    try {
        const result = await pool.query(
            `UPDATE shared_tasks
             SET is_completed = false,
                 completed_at = NULL,
                 updated_at = CURRENT_TIMESTAMP
             WHERE task_id = $1
             RETURNING *`,
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error marking task incomplete:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

router.delete('/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM shared_tasks WHERE task_id = $1 RETURNING *',
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
