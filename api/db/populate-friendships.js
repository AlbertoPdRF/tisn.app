const User = require('../models/User');
const Friendship = require('../models/Friendship');

let displayLogs;

const createFriendship = async (friendshipParams) => {
  const friendship = new Friendship({
    requestant: friendshipParams.requestant,
    receivant: friendshipParams.receivant,
    accepted: friendshipParams.accepted,
    acceptedAt: friendshipParams.acceptedAt,
    lastMessageAt: friendshipParams.lastMessageAt,
  });
  await friendship.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New friendship created: ${friendship}`);
  }
};

const createFriendships = async () => {};

module.exports = { createFriendships };
