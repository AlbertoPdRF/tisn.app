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

const createFriendships = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating users collection...');
  displayLogs = verbose;

  let usersList = await User.distinct('_id');
  const friendshipsArray = [];

  for (const user of usersList) {
    // split current user from all others
    const tmpList = usersList.filter((userValue) => userValue != user);

    // create subset userList from remaining usersList
    // create friendship between current user and each subset user (if it doesn't exist)
    // (optional) set active flag random (5%)
  }
  // friendshipsArray.push(await createFriendship(friendshipParams));
  console.log('\x1b[32m', `Created ${friendshipsArray.length} friendships`);
};

module.exports = { createFriendships };
