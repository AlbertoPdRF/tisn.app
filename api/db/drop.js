#! /usr/bin/env node

const minimist = require('minimist');
const { connectDb, closeDb } = require('./connection');

const Interest = require('../models/Interest');
const User = require('../models/User');

const userArgs = minimist(process.argv.slice(2), {
  string: 'collection',
  alias: {
    c: 'collection',
  },
});

const dropInterests = async () => {
  console.log('\n', '\x1b[0m', 'Dropping interests collection...');
  if ((await Interest.countDocuments()) !== 0) {
    await Interest.collection.drop();
    console.log('\x1b[31m', 'Dropped interests collection');
  } else {
    console.log('\x1b[33m', 'Interests collection is already empty');
  }
};

const dropUsers = async () => {
  console.log('\n', '\x1b[0m', 'Dropping users collection...');
  if ((await User.countDocuments()) !== 0) {
    await User.collection.drop();
    console.log('\x1b[31m', 'Dropped users collection');
  } else {
    console.log('\x1b[33m', 'Users collection is already empty');
  }
};

const dropCollections = async () => {
  connectDb();
  await dropInterests();
  await dropUsers();
  closeDb();
};

const dropCollection = async () => {
  connectDb();
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
  closeDb();
};

userArgs.c ? dropCollection() : dropCollections();
