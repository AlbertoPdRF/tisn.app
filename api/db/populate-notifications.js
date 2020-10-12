const User = require('../models/User');
const Attendant = require('../models/Attendant');
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');
const Notifification = require('../models/Notification');

let displayLogs;
const types = [
  'newAttendant',
  'newComment',
  'newFriendshipRequest',
  'acceptedFriendshipRequest',
  'newMessage',
];

const createNotification = async (notificationParams) => {
  const notification = new Notification({
    user: notificationParams.user,
    type: notificationParams.type,
    referencedUser: notificationParams.referencedUser,
    referencedEvent: notificationParams.referencedEvent,
    referencedFriendship: notificationParams.referencedFriendship,
    read: notificationParams.read,
    readAt: notificationParams.readAt,
  });
  notification.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New notification created: ${notification}`);
  }
  return notification;
};

const createNotifications = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating notifications collection...');
  displayLogs = verbose;

  const usersList = await User.find();
  const attendantsList = await Attendant.find();
  const friendshipsList = await Friendship.find();
  const messagesList = await Message.find();

  for (const user of usersList) {
    const notificationsCount = Math.floor(Math.random() * 5);

    for (let i = 0; i < notificationsCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const notificationParams = {
        user,
        type,
      };
    }
  }

  // For each user
  // create between 0 and 4 notifications
  // types: [
  //   newAttendant => referencedUser,
  //   newComment => referencedUser,
  //   newFriendshipRequest => referencedFriendship,
  //   acceptedFriendshipRequest => referencedFriendship,
  //   newMessage => referencedFriendship (= requestant)
  // ]
};

module.exports = { createNotifications };
