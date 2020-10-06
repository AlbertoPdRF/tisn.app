#! /usr/bin/env node

const minimist = require('minimist');
const Interest = require('../models/Interest');
const User = require('../models/User');
const { connectMongoDb, closeMongoDb } = require('./db-connection');

const userArgs = minimist(process.argv.slice(2), {
  string: 'collection',
  alias: {
    c: 'collection',
  },
});

const dropInterests = async () => {
  console.log('Dropping interests collection...');
  if ((await Interest.countDocuments()) !== 0) await Interest.collection.drop();
};

const dropUsers = async () => {
  console.log('Dropping users collection...');
  if ((await User.countDocuments()) !== 0) await User.collection.drop();
};

const deleteCollections = async () => {
  connectMongoDb();
  await dropInterests();
  await dropUsers();
  closeMongoDb();
};

const deleteCollection = async () => {
  connectMongoDb();
  switch (userArgs.c.toLowerCase()) {
    case 'interests':
      await dropInterests();
      break;
    case 'users':
      await dropUsers();
      break;
    default:
      console.log(
        `Unknown collection '${userArgs.c}', possible options are: [interests, users]`
      );
      break;
  }
  closeMongoDb();
};

userArgs.c ? deleteCollection() : deleteCollections();
