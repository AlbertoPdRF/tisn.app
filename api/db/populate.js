#! /usr/bin/env node

const minimist = require('minimist');
const { connectMongoDb, closeMongoDb } = require('./db-connection');
const { createInterests } = require('./populate-interests');
const { createUsers } = require('./populate-users');

const userArgs = minimist(process.argv.slice(2), {
  boolean: ['random-location', 'verbose'],
  number: 'multiplier',
  string: 'collection',
  alias: {
    c: 'collection',
    m: 'multiplier',
    r: 'random-location',
    v: 'verbose',
  },
  default: { multiplier: 1 },
});

const populateCollections = async () => {
  connectMongoDb();
  await createInterests(userArgs.v);
  await createUsers(userArgs.m, userArgs.r, userArgs.v);
  closeMongoDb();
};

const populateCollection = async () => {
  connectMongoDb();
  switch (userArgs.c.toLowerCase()) {
    case 'interests':
      await createInterests(userArgs.v);
      break;
    case 'users':
      await createUsers(userArgs.m, userArgs.r, userArgs.v);
      break;
    default:
      console.log(
        `Unknown collection '${userArgs.c}', possible options are: [interests, users]`
      );
      break;
  }
  closeMongoDb();
};

userArgs.c ? populateCollection() : populateCollections();
