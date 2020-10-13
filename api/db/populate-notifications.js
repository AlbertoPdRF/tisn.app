const User = require('../models/User');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');
const Comment = require('../models/Comment');
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const types = [
  'newAttendant',
  'newComment',
  'newFriendshipRequest',
  'acceptedFriendshipRequest',
  'newMessage',
];

let displayLogs;
let eventsList;
let attendantsList;
let commentsList;
let friendshipsList;
let messagesList;

const getEvent = (user) => {
  const events = eventsList.filter(
    (event) => event.createdBy.toString() === user._id.toString()
  );
  return events[Math.floor(Math.random() * events.length)];
};

const getNewAttendant = (user) => {
  const event = getEvent(user);
  if (!event) return;
  const attendees = attendantsList.filter(
    (attendee) =>
      attendee.event.toString() === event._id.toString() &&
      attendee.user.toString() !== user._id.toString()
  );
  return attendees[Math.floor(Math.random() * attendees.length)];
};

const getNewComment = (user) => {
  const event = getEvent(user);
  if (!event) return;
  const comments = commentsList.filter((comment) => {
    return (
      comment.event.toString() === event._id.toString() &&
      comment.user.toString() !== user._id.toString()
    );
  });
  return comments[Math.floor(Math.random() * comments.length)];
};

const getNewFriendRequest = (user) => {
  const friendships = friendshipsList.filter((friendship) => {
    return (
      !friendship.accepted &&
      friendship.receivant.toString() === user._id.toString()
    );
  });
  return friendships[Math.floor(Math.random() * friendships.length)];
};

const getAcceptedFriendRequest = (user) => {
  const friendships = friendshipsList.filter((friendship) => {
    return (
      friendship.accepted &&
      friendship.requestant.toString() === user._id.toString()
    );
  });
  return friendships[Math.floor(Math.random() * friendships.length)];
};

const getNewMessage = (user) => {
  const friendships = friendshipsList.filter((friendship) => {
    return (
      friendship.requestant.toString() === user._id.toString() ||
      friendship.receivant.toString() === user._id.toString()
    );
  });
  const friendship =
    friendships[Math.floor(Math.random() * friendships.length)];
  const messages = messagesList.filter((message) => {
    return (
      message.friendship.toString() === friendship._id.toString() &&
      message.user.toString() !== user._id.toString()
    );
  });
  return messages[Math.floor(Math.random() * messages.length)];
};

const createNotification = async (notificationParams) => {
  const notification = new Notification({
    user: notificationParams.user,
    type: notificationParams.type,
    read: notificationParams.read,
  });

  switch (notification.type) {
    case types[0]:
      const attendee = getNewAttendant(notification.user);
      if (!attendee) return;
      notification.referencedUser = attendee.user;
      notification.referencedEvent = attendee.event;
      break;
    case types[1]:
      const comment = getNewComment(notification.user);
      if (!comment) return;
      notification.referencedUser = comment.user;
      notification.referencedEvent = comment.event;
      break;
    case types[2]:
      const friendRequest = getNewFriendRequest(notification.user);
      if (!friendRequest) return;
      notification.referencedUser = friendRequest.requestant;
      notification.referencedFriendship = friendRequest;
      break;
    case types[3]:
      const acceptedFriendRequest = getAcceptedFriendRequest(notification.user);
      if (!acceptedFriendRequest) return;
      notification.referencedUser = acceptedFriendRequest.receivant;
      notification.referencedFriendship = acceptedFriendRequest;
      break;
    case types[4]:
      const message = getNewMessage(notification.user);
      if (!message) return;
      notification.referencedUser = message.user;
      notification.referencedFriendship = message.friendship;
      break;
    default:
      return;
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
  eventsList = await Event.find();
  attendantsList = await Attendant.find();
  commentsList = await Comment.find();
  friendshipsList = await Friendship.find();
  messagesList = await Message.find();

  for (const user of usersList) {
    const notificationsCount = Math.floor(Math.random() * 5);

    for (let i = 0; i < notificationsCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const read = Math.random() > 0.5;

      const notificationParams = {
        user,
        type,
        read,
      };

      notificationsArray.push(await createNotification(notificationParams));
    }
  }

  console.log('\x1b[32m', `Created ${notificationsArray.length} notifications`);
};

module.exports = { createNotifications };
