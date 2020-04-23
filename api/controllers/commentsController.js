const Comment = require('../models/Comment');

exports.get = (req, res, next) => {
  return Comment.find({ event: req.params.eventId })
    .populate('user', 'name avatar')
    .then((comments) => res.json({ comments }));
};

exports.post = (req, res, next) => {
  const comment = new Comment(req.body.comment);

  return comment.save().then(() => res.json({ comment }));
};
