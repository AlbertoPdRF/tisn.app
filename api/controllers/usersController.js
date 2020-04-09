const User = require('../models/User');

const passport = require('passport');

exports.get = (req, res, next) => {
  return User.find()
    .populate('interests', 'name avatar')
    .then(users => {
      if (!users) {
        return res.sendStatus(400);
      }

      res.json({ users });
    });
};

exports.post = (req, res, next) => {
  const { body: { user } } = req;

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

  const finalUser = new User(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
};



exports.getId = (req, res, next) => {
  return User.findById(req.params.id)
    .populate('interests', 'name avatar')
    .then(user => {
      if (!user) {
        return res.sendStatus(400);
      }

      res.json({ user });
    });
};



exports.logIn = (req, res, next) => {
  const { body: { user } } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
};
