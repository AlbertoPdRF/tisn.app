const Notification = require('../models/Notification');

exports.get = (req, res, next) => {
  return Notification.find({
    user: req.params.userId,
  })
    .populate('referencedUser', 'name')
    .populate('referencedEvent', 'name')
    .populate({
      path: 'referencedFriendship',
      populate: [
        {
          path: 'requestant',
          model: 'User',
          select: 'name avatar',
        },
        {
          path: 'receivant',
          model: 'User',
          select: 'name avatar',
        },
      ],
    })
    .sort([['createdAt', -1]])
    .then((notifications) => res.json({ notifications }));
};

exports.putId = (req, res, next) => {
  const {
    body: { notification },
  } = req;

  Notification.findByIdAndUpdate(req.params.notificationId, notification, {
    new: true,
  }).then((updatedNotification) => {
    if (!updatedNotification) {
      return res.sendStatus(404);
    }

    res.json({ updatedNotification });
  });
};
