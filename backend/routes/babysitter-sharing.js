// routes/babysitter-sharing.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const nodemailer = require('nodemailer');

function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

router.post('/invite', async (req, res) => {
    const { parent_id, babysitter_email, babysitter_name } = req.body;

    if (!parent_id || !babysitter_email || !babysitter_name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const [existingInvitations] = await pool.query(
            'SELECT * FROM babysitter_shares WHERE parent_id = ? AND babysitter_email = ? AND expires_at > NOW() AND is_verified = FALSE',
            [parent_id, babysitter_email]
        );

        if (existingInvitations.length > 0) {
            return res.status(400).json({ error: 'An active invitation already exists for this babysitter' });
        }

        const verificationCode = generateVerificationCode();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); 

        const [result] = await pool.query(
            'INSERT INTO babysitter_shares (parent_id, babysitter_email, babysitter_name, verification_code, expires_at) VALUES (?, ?, ?, ?, ?)',
            [parent_id, babysitter_email, babysitter_name, verificationCode, expiresAt]
        );

        const [parentInfo] = await pool.query(
            'SELECT first_name, last_name FROM account WHERE account_id = ?',
            [parent_id]
        );

        const parentName = `${parentInfo[0].first_name} ${parentInfo[0].last_name}`;

        console.log(`Verification code for ${babysitter_email}: ${verificationCode}`);

        // const mailOptions = {
        //     from: process.env.EMAIL_USER,
        //     to: babysitter_email,
        //     subject: 'ParentPal - Babysitter Access Invitation',
        //     html: `
        //         <h2>You've been invited to access child information on ParentPal!</h2>
        //         <p>Hi ${babysitter_name},</p>
        //         <p>${parentName} has invited you to access their child's information on ParentPal.</p>
        //         <p>Your verification code is: <strong>${verificationCode}</strong></p>
        //         <p>To accept this invitation:</p>
        //         <ol>
        //             <li>Download and sign up for ParentPal as a babysitter</li>
        //             <li>Go to your settings</li>
        //             <li>Enter the verification code above</li>
        //         </ol>
        //         <p>This code will expire in 7 days.</p>
        //         <p>Best regards,<br>The ParentPal Team</p>
        //     `
        // };
        // await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Invitation sent successfully',
            share_id: result.insertId
        });

    } catch (err) {
        console.error('Failed to send babysitter invitation:', err);
        res.status(500).json({ error: 'Failed to send invitation' });
    }
});

router.post('/verify', async (req, res) => {
    const { verification_code, babysitter_id } = req.body;

    if (!verification_code || !babysitter_id) {
        return res.status(400).json({ error: 'Missing verification code or babysitter ID' });
    }

    try {
        const [shares] = await pool.query(
            'SELECT * FROM babysitter_shares WHERE verification_code = ? AND expires_at > NOW() AND is_verified = FALSE',
            [verification_code]
        );

        if (shares.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        const share = shares[0];

        const [babysitterInfo] = await pool.query(
            'SELECT email_address FROM account WHERE account_id = ? AND account_type = "babysitter"',
            [babysitter_id]
        );

        if (babysitterInfo.length === 0) {
            return res.status(400).json({ error: 'Babysitter account not found' });
        }

        if (babysitterInfo[0].email_address !== share.babysitter_email) {
            return res.status(400).json({ error: 'Email address does not match the invitation' });
        }

        await pool.query(
            'UPDATE babysitter_shares SET is_verified = TRUE, babysitter_id = ?, verified_at = NOW() WHERE share_id = ?',
            [babysitter_id, share.share_id]
        );

        res.status(200).json({ message: 'Verification successful' });

    } catch (err) {
        console.error('Failed to verify babysitter code:', err);
        res.status(500).json({ error: 'Failed to verify code' });
    }
});

router.get('/children/:babysitter_id', async (req, res) => {
    const { babysitter_id } = req.params;

    try {
        const [children] = await pool.query(`
            SELECT
                b.baby_id,
                b.first_name,
                b.last_name,
                b.birth_date,
                b.gender,
                a.first_name as parent_first_name,
                a.last_name as parent_last_name,
                bs.verified_at
            FROM babysitter_shares bs
            JOIN account a ON bs.parent_id = a.account_id
            JOIN baby b ON bs.parent_id = b.parent_id
            WHERE bs.babysitter_id = ? AND bs.is_verified = TRUE
            ORDER BY b.first_name
        `, [babysitter_id]);

        res.status(200).json({ children });

    } catch (err) {
        console.error('Failed to get babysitter children:', err);
        res.status(500).json({ error: 'Failed to get accessible children' });
    }
});

router.get('/babysitters/:parent_id', async (req, res) => {
    const { parent_id } = req.params;

    try {
        const [babysitters] = await pool.query(`
            SELECT
                bs.share_id,
                bs.babysitter_name,
                bs.babysitter_email,
                bs.is_verified,
                bs.created_at,
                bs.verified_at,
                bs.expires_at,
                a.first_name as babysitter_first_name,
                a.last_name as babysitter_last_name
            FROM babysitter_shares bs
            LEFT JOIN account a ON bs.babysitter_id = a.account_id
            WHERE bs.parent_id = ?
            ORDER BY bs.created_at DESC
        `, [parent_id]);

        res.status(200).json({ babysitters });

    } catch (err) {
        console.error('Failed to get parent babysitters:', err);
        res.status(500).json({ error: 'Failed to get babysitters' });
    }
});

router.delete('/remove/:share_id', async (req, res) => {
    const { share_id } = req.params;
    const { parent_id } = req.body;

    try {
        const [result] = await pool.query(
            'DELETE FROM babysitter_shares WHERE share_id = ? AND parent_id = ?',
            [share_id, parent_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Share not found or unauthorized' });
        }

        res.status(200).json({ message: 'Babysitter access removed successfully' });

    } catch (err) {
        console.error('Failed to remove babysitter access:', err);
        res.status(500).json({ error: 'Failed to remove access' });
    }
});

module.exports = router;