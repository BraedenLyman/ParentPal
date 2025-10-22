// routes/photo-gallery.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/photos');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Get all photos for a specific baby
router.get('/baby/:babyId', async (req, res) => {
    const { babyId } = req.params;

    try {
        const result = await pool.query(
            `SELECT pg.*, b.first_name, b.last_name
             FROM photo_gallery pg
             JOIN baby b ON pg.baby_id = b.baby_id
             WHERE pg.baby_id = $1
             ORDER BY pg.uploaded_at DESC`,
            [babyId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ error: 'Failed to fetch photos' });
    }
});

// Get all photos for a parent (across all their babies)
router.get('/parent/:parentId', async (req, res) => {
    const { parentId } = req.params;

    try {
        const result = await pool.query(
            `SELECT pg.*, b.first_name, b.last_name
             FROM photo_gallery pg
             JOIN baby b ON pg.baby_id = b.baby_id
             WHERE pg.parent_id = $1
             ORDER BY pg.uploaded_at DESC`,
            [parentId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ error: 'Failed to fetch photos' });
    }
});

// Get all photos for babies accessible to a babysitter
router.get('/babysitter/:babysitterId', async (req, res) => {
    const { babysitterId } = req.params;

    try {
        const result = await pool.query(
            `SELECT DISTINCT pg.*, b.first_name, b.last_name
             FROM photo_gallery pg
             JOIN baby b ON pg.baby_id = b.baby_id
             JOIN babysitter_shares bs ON b.parent_id = bs.parent_id
             WHERE bs.babysitter_id = $1
               AND bs.is_verified = true
             ORDER BY pg.uploaded_at DESC`,
            [babysitterId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ error: 'Failed to fetch photos' });
    }
});

// Upload a new photo
router.post('/upload', upload.single('photo'), async (req, res) => {
    const { baby_id, parent_id, caption } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No photo file uploaded' });
    }

    if (!baby_id || !parent_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Store relative path to photo
        const photoUrl = `/uploads/photos/${req.file.filename}`;

        const result = await pool.query(
            `INSERT INTO photo_gallery (baby_id, parent_id, photo_url, caption)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [baby_id, parent_id, photoUrl, caption || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error uploading photo:', error);
        // Delete the uploaded file if database insert fails
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: 'Failed to upload photo' });
    }
});

// Delete a photo
router.delete('/:photoId', async (req, res) => {
    const { photoId } = req.params;

    try {
        // Get photo info first to delete the file
        const photoResult = await pool.query(
            'SELECT photo_url FROM photo_gallery WHERE photo_id = $1',
            [photoId]
        );

        if (photoResult.rows.length === 0) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        const photoUrl = photoResult.rows[0].photo_url;
        const filePath = path.join(__dirname, '..', photoUrl);

        // Delete from database
        await pool.query('DELETE FROM photo_gallery WHERE photo_id = $1', [photoId]);

        // Delete file from filesystem
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: 'Photo deleted successfully' });
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ error: 'Failed to delete photo' });
    }
});

module.exports = router;
