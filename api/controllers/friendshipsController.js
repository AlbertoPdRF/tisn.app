const Friendship = require('../models/Friendship');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const async = require('async');

exports.get = (req, res, next) => {
  const id = req.params.userId;
  return Friendship.find()
    .or([{ requestant: id }, { receivant: id }])
    .populate({
      path: 'requestant',
      select: 'name avatar interests',
      populate: {
        path: 'interests',
        model: 'Interest',
        select: 'name avatar',
      },
    })
    .populate({
      path: 'receivant',
      select: 'name avatar interests',
      populate: {
        path: 'interests',
        model: 'Interest',
        select: 'name avatar',
      },
    })
    .sort([
      ['acceptedAt', -1],
      ['createdAt', -1],
    ])
    .then((friendships) => res.json({ friendships }));
};

exports.post = (req, res, next) => {
  const {
    body: { friendship },
  } = req;

  if (
    friendship.accepted ||
    friendship.acceptedAt ||
    friendship.lastMessageAt
  ) {
    return res.status(403).json({
      errors: [
        {
          param: 'Permissions',
          msg: "aren't enough",
        },
      ],
    });
  }

  const finalFriendship = new Friendship(friendship);

  return finalFriendship.save().then(() => {
    const notification = new Notification({
      user: friendship.receivant._id,
      type: 'newFriendshipRequest',
      referencedUser: friendship.requestant._id,
    });
    notification.save();

    res.json({ friendship: finalFriendship });
  });
};

exports.getId = (req, res, next) => {
  return Friendship.findOne({
    _id: req.params.friendshipId,
    accepted: true,
  })
    .populate({
      path: 'requestant',
      select: 'name avatar interests',
      populate: {
        path: 'interests',
        model: 'Interest',
        select: 'name avatar',
      },
    })
    .populate({
      path: 'receivant',
      select: 'name avatar interests',
      populate: {
        path: 'interests',
        model: 'Interest',
        select: 'name avatar',
      },
    })
    .then((friendship) => res.json({ friendship }));
};

exports.putId = (req, res, next) => {
  const {
    body: { friendship },
  } = req;

  Friendship.findOneAndUpdate(
    {
      _id: req.params.friendshipId,
      receivant: req.payload._id,
    },
    friendship,
    { new: true }
  ).then((updatedFriendship) => {
    if (!updatedFriendship) {
      return res.sendStatus(404);
    }

    const notification = new Notification({
      user: friendship.requestant._id,
      type: 'acceptedFriendshipRequest',
      referencedUser: friendship.receivant._id,
    });
    notification.save();

    res.json({ friendship: updatedFriendship });
  });
};

exports.deleteId = (req, res, next) => {
  const id = req.params.friendshipId;
  async.parallel(
    {
      friendship: (callback) => Friendship.findByIdAndRemove(id).exec(callback),
      messages: (callback) =>
        Message.deleteMany({ friendship: id }).exec(callback),
    },
    (error, results) => {
      if (error) {
        return next(error);
      }

      if (!results) {
        return res.sendStatus(404);
      }

      res.json({
        friendship: results.friendship,
        messages: results.messages,
      });
    }
  );
};
