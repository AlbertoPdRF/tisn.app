const Message = require('../models/Message');
const Notification = require('../models/Notification');

exports.get = (req, res, next) => {
  return Message.find({
    friendship: req.params.friendshipId,
  }).then((messages) => res.json({ messages }));
};

exports.post = (req, res, next) => {
  const {
    body: { message },
  } = req;
  const finalMessage = new Message(message);

  return finalMessage.save().then(() => {
    const notification = new Notification({
      user:
        message.friendship.requestant._id === message.user._id
          ? message.friendship.receivant
          : message.friendship.requestant,
      type: 'Message',
      content: `New message from ${message.user.name}`,
      path: `/chats/${message.friendship._id}`,
    });
    notification.save();

    res.json({ message });
  });
};
