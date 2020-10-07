#! /usr/bin/env node

const minimist = require('minimist');
const { connectDb, closeDb } = require('./connection');

const Interest = require('../models/Interest');
const User = require('../models/User');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');
const { createPrompt } = require('./utils');

const interestCount = async () => await Interest.countDocuments();
const userCount = async () => await User.countDocuments();
const eventCount = async () => await Event.countDocuments();
const attendantCount = async () => await Attendant.countDocuments();

const userArgs = minimist(process.argv.slice(2), {
  string: 'collection',
  alias: {
    c: 'collection',
  },
});

const dropInterests = async () => {
  console.log('\n', '\x1b[0m', 'Dropping interests collection...');
  if (await interestCount() !== 0) {
    await Interest.collection.drop();
    console.log('\x1b[31m', 'Dropped interests collection');
  } else {
    console.log('\x1b[33m', 'Interests collection is already empty');
  }
};

const dropUsers = async () => {
  console.log('\n', '\x1b[0m', 'Dropping users collection...');
  if (await userCount() !== 0) {
    await User.collection.drop();
    console.log('\x1b[31m', 'Dropped users collection');
  } else {
    console.log('\x1b[33m', 'Users collection is already empty');
    return;
  }

  if (await eventCount() !== 0) {
    const drop = await createPrompt(
      'The events collection is dependent on the events collection. Drop events collection?'
    )

    if (drop) await dropEvents(drop);
  }
};

const dropEvents = async (confirmed = false) => {
  console.log('\n', '\x1b[0m', 'Dropping events collection...');
  if (confirmed || await eventCount() !== 0) {
    await Event.collection.drop();
    console.log('\x1b[31m', 'Dropped events collection');
  } else {
    console.log('\x1b[33m', 'Events collection is already empty');
    return;
  }

  if (await attendantCount() !== 0) {
    const drop = await createPrompt(
      'The attendants collection is dependent on the events collection. Drop attendants collection?'
    );

    if (drop) await dropAttendants(drop);
  }
};

const dropAttendants = async (confirmed = false) => {
  console.log('\n', '\x1b[0m', 'Dropping attendants collection...');
  if (confirmed || await attendantCount() !== 0) {
    await Attendant.collection.drop();
    console.log('\x1b[31m', 'Dropped attendants collection');
  } else {
    console.log('\x1b[33m', 'Attendants collection is already empty');
  }
}

const dropCollections = async () => {
  connectDb();
  await dropAttendants();
  await dropEvents();
  await dropUsers();
  await dropInterests();
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
    case 'attendants':
      await dropAttendants();
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
