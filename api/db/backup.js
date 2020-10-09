const exec = require('child_process').exec;
const database = require('./connection');

const createBackup = () => {
  // Retrieve database URL
  const dbUrl = database.getDbUrl();

  // Prepare database archive filename
  currentDate = new Date();

  let databaseDumpFilename =
    'tisn_db_dump_' +
    currentDate.getFullYear() +
    '_' +
    (currentDate.getMonth() + 1) +
    '_' +
    currentDate.getDate() +
    '.gz';

  // Prepare mongodump command
  let dumpCmd =
    "mongodump --uri '" +
    dbUrl +
    "' --archive=dump/" +
    databaseDumpFilename +
    ' --gzip';

  // Execute mongodump command
  exec(dumpCmd, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return 0;
    } else {
      console.log(
        'Successfully created database dump at dump/' + databaseDumpFilename
      );

      let sendMail = require('../utils/emails').emailDatabaseBackup(
        databaseDumpFilename
      );
    }
  });
};

module.exports = { createBackup };
