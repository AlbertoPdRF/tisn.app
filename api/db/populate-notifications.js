const Notification = require('../models/Notification');

const notificationTypes = [
  'confirmEmail',
  'createEvent',
  'uploadAvatar',
  'selectInterests',
  'newAttendant',
  'newComment',
  'newFriendshipRequest',
  'acceptedFriendshipRequest',
  'newMessage',
];

const createNotification = async (notificationParams, verbose = false) => {
  const notification = new Notification(notificationParams);
  if (notification.read) notification.readAt = new Date();
  await notification.save();

  if (verbose) {
    console.log('\n', '\x1b[0m', `New notification created: ${notification}`);
  }
  return notification;
};

module.exports = { notificationTypes, createNotification };
