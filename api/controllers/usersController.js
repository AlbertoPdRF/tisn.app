const User = require('../models/User');
const Attendant = require('../models/Attendant');
const Event = require('../models/Event');
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

const passport = require('passport');
const async = require('async');
const mongoose = require('mongoose');

exports.get = (req, res, next) => {
  return User.find()
    .populate('interests', 'name avatar')
    .then((users) => {
      if (users.length === 0) {
        return res.sendStatus(404);
      }

      res.json({ users: users.map((user) => user.toJson()) });
    });
};

exports.post = (req, res, next) => {
  const {
    body: { user },
  } = req;

  if (user.admin) {
    return res.status(403).json({
      errors: [
        {
          param: 'Permissions',
          msg: "aren't enough",
        },
      ],
    });
  }

  const finalUser = new User(user);

  finalUser.setPassword(user.password);

  return finalUser
    .save()
    .then(() => res.json({ user: finalUser.toAuthJson() }));
};

exports.getId = (req, res, next) => {
  return User.findById(req.params.userId)
    .populate('interests', 'name avatar')
    .then((user) => {
      if (!user) {
        return res.sendStatus(404);
      }

      res.json({ user: user.toJson() });
    });
};

exports.putId = (req, res, next) => {
  const {
    body: { user },
  } = req;

  if (user.admin && !req.payload.admin) {
    return res.status(403).json({
      errors: [
        {
          param: 'Permissions',
          msg: "aren't enough",
        },
      ],
    });
  }

  User.findByIdAndUpdate(req.params.userId, user, { new: true })
    .populate('interests', 'name avatar')
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.sendStatus(404);
      }

      res.json({ user: updatedUser.toJson() });
    });
};

exports.deleteId = (req, res, next) => {
  const id = req.params.userId;
  async.parallel(
    {
      user: (callback) => User.findByIdAndRemove(id).exec(callback),
      attendants: (callback) =>
        Attendant.deleteMany({ user: id }).exec(callback),
      friendshipsAndMessages: (callback) =>
        async.waterfall(
          [
            (waterfallCallback) =>
              Friendship.find()
                .or([{ requestant: id }, { receivant: id }])
                .exec(waterfallCallback),
            (friendships, waterfallCallback) => {
              async.parallel(
                {
                  friendships: (parallelCallback) =>
                    Friendship.deleteMany({
                      _id: {
                        $in: friendships.map((friendship) => friendship._id),
                      },
                    }).exec(parallelCallback),
                  messages: (parallelCallback) =>
                    Message.deleteMany({
                      friendship: {
                        $in: friendships.map((friendship) => friendship._id),
                      },
                    }).exec(parallelCallback),
                },
                (error, results) => waterfallCallback(error, results)
              );
            },
          ],
          (error, result) => callback(error, result)
        ),
      notifications: (callback) =>
        Notification.deleteMany({ user: id }).exec(callback),
    },
    (error, results) => {
      if (error) {
        return next(error);
      }

      if (!results) {
        return res.sendStatus(404);
      }

      res.json({
        user: results.user.toJson(),
        attendants: results.attendants,
        friendshipsAndMessages: results.friendshipsAndMessages,
        notifications: results.notifications,
      });
    }
  );
};

exports.getEvents = (req, res, next) => {
  const id = req.params.userId;
  async.parallel(
    {
      attending: (callback) =>
        Attendant.aggregate(
          [
            { $match: { user: mongoose.Types.ObjectId(id) } },
            {
              $lookup: {
                from: 'events',
                localField: 'event',
                foreignField: '_id',
                as: 'event',
              },
            },
            { $unwind: { path: '$event' } },
            { $sort: { 'event.startDate': 1 } },
          ],
          callback
        ),
      created: (callback) =>
        Event.find({ createdBy: id }).sort('startDate').exec(callback),
    },
    (error, results) => {
      if (error) {
        return next(error);
      }

      if (!results) {
        return res.sendStatus(404);
      }

      res.json({
        events: {
          attending: results.attending.map((attendant) => attendant.event),
          created: results.created,
        },
      });
    }
  );
};

exports.logIn = (req, res, next) => {
  return passport.authenticate(
    'local',
    { session: false },
    (error, passportUser, info) => {
      if (error) {
        return next(error);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJson() });
      }

      return status(404).info;
    }
  )(req, res, next);
};
