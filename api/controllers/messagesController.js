const Message = require('../models/Message');
const Friendship = require('../models/Friendship');
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
    message.friendship.lastMessageAt = new Date();
    Friendship.findByIdAndUpdate(
      message.friendship._id,
      message.friendship
    ).exec();

    const notification = new Notification({
      user:
        message.friendship.requestant._id === message.user._id
          ? message.friendship.receivant
          : message.friendship.requestant,
      type: 'Message',
      title: `New message from ${message.user.name}`,
      content: 'Go to your chat to see all unread messages',
      path: `/chats/${message.friendship._id}`,
    });
    notification.save();

    res.json({ message: finalMessage });
  });
};
