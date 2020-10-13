#! /usr/bin/env node

const minimist = require('minimist');
const { connectDb, closeDb } = require('./connection');
const { createPrompt } = require('./utils');

const Interest = require('../models/Interest');
const User = require('../models/User');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');
const Comment = require('../models/Comment');
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');

const getInterestsCount = async () => await Interest.countDocuments();
const getUsersCount = async () => await User.countDocuments();
const getEventsCount = async () => await Event.countDocuments();
const getAttendantsCount = async () => await Attendant.countDocuments();
const getCommentsCount = async () => await Comment.countDocuments();
const getFriendshipsCount = async () => await Friendship.countDocuments();
const getMessagesCount = async () => await Message.countDocuments();

const userArgs = minimist(process.argv.slice(2), {
  string: 'collection',
  alias: {
    c: 'collection',
  },
});

const dropInterests = async () => {
  console.log('\n', '\x1b[0m', 'Dropping interests collection...');
  if ((await getInterestsCount()) !== 0) {
    await Interest.collection.drop();
    console.log('\x1b[31m', 'Dropped interests collection');
  } else {
    console.log('\x1b[33m', 'Interests collection is already empty');
  }

  if ((await getUsersCount()) !== 0) {
    const drop = await createPrompt(
      'The users collection is dependent on the users collection. Drop users collection?'
    );

    if (drop) await dropUsers(drop);
  }
};

const dropUsers = async (confirmed = false) => {
  console.log('\n', '\x1b[0m', 'Dropping users collection...');
  if (confirmed || (await getUsersCount()) !== 0) {
    await User.collection.drop();
    console.log('\x1b[31m', 'Dropped users collection');
  } else {
    console.log('\x1b[33m', 'Users collection is already empty');
    return;
  }

  if ((await getEventsCount()) !== 0) {
    const drop = await createPrompt(
      'The events collection is dependent on the users collection. Drop events collection?'
    );

    if (drop) await dropEvents(drop);
  }

  if ((await getFriendshipsCount()) !== 0) {
    const drop = await createPrompt(
      'The friendships collection is dependent on the users collection. Drop friendships collection?'
    );

    if (drop) await dropFriendships(drop);
  }
};

const dropEvents = async (confirmed = false) => {
  console.log('\n', '\x1b[0m', 'Dropping events collection...');
  if (confirmed || (await getEventsCount()) !== 0) {
    await Event.collection.drop();
    console.log('\x1b[31m', 'Dropped events collection');
  } else {
    console.log('\x1b[33m', 'Events collection is already empty');
    return;
  }

  if ((await getAttendantsCount()) !== 0) {
    const drop = await createPrompt(
      'The attendants collection is dependent on the events collection. Drop attendants collection?'
    );

    if (drop) await dropAttendants(drop);
  }

  if ((await getCommentsCount()) !== 0) {
    const drop = await createPrompt(
      'The comments collection is dependent on the events collection. Drop comments collection?'
    );

    if (drop) await dropComments(drop);
  }
};

const dropAttendants = async (confirmed = false) => {
  console.log('\n', '\x1b[0m', 'Dropping attendants collection...');
  if (confirmed || (await getAttendantsCount()) !== 0) {
    await Attendant.collection.drop();
    console.log('\x1b[31m', 'Dropped attendants collection');
  } else {
    console.log('\x1b[33m', 'Attendants collection is already empty');
  }
};

const dropComments = async (confirmed = false) => {
  console.log('\n', '\x1b[0m', 'Dropping comments collection...');
  if (confirmed || (await getCommentsCount()) !== 0) {
    await Comment.collection.drop();
    console.log('\x1b[31m', 'Dropped comments collection');
  } else {
    console.log('\x1b[33m', 'Comments collection is already empty');
  }
};

const dropFriendships = async (confirmed = false) => {
  console.log('\n', '\x1b[0m', 'Dropping friendships collection...');
  if (confirmed || (await getFriendshipsCount()) !== 0) {
    await Friendship.collection.drop();
    console.log('\x1b[31m', 'Dropped friendships collection');
  } else {
    console.log('\x1b[33m', 'Friendships collection is already empty');
  }

  if ((await getMessagesCount()) !== 0) {
    const drop = await createPrompt(
      'The messages collection is dependent on the friendships collection. Drop messages collection?'
    );

    if (drop) await dropMessages(drop);
  }
};

const dropMessages = async (confirmed = false) => {
  console.log('\n', '\x1b[0m', 'Dropping messages collection...');
  if (confirmed || (await getMessagesCount()) !== 0) {
    await Message.collection.drop();
    console.log('\x1b[31m', 'Dropped messages collection');
  } else {
    console.log('\x1b[33m', 'Messages collection is already empty');
  }
};

const dropCollections = async () => {
  connectDb();
  await dropMessages();
  await dropFriendships();
  await dropComments();
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
    case 'comments':
      await dropComments();
      break;
    case 'friendships':
      await dropFriendships();
      break;
    case 'messages':
      await dropMessages();
      break;
    default:
      console.log(
        `Unknown collection '${userArgs.c}', possible options are: [interests, users, events, attendants, comments, friendships, messages]`
      );
      break;
  }
  closeDb();
};

userArgs.c ? dropCollection() : dropCollections();
