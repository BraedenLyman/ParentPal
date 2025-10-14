// scheduler/notificationScheduler.js
const cron = require('node-cron');
const notificationService = require('../services/notificationService');

class NotificationScheduler {
  constructor() {
    this.jobs = [];
  }

  start() {
    console.log('Starting notification scheduler...');

    const job = cron.schedule('* * * * *', async () => {
      console.log('Checking for pending notifications...');
      try {
        await notificationService.processPendingNotifications();
      } catch (error) {
        console.error('Error in notification scheduler:', error);
      }
    });

    this.jobs.push(job);
    console.log('Notification scheduler started successfully');
  }

  stop() {
    console.log('Stopping notification scheduler...');
    this.jobs.forEach(job => job.stop());
    this.jobs = [];
    console.log('Notification scheduler stopped');
  }
}

module.exports = new NotificationScheduler();
