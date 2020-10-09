const exec = require('child_process').exec;
const database = require('./connection');
const path = require('path');

const createBackup = () => {
  // Retrieve database URL
  const dbUrl = database.getDbUrl();

  // Prepare database archive filename
  currentDate = new Date();

  // Construct filename and path for the database dump
  const dumpFilename = `${currentDate.getFullYear()}${
    currentDate.getMonth() + 1
  }${currentDate.getDate()}.gz`;

  const dumpPath = path.join(__dirname, 'dumps');

  // Prepare mongodump command
  const dumpCmd = `mongodump --uri '${dbUrl}' --archive='${dumpPath}/${dumpFilename}.' --gzip`;

  // Execute mongodump command
  exec(dumpCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return 0;
    } else {
      console.log(
        `Successfully created database dump at ${dumpPath}/${dumpFilename}`
      );
      const sendMail = require('../utils/emails').dbBackup(dumpFilename);
    }
  });
};

module.exports = { createBackup };
