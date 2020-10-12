const { getRandomSubset, getRandomDate, createPrompt } = require('./utils');

const User = require('../models/User');
const Friendship = require('../models/Friendship');

let displayLogs;

const createFriendship = async (friendshipParams) => {
  const friendship = new Friendship({
    requestant: friendshipParams.requestant,
    receivant: friendshipParams.receivant,
    accepted: friendshipParams.accepted,
    acceptedAt: friendshipParams.acceptedAt,
  });
  await friendship.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New friendship created: ${friendship}`);
  }
  return friendship;
};

const createFriendships = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating friendships collection...');
  displayLogs = verbose;

  let usersList = await User.distinct('_id');
  const friendshipsArray = await Friendship.find();
  const documentsCount = friendshipsArray.length;

  for (const user of usersList) {
    // split current user from all others
    const tmpList = usersList.filter((userValue) => userValue !== user);
    // create subset userList from remaining usersList
    const usersSubset = getRandomSubset(tmpList, tmpList.length + 1);

    for (const receivant of usersSubset) {
      const alreadyAreFriends = friendshipsArray.some(
        (friendship) =>
          (friendship.requestant.toString() === user.toString() &&
            friendship.receivant.toString() === receivant.toString()) ||
          (friendship.requestant.toString() === receivant.toString() &&
            friendship.receivant.toString() === user.toString())
      );
      if (alreadyAreFriends) continue;

      const now = new Date();
      const acceptedAt = getRandomDate(new Date(2020, 4, 5), now);
      const friendshipParams = {
        requestant: user,
        receivant,
        accepted: Math.random() > 0.2,
        acceptedAt,
      };

      friendshipsArray.push(await createFriendship(friendshipParams));
    }
  }
  console.log(
    '\x1b[32m',
    `Created ${friendshipsArray.length - documentsCount} friendships`
  );
};

module.exports = { createFriendships };
