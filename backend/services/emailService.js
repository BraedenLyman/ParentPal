// services/emailService.js
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid email service configured');
} else {
    console.log('SendGrid API key not found, will attempt to use SMTP fallback');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

async function sendEmail({ to, subject, html }) {
    const from = process.env.EMAIL_USER || 'noreply@parentpals.ca';

    if (process.env.SENDGRID_API_KEY) {
        console.log(`Sending email via SendGrid to ${to}`);

        try {
            const msg = {
                to,
                from: {
                    email: from,
                    name: 'ParentPal'
                },
                subject,
                html,
            };

            const response = await sgMail.send(msg);
            console.log('SendGrid email sent successfully:', {
                to,
                statusCode: response[0].statusCode,
                messageId: response[0].headers['x-message-id']
            });

            return {
                success: true,
                messageId: response[0].headers['x-message-id'],
                provider: 'SendGrid'
            };
        } catch (error) {
            console.error('SendGrid email failed:', {
                error: error.message,
                code: error.code,
                to,
                response: error.response?.body
            });
            throw error;
        }
    } else if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        console.log(`Sending email via Gmail SMTP to ${to}`);

        try {
            const info = await transporter.sendMail({
                from,
                to,
                subject,
                html,
            });

            console.log('Gmail SMTP email sent successfully:', {
                to,
                messageId: info.messageId,
                response: info.response
            });

            return {
                success: true,
                messageId: info.messageId,
                provider: 'Gmail SMTP'
            };
        } catch (error) {
            console.error('Gmail SMTP email failed:', {
                error: error.message,
                code: error.code,
                to
            });
            throw error;
        }
    } else {
        const errorMsg = 'No email service configured. Set SENDGRID_API_KEY or EMAIL_USER/EMAIL_PASSWORD';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
}

module.exports = { sendEmail };
