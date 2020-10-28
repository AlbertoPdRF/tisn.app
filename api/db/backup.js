const exec = require('child_process').exec;
const path = require('path');
const mongodbUri = require('mongodb-uri');
const { getDbUrl } = require('./connection');

const createBackup = () => {
  // Remove database (and options) from URI to allow full database dumps
  const parsedUri = mongodbUri.parse(getDbUrl());
  delete parsedUri.database;
  delete parsedUri.options;
  const uri = mongodbUri.format(parsedUri);

  const dumpsPath = path.join(__dirname, 'dumps');

  const now = new Date();

  const dumpFilename = `${now.getFullYear()}${
    now.getMonth() + 1
  }${now.getDate()}.gz`;

  const dumpCmd = `mongodump --uri='${uri}' --gzip --archive='${dumpsPath}/${dumpFilename}' --oplog`;

  exec(dumpCmd, (error, stdout, stderr) => {
    if (!error) require('../utils/emails').dbBackup(dumpFilename);
  });
};

module.exports = { createBackup };
