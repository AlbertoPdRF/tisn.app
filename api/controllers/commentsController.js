const Comment = require('../models/Comment');

exports.get = (req, res, next) => {
  return Comment.find({ event: req.params.eventId })
    .populate('user', 'name avatar')
    .then((comments) => {
      if (!comments) {
        return res.sendStatus(400);
      }

      res.json({ comments });
    });
};

exports.post = (req, res, next) => {
  const {
    body: { comment },
  } = req;

  if (!comment.event) {
    return res.status(422).json({
      errors: {
        event: 'is required',
      },
    });
  }

  if (!comment.user) {
    return res.status(422).json({
      errors: {
        user: 'is required',
      },
    });
  }

  if (!comment.content) {
    return res.status(422).json({
      errors: {
        content: 'is required',
      },
    });
  }

  const finalComment = new Comment(comment);

  return finalComment.save().then(() => res.json({ comment: finalComment }));
};
