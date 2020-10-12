const txtgen = require('txtgen');

const Event = require('../models/Event');
const Attendant = require('../models/Attendant');
const Comment = require('../models/Comment');

let displayLogs;

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

const createComment = async (commentParams) => {
  const comment = new Comment({
    event: commentParams.event,
    user: commentParams.user,
    content: commentParams.content,
    parentComment: commentParams.parentComment,
  });
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
    const commentCount = Math.floor(Math.random() * 20);
    for (let i = 0; i <= commentCount; i++) {
      const user =
        eventAttendants[Math.floor(Math.random() * eventAttendants.length)]
          .user;
      const content = txtgen.paragraph(Math.ceil(Math.random() * 3));
      const parentComment =
        Math.random() <= 0.2
          ? eventComments[Math.floor(Math.random() * eventComments.length)]
          : null;

      const commentParams = {
        event,
        user,
        content,
        parentComment,
      };

      const comment = await createComment(commentParams);
      eventComments.push(comment);
      commentsArray.push(comment);
    }
  }

  console.log('\x1b[32m', `Created ${commentsArray.length} comments`);
};

module.exports = { createComments };
