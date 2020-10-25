const Comment = require('../models/Comment');
const Attendee = require('../models/Attendee');
const Notification = require('../models/Notification');

exports.get = (req, res, next) => {
  return Comment.find({ event: req.params.eventId })
    .populate('user', 'name avatar')
    .then((comments) => res.json({ comments }));
};

exports.post = (req, res, next) => {
  const {
    body: { comment },
  } = req;

  Attendee.find({ event: comment.event._id }).then((attendees) => {
    const finalComment = new Comment(comment);

    return finalComment.save().then(() => {
      attendees.forEach((attendee) => {
        if (attendee.user != comment.user._id) {
          const notification = new Notification({
            user: attendee.user,
            type: 'newComment',
            referencedUser: comment.user._id,
            referencedEvent: comment.event._id,
          });
          notification.save();
        }
      });

      res.json({ comment: finalComment });
    });
  });
};
