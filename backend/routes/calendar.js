const express = require('express');
const router = express.Router();
const pool = require('../db');

async function getAccountId(firebaseUid) {
    const result = await pool.query(
        'SELECT account_id FROM account WHERE firebase_uid = $1',
        [firebaseUid]
    );
    return result.rows.length > 0 ? result.rows[0].account_id : null;
}

router.get('/events', async (req, res) => {
    try {
        const { parentId, startDate, endDate, babyId, eventType } = req.query;

        if (!parentId) {
            return res.status(400).json({ error: 'Parent ID is required' });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        let query = `
            SELECT
                e.*,
                b.first_name as baby_first_name,
                b.last_name as baby_last_name
            FROM calendar_events e
            LEFT JOIN baby b ON e.baby_id = b.baby_id
            WHERE e.parent_id = $1
        `;
        const queryParams = [accountId];
        let paramIndex = 2;

        if (startDate) {
            query += ` AND e.event_date >= $${paramIndex}`;
            queryParams.push(startDate);
            paramIndex++;
        }

        if (endDate) {
            query += ` AND e.event_date <= $${paramIndex}`;
            queryParams.push(endDate);
            paramIndex++;
        }

        if (babyId) {
            query += ` AND e.baby_id = $${paramIndex}`;
            queryParams.push(babyId);
            paramIndex++;
        }

        if (eventType) {
            query += ` AND e.event_type = $${paramIndex}`;
            queryParams.push(eventType);
            paramIndex++;
        }

        query += ' ORDER BY e.event_date ASC, e.start_time ASC';

        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { parentId } = req.query;

        if (!parentId) {
            return res.status(400).json({ error: 'Parent ID is required' });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const result = await pool.query(
            `SELECT
                e.*,
                b.first_name as baby_first_name,
                b.last_name as baby_last_name
            FROM calendar_events e
            LEFT JOIN baby b ON e.baby_id = b.baby_id
            WHERE e.event_id = $1 AND e.parent_id = $2`,
            [eventId, accountId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/events', async (req, res) => {
    try {
        const {
            parentId,
            babyId,
            eventType,
            title,
            description,
            eventDate,
            startTime,
            endTime,
            location,
            doctorName,
            reminderEnabled,
            reminderTime,
            notes
        } = req.body;

        if (!parentId || !eventType || !title || !eventDate) {
            return res.status(400).json({
                error: 'Parent ID, event type, title, and event date are required'
            });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const result = await pool.query(
            `INSERT INTO calendar_events (
                parent_id, baby_id, event_type, title, description,
                event_date, start_time, end_time, location, doctor_name,
                reminder_enabled, reminder_time, notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *`,
            [
                accountId, babyId, eventType, title, description,
                eventDate, startTime, endTime, location, doctorName,
                reminderEnabled !== false, reminderTime || 24, notes
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const {
            parentId,
            babyId,
            eventType,
            title,
            description,
            eventDate,
            startTime,
            endTime,
            location,
            doctorName,
            reminderEnabled,
            reminderTime,
            isCompleted,
            notes
        } = req.body;

        if (!parentId) {
            return res.status(400).json({ error: 'Parent ID is required' });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const checkResult = await pool.query(
            'SELECT * FROM calendar_events WHERE event_id = $1 AND parent_id = $2',
            [eventId, accountId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const result = await pool.query(
            `UPDATE calendar_events SET
                baby_id = COALESCE($1, baby_id),
                event_type = COALESCE($2, event_type),
                title = COALESCE($3, title),
                description = $4,
                event_date = COALESCE($5, event_date),
                start_time = $6,
                end_time = $7,
                location = $8,
                doctor_name = $9,
                reminder_enabled = COALESCE($10, reminder_enabled),
                reminder_time = COALESCE($11, reminder_time),
                is_completed = COALESCE($12, is_completed),
                completed_at = CASE WHEN $12 = TRUE THEN CURRENT_TIMESTAMP ELSE completed_at END,
                notes = $13
            WHERE event_id = $14 AND parent_id = $15
            RETURNING *`,
            [
                babyId, eventType, title, description, eventDate,
                startTime, endTime, location, doctorName,
                reminderEnabled, reminderTime, isCompleted, notes,
                eventId, accountId
            ]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { parentId } = req.query;

        if (!parentId) {
            return res.status(400).json({ error: 'Parent ID is required' });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const result = await pool.query(
            'DELETE FROM calendar_events WHERE event_id = $1 AND parent_id = $2 RETURNING *',
            [eventId, accountId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully', event: result.rows[0] });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/events/:eventId/complete', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { parentId, notes } = req.body;

        if (!parentId) {
            return res.status(400).json({ error: 'Parent ID is required' });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const result = await pool.query(
            `UPDATE calendar_events SET
                is_completed = TRUE,
                completed_at = CURRENT_TIMESTAMP,
                notes = COALESCE($1, notes)
            WHERE event_id = $2 AND parent_id = $3
            RETURNING *`,
            [notes, eventId, accountId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error completing event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/upcoming', async (req, res) => {
    try {
        const { parentId, days = 7, limit = 10 } = req.query;

        if (!parentId) {
            return res.status(400).json({ error: 'Parent ID is required' });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const result = await pool.query(
            `SELECT
                e.*,
                b.first_name as baby_first_name,
                b.last_name as baby_last_name
            FROM calendar_events e
            LEFT JOIN baby b ON e.baby_id = b.baby_id
            WHERE e.parent_id = $1
                AND e.event_date >= CURRENT_DATE
                AND e.event_date <= CURRENT_DATE + $2::integer
                AND e.is_completed = FALSE
            ORDER BY e.event_date ASC, e.start_time ASC
            LIMIT $3`,
            [accountId, days, limit]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/vaccinations/:babyId', async (req, res) => {
    try {
        const { babyId } = req.params;
        const { parentId } = req.query;

        if (!parentId) {
            return res.status(400).json({ error: 'Parent ID is required' });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const babyCheck = await pool.query(
            'SELECT * FROM baby WHERE baby_id = $1 AND parent_id = $2',
            [babyId, accountId]
        );

        if (babyCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Baby not found' });
        }

        const result = await pool.query(
            `SELECT
                bv.*,
                vs.vaccine_name as schedule_vaccine_name,
                vs.description as schedule_description,
                vs.recommended_age_months,
                vs.dose_number as schedule_dose_number,
                vs.is_required
            FROM baby_vaccinations bv
            LEFT JOIN vaccination_schedule vs ON bv.schedule_id = vs.schedule_id
            WHERE bv.baby_id = $1
            ORDER BY bv.administered_date DESC, vs.recommended_age_months ASC`,
            [babyId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching vaccination records:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/vaccination-schedule', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM vaccination_schedule
            ORDER BY recommended_age_months ASC, dose_number ASC`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching vaccination schedule:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/vaccinations', async (req, res) => {
    try {
        const {
            parentId,
            babyId,
            scheduleId,
            eventId,
            vaccineName,
            administeredDate,
            nextDoseDate,
            location,
            doctorName,
            notes,
            isCompleted
        } = req.body;

        if (!parentId || !babyId || !vaccineName) {
            return res.status(400).json({
                error: 'Parent ID, baby ID, and vaccine name are required'
            });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const babyCheck = await pool.query(
            'SELECT * FROM baby WHERE baby_id = $1 AND parent_id = $2',
            [babyId, accountId]
        );

        if (babyCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Baby not found' });
        }

        const result = await pool.query(
            `INSERT INTO baby_vaccinations (
                baby_id, schedule_id, event_id, vaccine_name,
                administered_date, next_dose_date, location, doctor_name,
                notes, is_completed
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`,
            [
                babyId, scheduleId, eventId, vaccineName,
                administeredDate, nextDoseDate, location, doctorName,
                notes, isCompleted || false
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error recording vaccination:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/recurring-events', async (req, res) => {
    try {
        const { parentId, babyId } = req.query;

        if (!parentId) {
            return res.status(400).json({ error: 'Parent ID is required' });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        let query = `
            SELECT
                r.*,
                b.first_name as baby_first_name,
                b.last_name as baby_last_name
            FROM recurring_events r
            LEFT JOIN baby b ON r.baby_id = b.baby_id
            WHERE r.parent_id = $1 AND r.is_active = TRUE
        `;
        const queryParams = [accountId];

        if (babyId) {
            query += ' AND r.baby_id = $2';
            queryParams.push(babyId);
        }

        query += ' ORDER BY r.start_date ASC';

        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching recurring events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/recurring-events', async (req, res) => {
    try {
        const {
            parentId,
            babyId,
            eventType,
            title,
            description,
            startTime,
            endTime,
            location,
            doctorName,
            recurrencePattern,
            recurrenceInterval,
            recurrenceDayOfWeek,
            recurrenceDayOfMonth,
            startDate,
            endDate,
            reminderEnabled,
            reminderTime
        } = req.body;

        if (!parentId || !eventType || !title || !recurrencePattern || !startDate) {
            return res.status(400).json({
                error: 'Parent ID, event type, title, recurrence pattern, and start date are required'
            });
        }

        const accountId = await getAccountId(parentId);
        if (!accountId) {
            return res.status(404).json({ error: 'Parent account not found' });
        }

        const result = await pool.query(
            `INSERT INTO recurring_events (
                parent_id, baby_id, event_type, title, description,
                start_time, end_time, location, doctor_name,
                recurrence_pattern, recurrence_interval,
                recurrence_day_of_week, recurrence_day_of_month,
                start_date, end_date, reminder_enabled, reminder_time
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *`,
            [
                accountId, babyId, eventType, title, description,
                startTime, endTime, location, doctorName,
                recurrencePattern, recurrenceInterval || 1,
                recurrenceDayOfWeek, recurrenceDayOfMonth,
                startDate, endDate, reminderEnabled !== false, reminderTime || 24
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating recurring event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
