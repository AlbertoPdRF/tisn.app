#! /usr/bin/env node

const minimist = require('minimist');
const { connectDb, closeDb } = require('./connection');
const { createAttendants } = require('./populate-attendants');
const { createComments } = require('./populate-comments');
const { createEvents } = require('./populate-events');
const { createFriendships } = require('./populate-friendships');
const { createInterests } = require('./populate-interests');
const { createMessages } = require('./populate-messages');
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
  connectDb();
  await createInterests(userArgs.v);
  await createUsers(userArgs.m, userArgs.r, userArgs.v);
  await createEvents(userArgs.m, userArgs.r, userArgs.v);
  await createAttendants(userArgs.v);
  await createComments(userArgs.v);
  await createFriendships(userArgs.v);
  await createMessages(userArgs.v);
  closeDb();
};

const populateCollection = async () => {
  connectDb();
  switch (userArgs.c.toLowerCase()) {
    case 'interests':
      await createInterests(userArgs.v);
      break;
    case 'users':
      await createUsers(userArgs.m, userArgs.r, userArgs.v);
      break;
    case 'events':
      await createEvents(userArgs.m, userArgs.r, userArgs.v);
      break;
    case 'attendants':
      await createAttendants(userArgs.v);
      break;
    case 'comments':
      await createComments(userArgs.v);
      break;
    case 'friendships':
      await createFriendships(userArgs.v);
      break;
    case 'messages':
      await createMessages(userArgs.v);
      break;
    default:
      console.log(
        `Unknown collection '${userArgs.c}', possible options are: [interests, users, events, attendants, comments, friendships, messages]`
      );
      break;
  }
  closeDb();
};

userArgs.c ? populateCollection() : populateCollections();
