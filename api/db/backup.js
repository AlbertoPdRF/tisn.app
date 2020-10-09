const exec = require('child_process').exec;
const database = require('./connection');

const createBackup = () => {
  // Retrieve database URL
  const dbUrl = database.getDbUrl();

  // Prepare database archive filename
  currentDate = new Date();

  const dumpFilename = `${currentDate.getFullYear()}${
    currentDate.getMonth() + 1
  }${currentDate.getDate()}.gz`;

  // Prepare mongodump command
  const dumpCmd =
    "mongodump --uri '" +
    dbUrl +
    "' --archive=dump/" +
    dumpFilename +
    ' --gzip';

  // Execute mongodump command
  exec(dumpCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return 0;
    } else {
      console.log('Successfully created database dump at dump/' + dumpFilename);

      const sendMail = require('../utils/emails').emailDatabaseBackup(
        dumpFilename
      );
    }
  });
};

module.exports = { createBackup };
