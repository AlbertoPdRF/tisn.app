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
    lastMessageAt: friendshipParams.lastMessageAt,
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
  let recordCount = friendshipsArray.length;

  let proceed = true;
  if (recordCount > 0) {
    proceed = await createPrompt(
      'Some users already have friends. Would you like to add friends to users that already contain friends?'
    );
  }

  for (const user of usersList) {
    const containFriends = friendshipsArray.some(
      (friendship) =>
        friendship.requestant.toString() === user.toString() ||
        friendship.receivant.toString() === user.toString()
    );
    console.log('Contains friends', containFriends);
    if (!proceed && containFriends) {
      console.log('Did not proceed');
      continue;
    }
    // split current user from all others
    const tmpList = usersList.filter((userValue) => userValue != user);
    // create subset userList from remaining usersList
    const usersSubset = getRandomSubset(tmpList, tmpList.length);

    for (const receivant of usersSubset) {
      const alreadFriends = friendshipsArray.filter((friendship) => {
        return (
          (friendship.requestant.toString() === user.toString() &&
            friendship.receivant.toString() === receivant.toString()) ||
          (friendship.requestant.toString() === receivant.toString() &&
            friendship.receivant.toString() === user.toString())
        );
      });
      if (alreadFriends.length > 0) continue;

      const now = new Date();
      const acceptedAt = getRandomDate(
        new Date(2020, 4, 4),
        new Date(now.getTime() - 60000)
      );
      const friendshipParams = {
        requestant: user,
        receivant,
        accepted: Math.random() > 0.1 ? true : false,
        acceptedAt,
        lastMessageAt: getRandomDate(acceptedAt, now),
      };

      friendshipsArray.push(await createFriendship(friendshipParams));
    }
  }
  console.log(
    '\x1b[32m',
    `Created ${friendshipsArray.length - recordCount} friendships`
  );
};

module.exports = { createFriendships };
