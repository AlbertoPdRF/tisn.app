#! /usr/bin/env node

/*
Options:
1. Populate all db's
2. Populate individual db's
3. Talked about implementing log flags (verbose, pertinent)
4. Number of record's flag
  * Users
  * Events
*/

const minimist = require('minimist');
const { connectMongoDb, closeMongoDb } = require('./db-connection');
const { createInterests } = require('./populate-interests');
const { createUsers } = require('./populate-users');


const userArgs = minimist(process.argv.slice(2), {
  string: ['table', 'number'],
  boolean: ['verbose', 'admin'],
  default: {number: '100'},
  alias: [
    {a: 'admin'},
    {t: 'table'},
    {v: 'verbose'},
  ]
});

const populateAllTables = async () => {
  console.log('Populating all tables');
  connectMongoDb();
  await createInterests(userArgs.v);
  await createUsers(userArgs.v, userArgs.a, userArgs.number);
  closeMongoDb();
};

const populateSpecifiedTable = async () => {
  switch (userArgs.t.toLowerCase()) {
    case 'users':
      connectMongoDb();
      await createUsers(userArgs.v, userArgs.a, userArgs.number);
      closeMongoDb();
      break;
    case 'interests':
      connectMongoDb();
      await createInterests(userArgs.v);
      closeMongoDb();
      break;
    default:
      console.log('Table or script does not exist');
      break;
  };
};

console.log(userArgs);
userArgs.t ? populateSpecifiedTable() : populateAllTables();
