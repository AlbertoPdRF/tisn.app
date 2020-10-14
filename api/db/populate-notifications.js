const User = require('../models/User');
const Interest = require('../models/Interest');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');
const Comment = require('../models/Comment');
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const types = [
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

const createNotification = async (notificationParams) => {
  const notification = new Notification({
    user: notificationParams.user,
    type: notificationParams.type,
    read: notificationParams.read,
  });
  if (notification.read) notification.readAt = new Date();
  if (notificationParams.referencedUser) {
    notification.referencedUser = notificationParams.referencedUser;
  }
  if (notificationParams.referencedEvent) {
    notification.referencedEvent = notificationParams.referencedEvent;
  }
  if (notificationParams.referencedFriendship) {
    notification.referencedFriendship = notificationParams.referencedFriendship;
  }

  await notification.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New notification created: ${notification}`);
  }
  return notification;
};

const createNotifications = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating notifications collection...');
  displayLogs = verbose;

  const notificationsArray = [];
  const usersList = await User.find();
  const eventsList = await Event.find();
  const attendantsList = await Attendant.find();
  const commentsList = await Comment.find();
  const friendshipsList = await Friendship.find();
  const messagesList = await Message.find();

  // For each user
  for (const user of usersList) {
    let read = user.emailConfirmed;
    // Email confirmation notification
    notificationsArray.push(
      await createNotification({
        user,
        type: types[0],
        read,
      })
    );
    // Create event notification
    read = eventsList.some(
      (event) => event.createdBy.toString === user._id.toString()
    );
    notificationsArray.push(
      await createNotification({
        user,
        type: types[1],
        read,
      })
    );
    // Create upload avatar notification
    read = user.avatar ? true : false;
    notificationsArray.push(
      await createNotification({
        user,
        type: types[2],
        read,
      })
    );
    // Selected interests notification
    const interests = await Interest.find({ user });
    read = interests.length > 0;
    notificationsArray.push(
      await createNotification({
        user,
        type: types[3],
        read,
      })
    );

    // Create attendee and comment notifications
    const usersEvents = eventsList.filter(
      (event) => event.createdBy.toString() === user._id.toString()
    );
    for (const event of usersEvents) {
      const attendees = attendantsList.filter(
        (attendee) =>
          attendee.event.toString() === event._id.toString() &&
          attendee.user.toString() !== user._id.toString()
      );
      for (const attendee of attendees) {
        read = Math.random() > 0.5;
        const notificationParams = {
          user,
          type: types[4],
          read,
          referencedUser: attendee.user,
          referencedEvent: event,
        };
        notificationsArray.push(await createNotification(notificationParams));
      }

      const comments = commentsList.filter(
        (comment) =>
          comment.event.toString() === event._id.toString() &&
          comment.user.toString() !== user._id.toString()
      );
      for (const comment of comments) {
        read = Math.random() > 0.5;
        const notificationParams = {
          user,
          type: types[5],
          read,
          referencedUser: comment.user,
          referencedEvent: comment.event,
        };
        notificationsArray.push(await createNotification(notificationParams));
      }
    }

    // New friendship request notification
    const friendRequests = friendshipsList.filter(
      (friendship) =>
        !friendship.accepted &&
        friendship.receivant.toString() === user._id.toString()
    );
    for (const friendRequest of friendRequests) {
      read = Math.random() > 0.5;
      const notificationParams = {
        user,
        type: types[6],
        read,
        referencedUser: friendRequest.requestant,
        referencedFriendship: friendRequest,
      };
      notificationsArray.push(await createNotification(notificationParams));
    }

    // Accepted friendship request notifications
    const acceptedFriendships = friendshipsList.filter(
      (friendship) =>
        friendship.accepted &&
        friendship.requestant.toString() === user._id.toString()
    );
    for (const acceptedFriendship of acceptedFriendships) {
      read = Math.random() > 0.5;
      const notificationParams = {
        user,
        type: types[7],
        read,
        referencedUser: acceptedFriendship.receivant,
        referencedFriendship: acceptedFriendship,
      };
      notificationsArray.push(await createNotification(notificationParams));
    }

    // New message notifications
    const userfriendships = friendshipsList.filter(
      (friendship) =>
        friendship.requestant.toString() === user._id.toString() ||
        friendship.receivant.toString() === user._id.toString()
    );
    for (const userfriendship of userfriendships) {
      const messages = messagesList.filter(
        (message) =>
          message.friendship.toString() === userfriendship._id.toString() &&
          message.user.toString() !== user._id.toString()
      );
      for (const message of messages) {
        read = Math.random() > 0.9;
        const notificationParams = {
          user,
          type: types[8],
          read,
          referencedUser: message.user,
          referencedFriendship: message.friendship,
        };
        notificationsArray.push(await createNotification(notificationParams));
      }
    }
  }

  console.log('\x1b[32m', `Created ${notificationsArray.length} notifications`);
};

module.exports = { createNotifications };
