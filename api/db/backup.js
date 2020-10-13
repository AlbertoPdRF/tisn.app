const exec = require('child_process').exec;
const path = require('path');
const parser = require('mongodb-uri');
const { getDbUrl } = require('./connection');

const createBackup = () => {
  // Remove database name from URI to allow full database dumps
  const uri = parser.parse(getDbUrl());
  const mongoDbUrl = `${uri['scheme']}://${uri['username']}:${uri['password']}@${uri['hosts'][0]['host']}/`;

  const dumpsPath = path.join(__dirname, 'dumps');

  const now = new Date();

  const dumpFilename = `${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}.gz`;

  const dumpCmd = `mongodump --uri='${mongoDbUrl}' --gzip --archive='${dumpsPath}/${dumpFilename}' --oplog`;

  exec(dumpCmd, (error, stdout, stderr) => {
    if (!error) require('../utils/emails').dbBackup(dumpFilename);
  });
};

module.exports = { createBackup };
