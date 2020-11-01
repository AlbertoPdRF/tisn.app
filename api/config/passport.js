const passport = require('passport');
const LocalStrategy = require('passport-local');

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
							errors: { 'email or password': 'is invalid' },
						});
					}

					return done(null, user);
				})
				.catch(done);
		}
	)
);
