// services/notificationService.js
const admin = require('../firebase-admin');
const pool = require('../db');

class NotificationService {
  async sendToUser(accountId, notification) {
    try {
      const result = await pool.query(
        'SELECT token FROM fcm_tokens WHERE account_id = $1 AND is_active = true',
        [accountId]
      );

      if (result.rows.length === 0) {
        console.log(`No active FCM tokens found for user ${accountId}`);
        return { success: false, message: 'No active tokens found' };
      }

      const tokens = result.rows.map(row => row.token);

      const message = {
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: notification.data || {},
        tokens: tokens
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      console.log(`Successfully sent ${response.successCount} notifications`);
      console.log(`Failed to send ${response.failureCount} notifications`);

      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
            console.error(`Failed to send to token ${tokens[idx]}:`, resp.error);
          }
        });

        if (failedTokens.length > 0) {
          await pool.query(
            'UPDATE fcm_tokens SET is_active = false WHERE token = ANY($1)',
            [failedTokens]
          );
        }
      }

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendCustomNotification(customNotificationId) {
    try {
      const notificationResult = await pool.query(
        `SELECT cn.*, b.first_name, b.last_name
         FROM custom_notifications cn
         JOIN baby b ON cn.baby_id = b.baby_id
         WHERE cn.custom_notification_id = $1`,
        [customNotificationId]
      );

      if (notificationResult.rows.length === 0) {
        throw new Error('Custom notification not found');
      }

      const customNotification = notificationResult.rows[0];
      const title = `${customNotification.notification_type} Reminder`;
      const body = `${customNotification.notification_type} for ${customNotification.first_name} ${customNotification.last_name}`;
      const data = {
        notificationId: customNotificationId.toString(),
        type: customNotification.notification_type,
        babyId: customNotification.baby_id.toString(),
        notes: customNotification.notes || ''
      };

      await this.sendToUser(customNotification.parent_id, { title, body, data });

      await pool.query(
        'UPDATE custom_notifications SET is_sent = true WHERE custom_notification_id = $1',
        [customNotificationId]
      );

      console.log(`Custom notification ${customNotificationId} sent successfully`);
    } catch (error) {
      console.error('Error sending custom notification:', error);
      throw error;
    }
  }

  async processPendingNotifications() {
    try {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().split(' ')[0].substring(0, 5);

      const result = await pool.query(
        `SELECT custom_notification_id
         FROM custom_notifications
         WHERE is_sent = false
           AND date <= $1
           AND (date < $1 OR (date = $1 AND time <= $2))`,
        [currentDate, currentTime]
      );

      console.log(`Found ${result.rows.length} pending notifications to send`);

      for (const row of result.rows) {
        try {
          await this.sendCustomNotification(row.custom_notification_id);
        } catch (error) {
          console.error(`Failed to send notification ${row.custom_notification_id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error processing pending notifications:', error);
    }
  }
}

module.exports = new NotificationService();
