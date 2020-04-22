const validator = require('express-validator');

const User = require('../models/User');
const Interest = require('../models/Interest');

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
    case 'dateOfBirth':
      return required
        .isISO8601()
        .withMessage('is invalid')
        .toDate()
        .custom((dateOfBirth) => {
          const dateForMinimumAge = new Date();
          dateForMinimumAge.setFullYear(dateForMinimumAge.getFullYear() - 14);
          const maximumDate = new Date();
          maximumDate.setFullYear(maximumDate.getFullYear() - 100);
          if (dateOfBirth > dateForMinimumAge) {
            throw new Error('you must be at least 14 years old');
          } else if (dateOfBirth < maximumDate) {
            throw new Error('seems wrong');
          }

          return dateOfBirth;
        });
    case 'id':
      return escaped.isMongoId().withMessage('is invalid');
    case 'avatar':
      return basic.isURL().withMessage('is invalid').optional();
    case 'interests':
      return escaped
        .isMongoId()
        .withMessage('is invalid')
        .custom((interest) =>
          Interest.findById(interest).then((data) => {
            if (!data) {
              throw new Error("doesn't exist");
            }

            return interest;
          })
        )
        .optional();
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
        buildValidator('dateOfBirth', 'user.dateOfBirth'),
      ];
    case 'usersGetId':
      return [buildValidator('id', 'userId')];
    case 'usersPutId':
      return [
        buildValidator('id', 'userId'),
        buildValidator('name', 'user.name'),
        buildValidator('email', 'user.email'),
        buildValidator('dateOfBirth', 'user.dateOfBirth'),
        buildValidator('avatar', 'user.avatar'),
        buildValidator('interests', 'user.interests.*._id'),
      ];
    case 'usersDeleteId':
      return [buildValidator('id', 'userId')];
    case 'usersGetEvents':
      return [buildValidator('id', 'userId')];
    case 'usersLogIn':
      return [
        buildValidator('email', 'user.email', true),
        buildValidator('password', 'user.password', true),
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
