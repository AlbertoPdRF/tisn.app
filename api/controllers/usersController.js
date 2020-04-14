const User = require('../models/User');

const passport = require('passport');

exports.get = (req, res, next) => {
  return User.find()
    .populate('interests', 'name avatar')
    .then((users) => {
      if (!users) {
        return res.sendStatus(400);
      }

      res.json({ users: users.map((user) => user.toJson()) });
    });
};

exports.post = (req, res, next) => {
  const {
    body: { user },
  } = req;

  if (!user.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  if (!user.dateOfBirth) {
    return res.status(422).json({
      errors: {
        dateOfBirth: 'is required',
      },
    });
  }

  if (user.admin) {
    return res.status(403).json({
      error: 'not enough permissions to perform the requested action',
    });
  }

  const finalUser = new User(user);

  finalUser.setPassword(user.password);

  return finalUser
    .save()
    .then(() => res.json({ user: finalUser.toAuthJson() }));
};

exports.getId = (req, res, next) => {
  return User.findById(req.params.id)
    .populate('interests', 'name avatar')
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }

      res.json({ user: user.toJson() });
    });
};

exports.putId = (req, res, next) => {
  const {
    body: { user },
  } = req;

  if (!user.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.dateOfBirth) {
    return res.status(422).json({
      errors: {
        dateOfBirth: 'is required',
      },
    });
  }

  if (user.admin && !req.payload.admin) {
    return res.status(403).json({
      error: 'not enough permissions to perform the requested action',
    });
  }

  User.findByIdAndUpdate(req.params.id, user, { new: true })
    .populate('interests', 'name avatar')
    .then((updatedUser) => res.json({ user: updatedUser.toJson() }));
};

exports.logIn = (req, res, next) => {
  const {
    body: { user },
  } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate(
    'local',
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();

        return res.json({ user: user.toAuthJson() });
      }

      return status(400).info;
    }
  )(req, res, next);
};
