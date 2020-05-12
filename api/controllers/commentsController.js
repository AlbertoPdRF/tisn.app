const Comment = require('../models/Comment');
const Attendant = require('../models/Attendant');
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

  Attendant.find({ event: comment.event._id }).then((attendants) => {
    const finalComment = new Comment(comment);

    return finalComment.save().then(() => {
      attendants.forEach((attendant) => {
        if (attendant.user != comment.user._id) {
          const notification = new Notification({
            user: attendant.user,
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
