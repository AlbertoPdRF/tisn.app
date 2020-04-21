const validator = require('express-validator');

const User = require('../models/User');

const buildValidator = (type, param) => {
  const commonOptions = validator
    .check(param)
    .escape()
    .trim()
    .notEmpty()
    .withMessage('is required');

  switch (type) {
    case 'name':
      return commonOptions
        .isLength({ max: 20 })
        .withMessage('too long')
        .matches(/^[a-z ]+$/i)
        .withMessage('must have letters (and spaces) only');
    case 'email':
      return commonOptions
        .isEmail()
        .withMessage('is invalid')
        .normalizeEmail()
        .custom((email) =>
          User.find({ email }).then((data) => {
            if (data.length !== 0) {
              throw new Error('a user with this email already exists');
            } else {
              return email;
            }
          })
        );
    case 'password':
      return commonOptions
        .isLength({ min: 8 })
        .withMessage('must be at least 8 characters long');
    case 'confirmPassword':
      return commonOptions.custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.user.password) {
          throw new Error("doesn't match");
        } else {
          return confirmPassword;
        }
      });
    case 'dateOfBirth':
      return commonOptions
        .isISO8601()
        .withMessage('is invalid')
        .toDate()
        .custom((dateOfBirth) => {
          const dateForMinimumAge = new Date();
          dateForMinimumAge.setFullYear(dateForMinimumAge.getFullYear() - 14);
          const maximumDate = new Date();
          maximumDate.setFullYear(maximumDate.getFullYear() - 100);
          if (dateOfBirth > dateForMinimumAge) {
            throw new Error('you must be at least 14 years old to sign up');
          } else if (dateOfBirth < maximumDate) {
            throw new Error('seems wrong');
          } else {
            return dateOfBirth;
          }
        });
    default:
      return commonOptions;
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
