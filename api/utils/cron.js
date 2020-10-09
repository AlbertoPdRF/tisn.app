const CronJob = require('cron').CronJob;
const DatabaseBackup = require('../db/backup.js');

// Configure cron job to run every day at 12:00am
let job = new CronJob('00 00 00 * * *', function () {
  DatabaseBackup.createBackup();
});

job.start();
