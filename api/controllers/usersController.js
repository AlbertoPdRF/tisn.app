const User = require('../models/User');
const Attendee = require('../models/Attendee');
const Event = require('../models/Event');
const Friendship = require('../models/Friendship');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Token = require('../models/Token');

const passport = require('passport');
const async = require('async');
const mongoose = require('mongoose');

const emails = require('../utils/emails');

exports.get = (req, res, next) => {
  const { query } = req;

  const filter = {};
  if (query.name) {
    filter.name = { $regex: query.name, $options: 'i' };
  }
  if (query.country) {
    filter.country = query.country;

    if (query.region) {
      filter.region = query.region;
    }
  }
  if (query.interests) {
    filter.interests = { $all: query.interests };
  }

  return User.find(filter)
    .populate('interests', 'name avatar')
    .collation({ locale: 'en' })
    .sort('name')
    .then((users) => res.json({ users: users.map((user) => user.toJson()) }));
};

exports.post = (req, res, next) => {
  const {
    body: { user },
  } = req;

  if (user.emailConfirmed || user.emailConfirmedAt || user.admin) {
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

  return finalUser.save().then(() => {
    const eventNotification = new Notification({
      user: finalUser._id,
      type: 'createEvent',
    });
    const avatarNotification = new Notification({
      user: finalUser._id,
      type: 'uploadAvatar',
    });
    const interestsNotification = new Notification({
      user: finalUser._id,
      type: 'selectInterests',
    });

    async.series([
      (callback) => {
        emails.emailConfirmation(req, finalUser);
        callback();
      },
      (callback) => {
        eventNotification.save();
        callback();
      },
      (callback) => {
        avatarNotification.save();
        callback();
      },
      (callback) => {
        interestsNotification.save();
        callback();
      },
    ]);

    res.json({ user: finalUser.toAuthJson() });
  });
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

  User.findById(req.params.userId).then((foundUser) => {
    if (!foundUser) {
      return res.sendStatus(404);
    }

    const oldEmail = foundUser.email;

    User.findByIdAndUpdate(req.params.userId, user, { new: true })
      .populate('interests', 'name avatar')
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.sendStatus(404);
        }

        if (updatedUser.email !== oldEmail) {
          emails.emailConfirmation(updatedUser);

          updatedUser.emailConfirmed = false;
          updatedUser.emailConfirmedAt = undefined;

          updatedUser.save();
        }

        res.json({ user: updatedUser.toJson() });
      });
  });
};

exports.deleteId = (req, res, next) => {
  const id = req.params.userId;
  async.parallel(
    {
      user: (callback) => User.findByIdAndRemove(id).exec(callback),
      attendees: (callback) =>
        Attendee.deleteMany({ user: id }).exec(callback),
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
        attendees: results.attendees,
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
        Attendee.aggregate(
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
          attending: results.attending.map((attendee) => attendee.event),
          created: results.created,
        },
      });
    }
  );
};

exports.sendEmailConfirmationEmail = (req, res, next) => {
  User.findById(req.params.userId).then((foundUser) => {
    if (!foundUser) {
      return res.sendStatus(404);
    }

    emails.emailConfirmation(req, foundUser);

    res.json({ user: foundUser.toJson() });
  });
};

exports.confirmEmail = (req, res, next) => {
  Token.findOne({ user: req.params.userId, token: req.query.token }).then(
    (token) => {
      if (!token) {
        return res.sendStatus(404);
      }

      User.findByIdAndUpdate(
        token.user,
        {
          emailConfirmed: true,
          emailConfirmedAt: new Date(),
        },
        { new: true }
      ).then((updatedUser) => {
        if (!updatedUser) {
          return res.sendStatus(404);
        }

        res.json({ user: updatedUser.toJson() });
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
