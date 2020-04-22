const validator = require('express-validator');

const User = require('../models/User');
const Interest = require('../models/Interest');
const Event = require('../models/Event');

const buildValidator = (type, param, logIn = false) => {
  const basic = validator.check(param).trim();
  const escaped = validator.check(param).trim().escape();
  const required = validator
    .check(param)
    .trim()
    .escape()
    .notEmpty()
    .withMessage('is required');

  switch (type) {
    case 'name':
      return required
        .isLength({ max: 20 })
        .withMessage('too long')
        .matches(/^[a-z ]+$/i)
        .withMessage('must have letters (and spaces) only');
    case 'email':
      return required
        .isEmail()
        .withMessage('is invalid')
        .normalizeEmail()
        .custom((email, { req }) =>
          User.findOne({ email }).then((data) => {
            if (!logIn && data && data._id != req.params.userId) {
              throw new Error('a user with this email already exists');
            }

            return email;
          })
        );
    case 'password':
      return required
        .isLength({ min: logIn ? 0 : 8 })
        .withMessage('must be at least 8 characters long');
    case 'confirmPassword':
      return required.custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.user.password) {
          throw new Error("doesn't match");
        }

        return confirmPassword;
      });
    case 'date':
      return required
        .isISO8601()
        .withMessage('is invalid')
        .toDate()
        .custom((date, { req }) => {
          if (param.includes('Birth')) {
            const dateForMinimumAge = new Date();
            dateForMinimumAge.setFullYear(dateForMinimumAge.getFullYear() - 14);
            const maximumDate = new Date();
            maximumDate.setFullYear(maximumDate.getFullYear() - 100);
            if (date > dateForMinimumAge) {
              throw new Error('you must be at least 14 years old');
            } else if (date < maximumDate) {
              throw new Error('seems wrong');
            }
          } else {
            const now = new Date();
            if (date < now) {
              throw new Error('must be in the future');
            }

            if (param.includes('end') && date < req.body.event.startDate) {
              throw new Error('must be after start date');
            }
          }

          return date;
        });
    case 'userId':
      return escaped
        .isMongoId()
        .withMessage('is invalid')
        .custom((userId) =>
          User.findById(userId).then((data) => {
            if (!data) {
              throw new Error("doesn't exist");
            }

            return userId;
          })
        );
    case 'image':
      return basic
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('is invalid');
    case 'interests':
      return escaped
        .optional({ checkFalsy: true })
        .isMongoId()
        .withMessage('is invalid')
        .custom((interest) =>
          Interest.findById(interest).then((data) => {
            if (!data) {
              throw new Error("doesn't exist");
            }

            return interest;
          })
        );
    case 'text':
      return required;
    case 'eventId':
      return escaped
        .isMongoId()
        .withMessage('is invalid')
        .custom((eventId) =>
          Event.findById(eventId).then((data) => {
            if (!data) {
              throw new Error("doesn't exist");
            }

            return eventId;
          })
        );
    default:
      return escaped;
  }
};

const createValidation = (route) => {
  switch (route) {
    case 'usersPost':
      return [
        buildValidator('name', 'user.name'),
        buildValidator('email', 'user.email'),
        buildValidator('password', 'user.password'),
        buildValidator('confirmPassword', 'user.confirmPassword'),
        buildValidator('date', 'user.dateOfBirth'),
      ];
    case 'usersGetId':
    case 'usersDeleteId':
    case 'usersGetEvents':
      return [buildValidator('userId', 'userId')];
    case 'usersPutId':
      return [
        buildValidator('userId', 'userId'),
        buildValidator('name', 'user.name'),
        buildValidator('email', 'user.email'),
        buildValidator('date', 'user.dateOfBirth'),
        buildValidator('image', 'user.avatar'),
        buildValidator('interests', 'user.interests.*._id'),
      ];
    case 'usersLogIn':
      return [
        buildValidator('email', 'user.email', true),
        buildValidator('password', 'user.password', true),
      ];
    case 'eventsPost':
      return [
        buildValidator('text', 'event.name'),
        buildValidator('text', 'event.description'),
        buildValidator('date', 'event.startDate'),
        buildValidator('date', 'event.endDate'),
        buildValidator('userId', 'event.createdBy'),
        buildValidator('interests', 'event.relatedInterests.*._id'),
        buildValidator('image', 'event.coverPhoto'),
      ];
    case 'eventsGetId':
    case 'eventsDeleteId':
      return [buildValidator('eventId', 'eventId')];
    case 'eventsPutId':
      return [
        buildValidator('eventId', 'eventId'),
        buildValidator('text', 'event.name'),
        buildValidator('text', 'event.description'),
        buildValidator('date', 'event.startDate'),
        buildValidator('date', 'event.endDate'),
        buildValidator('userId', 'event.createdBy'),
        buildValidator('interests', 'event.relatedInterests.*._id'),
        buildValidator('image', 'event.coverPhoto'),
      ];
    default:
      return [];
  }
};

const runValidation = (req, res, next) => {
  const errors = validator.validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  res.status(422).json({ errors: errors.array() });
};

const validations = {
  create: createValidation,
  run: runValidation,
};

module.exports = validations;
