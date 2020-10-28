const CronJob = require('cron').CronJob;
const { createBackup } = require('../db/backup.js');

// Daily at 00:00
const dbBackup = new CronJob('0 0 0 * * *', () => {
  createBackup();
});

if (process.env.NODE_ENV === 'production') dbBackup.start();
