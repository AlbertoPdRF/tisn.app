#! /usr/bin/env node

const minimist = require('minimist');
const { connectDb, closeDb } = require('./connection');

const Interest = require('../models/Interest');
const User = require('../models/User');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');

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

const dropEvents = async () => {
  console.log('\n', '\x1b[0m', 'Dropping events and attendants collection...');
  if ((await Event.countDocuments()) !== 0) {
    await Event.collection.drop();
    console.log('\x1b[31m', 'Dropped events collection');
  } else {
    console.log('\x1b[33m', 'events collection is already empty');
  }

  if ((await Attendant.countDocuments()) !== 0) {
    await Attendant.collection.drop();
    console.log('\x1b[31m', 'Dropped attendants collection');
  } else {
    console.log('\x1b[33m', 'attendants collection is already empty');
  }
};

const dropCollections = async () => {
  connectDb();
  await dropInterests();
  await dropUsers();
  await dropEvents();
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
    case 'events':
      await dropEvents();
      break;
    default:
      console.log(
        `Unknown collection '${userArgs.c}', possible options are: [interests, users, events]`
      );
      break;
  }
  closeDb();
};

userArgs.c ? dropCollection() : dropCollections();
