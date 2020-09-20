const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const validator = require('validator');

const User = require('../models/User');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]',
    },
    (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user || !user.validatePassword(password)) {
            return done(null, false, {
              error: { 'email or password': 'is invalid' },
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);

passport.use(
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({
        email: validator.normalizeEmail(profile.emails[0].value),
      })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              error: { email: 'is invalid' },
            });
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);
