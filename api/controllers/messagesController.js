const Message = require('../models/Message');

exports.get = (req, res, next) => {
  return Message.find({
    friendship: req.params.friendshipId,
  }).then((messages) => res.json({ messages }));
};

exports.post = (req, res, next) => {
  const message = new Message(req.body.message);

  return message.save().then(() => res.json({ message }));
};
