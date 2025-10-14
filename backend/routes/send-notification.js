// routes/send-notification.js
const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

router.post('/test', async (req, res) => {
  const { accountId, title, body } = req.body;

  if (!accountId || !title || !body) {
    return res.status(400).json({ error: 'Missing required fields: accountId, title, body' });
  }

  try {
    const result = await notificationService.sendToUser(accountId, {
      title,
      body,
      data: { type: 'test' }
    });

    res.json(result);
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

router.post('/custom/:notificationId', async (req, res) => {
  const { notificationId } = req.params;

  try {
    await notificationService.sendCustomNotification(parseInt(notificationId));
    res.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending custom notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

router.post('/process-pending', async (req, res) => {
  try {
    await notificationService.processPendingNotifications();
    res.json({ message: 'Pending notifications processed' });
  } catch (error) {
    console.error('Error processing pending notifications:', error);
    res.status(500).json({ error: 'Failed to process notifications' });
  }
});

module.exports = router;
