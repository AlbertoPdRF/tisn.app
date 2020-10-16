const { getParagraph } = require('./utils');
const {
  createNotification,
  notificationTypes,
} = require('./populate-notifications');

const Event = require('../models/Event');
const Attendant = require('../models/Attendant');
const Comment = require('../models/Comment');

let displayLogs;
let notificationsCount = 0;

const prerequisites = (eventsCount, attendantsCount) => {
  if (eventsCount === 0 && attendantsCount === 0) {
    console.log(
      '\x1b[33m',
      'Attendants and events collection do not exist. Aborted comments collection population'
    );
    return false;
  } else if (eventsCount === 0) {
    console.log(
      '\x1b[33m',
      'Events collection does not exist. Aborted comments collection population'
    );
    return false;
  } else if (attendantsCount === 0) {
    console.log(
      '\x1b[33m',
      'Attendants collection does not exist. Aborted comments collection population'
    );
    return false;
  }
  return true;
};

const getParentComment = (comments) => {
  const parentComments = comments.filter((comment) => !comment.parentComment);
  return parentComments[Math.floor(Math.random() * parentComments.length)];
};

const createComment = async (commentParams) => {
  const comment = new Comment(commentParams);
  await comment.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New comment created: ${comment}`);
  }
  return comment;
};

const createComments = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating comments collection...');
  displayLogs = verbose;

  const eventsList = await Event.distinct('_id');
  const attendantsList = await Attendant.find();
  const eventsCount = eventsList.length;
  const attendantsCount = attendantsList.length;

  if (!prerequisites(eventsCount, attendantsCount)) return;

  const commentsArray = [];
  for (const event of eventsList) {
    // Find attendants for event
    const eventAttendants = attendantsList.filter(
      (attendant) => attendant.event.toString() === event.toString()
    );
    const eventComments = await Comment.find({ event });

    // Number of comments to generate
    const commentsCount = Math.floor(Math.random() * 20);
    for (let i = 0; i <= commentsCount; i++) {
      const user =
        eventAttendants[Math.floor(Math.random() * eventAttendants.length)]
          .user;
      const content = getParagraph();
      const parentComment =
        Math.random() <= 0.5 ? getParentComment(eventComments) : null;

      const commentParams = {
        event,
        user,
        content,
      };
      if (parentComment) commentParams.parentComment = parentComment;

      const comment = await createComment(commentParams);
      eventComments.push(comment);
      commentsArray.push(comment);

      for (const attendee of eventAttendants) {
        if (attendee.user.toString() === comment.user.toString()) continue;
        await createNotification(
          {
            user: attendee.user,
            type: notificationTypes[5],
            read: false,
            referencedUser: comment.user,
            referencedEvent: comment.event,
          },
          displayLogs
        );
        notificationsCount++;
      }
    }
  }

  console.log(
    '\x1b[32m',
    `Created ${commentsArray.length} comments (and ${notificationsCount} related notifications)`
  );
};

module.exports = { createComments };
