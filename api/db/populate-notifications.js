const { createPrompt } = require('./utils');

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
  const notification = new Notification(notificationParams);
  if (notification.read) notification.readAt = new Date();

  await notification.save();

  // if (displayLogs) {
  //   console.log('\n', '\x1b[0m', `New notification created: ${notification}`);
  // }
  return notification;
};

const createNotifications = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating notifications collection...');
  displayLogs = verbose;

  if ((await Notification.countDocuments()) !== 0) {
    const proceed = await createPrompt(
      'The notifications collection already exists. If you continue, the existing collection will be dropped to avoid duplication. Do you want to continue?'
    );

    if (proceed) {
      await Notification.collection.drop();
      console.log('\x1b[31m', 'Dropped old notifications collection');
    } else {
      console.log('\x1b[33m', 'Aborted notifications collection population');
      return;
    }
  }

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
    // Confirm email notification
    notificationsArray.push(
      await createNotification({
        user,
        type: types[0],
        read,
      })
    );
    // Create event notification
    const userEvents = eventsList.filter(
      (event) => event.createdBy.toString() === user._id.toString()
    );
    read = userEvents.length > 0;
    notificationsArray.push(
      await createNotification({
        user,
        type: types[1],
        read,
      })
    );
    // Upload avatar notification
    read = user.avatar ? true : false;
    notificationsArray.push(
      await createNotification({
        user,
        type: types[2],
        read,
      })
    );
    // Select interests notification
    read = user.interests.length > 0;
    notificationsArray.push(
      await createNotification({
        user,
        type: types[3],
        read,
      })
    );

    // New attendee and new comment notifications
    for (const event of userEvents) {
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

        const comments = commentsList.filter(
          (comment) =>
            comment.event.toString() === event._id.toString() &&
            comment.user.toString() !== user._id.toString()
        );
        for (const comment of comments) {
          if (attendee.user.toString() === comment.user.toString()) continue;
          read = Math.random() > 0.5;
          const notificationParams = {
            user: attendee.user,
            type: types[5],
            read,
            referencedUser: comment.user,
            referencedEvent: comment.event,
          };
          notificationsArray.push(await createNotification(notificationParams));
        }
      }
    }

    // New friendship request notifications
    const friendshipRequests = friendshipsList.filter(
      (friendship) =>
        !friendship.accepted &&
        friendship.receivant.toString() === user._id.toString()
    );
    for (const friendRequest of friendshipRequests) {
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
    const acceptedFriendshipRequests = friendshipsList.filter(
      (friendship) =>
        friendship.accepted &&
        friendship.requestant.toString() === user._id.toString()
    );
    for (const acceptedFriendship of acceptedFriendshipRequests) {
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
    const userFriendships = friendshipsList.filter(
      (friendship) =>
        friendship.requestant.toString() === user._id.toString() ||
        friendship.receivant.toString() === user._id.toString()
    );
    for (const userfriendship of userFriendships) {
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

module.exports = { createNotification, createNotifications };
