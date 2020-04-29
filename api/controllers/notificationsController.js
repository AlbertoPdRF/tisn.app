const Notification = require('../models/Notification');

exports.get = (req, res, next) => {
  return Notification.find({
    user: req.params.userId,
  }).then((notifications) => res.json({ notifications }));
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
