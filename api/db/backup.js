const exec = require('child_process').exec;
const path = require('path');
const { getDbUrl } = require('./connection');

const createBackup = () => {
  const dumpsPath = path.join(__dirname, 'dumps');

  const now = new Date();

  const dumpFilename = `${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}.gz`;

  const dumpCmd = `mongodump --uri="${getDbUrl()}" --gzip --archive="${dumpsPath}/${dumpFilename}" --oplog`;

  exec(dumpCmd, (error, stdout, stderr) => {
    if (!error) require('../utils/emails').dbBackup(dumpFilename);
  });
};

module.exports = { createBackup };
