const validator = require('express-validator');

const User = require('../models/User');
const Interest = require('../models/Interest');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const Friendship = require('../models/Friendship');
const Notification = require('../models/Notification');

const buildValidator = (type, param, optional = false) => {
  const check = validator.check(param);
  const basicOptional = validator
    .check(param)
    .trim()
    .optional({ checkFalsy: true });
  const basicRequired = validator
    .check(param)
    .trim()
    .notEmpty()
    .withMessage('is required');
  const escapedOptional = validator
    .check(param)
    .trim()
    .escape()
    .optional({ checkFalsy: true });
  const escapedRequired = validator
    .check(param)
    .trim()
    .escape()
    .notEmpty()
    .withMessage('is required');

  switch (type) {
    case 'name':
      return escapedRequired
        .isLength({ max: 20 })
        .withMessage('too long')
        .matches(/^[a-z ]+$/i)
        .withMessage('must have letters (and spaces) only');
    case 'email':
      return escapedRequired
        .isEmail()
        .withMessage('is invalid')
        .isLength({ max: 50 })
        .withMessage('too long')
        .normalizeEmail()
        .custom((email, { req }) =>
          User.findOne({ email }).then((data) => {
            if (!optional && data && data._id != req.params.userId) {
              throw new Error('a user with this email already exists');
            }

            return email;
          })
        );
    case 'password':
      return escapedRequired
        .isLength({ min: optional ? 0 : 8 })
        .withMessage('must be at least 8 characters long');
    case 'confirmPassword':
      return escapedRequired.custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.user.password) {
          throw new Error("doesn't match");
        }

        return confirmPassword;
      });
    case 'date':
      return escapedRequired
        .isISO8601()
        .withMessage('is invalid')
        .toDate()
        .custom((date, { req }) => {
          const minimumDate = new Date();
          minimumDate.setFullYear(minimumDate.getFullYear() - 100);
          const maximumDate = new Date();
          maximumDate.setFullYear(maximumDate.getFullYear() + 100);
          if (date < minimumDate || date > maximumDate) {
            throw new Error('seems wrong');
          }

          if (param.includes('dateOfBirth')) {
            const dateForMinimumAge = new Date();
            dateForMinimumAge.setFullYear(dateForMinimumAge.getFullYear() - 14);
            if (date > dateForMinimumAge) {
              throw new Error('you must be at least 14 years old');
            }
          } else if (param.includes('startDate') || param.includes('endDate')) {
            const now = new Date();
            if (date < now) {
              throw new Error('must be in the future');
            }

            if (param.includes('endDate') && date <= req.body.event.startDate) {
              throw new Error('must be after start date');
            }
          }

          return date;
        });
    case 'id':
      return (optional ? escapedOptional : escapedRequired)
        .isMongoId()
        .withMessage('is invalid')
        .custom((id) => {
          let model;
          switch (param) {
            case 'userId':
            case 'attendant.user._id':
            case 'comment.user._id':
            case 'friendship.requestant._id':
            case 'friendship.receivant._id':
            case 'message.user._id':
            case 'notification.user':
              model = User;
              break;
            case 'user.interests.*._id':
            case 'event.relatedInterests.*._id':
              model = Interest;
              break;
            case 'eventId':
            case 'attendant.event._id':
            case 'comment.event._id':
              model = Event;
              break;
            case 'attendantId':
              model = Attendant;
              break;
            case 'comment.parentComment':
              model = Comment;
              break;
            case 'interest.category':
              model = Category;
              break;
            case 'friendshipId':
            case 'message.friendship._id':
              model = Friendship;
              break;
            case 'notificationId':
              model = Notification;
              break;
            default:
              throw new Error('is invalid');
          }

          return model.findById(id).then((data) => {
            if (!data) {
              throw new Error("doesn't exist");
            }

            return id;
          });
        });
    case 'imageUrl':
      return (optional ? basicOptional : basicRequired)
        .optional({ checkFalsy: true })
        .isURL()
        .withMessage('is invalid');
    case 'text':
      return escapedRequired;
    case 'int':
      return escapedRequired
        .isInt({ min: 2 })
        .withMessage('must be at least 2')
        .toInt();
    case 'boolean':
      return escapedRequired.isBoolean().withMessage('is invalid').toBoolean();
    case 'path':
      return basicRequired
        .matches(/^\/([A-z0-9]+\/)*([A-z0-9]+)$/)
        .withMessage('is invalid');
    case 'notificationType':
      return escapedRequired
        .isIn(['General', 'Attendant', 'Comment', 'Friendship', 'Message'])
        .withMessage('is unknown');
    case 'nonEmptyArray':
      return check.isLength({ min: 1 }).withMessage('must have at least 1');
    default:
      return escapedRequired;
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
    case 'friendshipsGet':
    case 'notificationsGet':
      return [buildValidator('id', 'userId')];
    case 'usersPutId':
      return [
        buildValidator('id', 'userId'),
        buildValidator('name', 'user.name'),
        buildValidator('email', 'user.email'),
        buildValidator('date', 'user.dateOfBirth'),
        buildValidator('imageUrl', 'user.avatar', true),
        buildValidator('id', 'user.interests.*._id', true),
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
        buildValidator('nonEmptyArray', 'event.relatedInterests'),
        buildValidator('id', 'event.relatedInterests.*._id'),
        buildValidator('imageUrl', 'event.coverPhoto', true),
        buildValidator('int', 'event.attendantsLimit'),
      ];
    case 'eventsGetId':
    case 'eventsDeleteId':
    case 'attendantsGet':
    case 'commentsGet':
      return [buildValidator('id', 'eventId')];
    case 'eventsPutId':
      return [
        buildValidator('id', 'eventId'),
        buildValidator('text', 'event.name'),
        buildValidator('text', 'event.description'),
        buildValidator('date', 'event.startDate'),
        buildValidator('date', 'event.endDate'),
        buildValidator('userId', 'event.createdBy'),
        buildValidator('nonEmptyArray', 'event.relatedInterests'),
        buildValidator('id', 'event.relatedInterests.*._id'),
        buildValidator('imageUrl', 'event.coverPhoto', true),
        buildValidator('int', 'event.attendantsLimit'),
      ];
    case 'attendantsPost':
      return [
        buildValidator('id', 'eventId'),
        buildValidator('id', 'attendant.event._id'),
        buildValidator('id', 'attendant.user._id'),
      ];
    case 'attendantsDeleteId':
      return [
        buildValidator('id', 'eventId'),
        buildValidator('id', 'attendantId'),
      ];
    case 'commentsPost':
      return [
        buildValidator('id', 'eventId'),
        buildValidator('id', 'comment.event._id'),
        buildValidator('id', 'comment.user._id'),
        buildValidator('text', 'comment.content'),
        buildValidator('id', 'comment.parentComment', true),
      ];
    case 'interestsPost':
      return [
        buildValidator('name', 'interest.name'),
        buildValidator('imageUrl', 'interest.avatar'),
        buildValidator('id', 'interest.category'),
      ];
    case 'friendshipsPost':
      return [
        buildValidator('id', 'userId'),
        buildValidator('id', 'friendship.requestant._id'),
        buildValidator('id', 'friendship.receivant._id'),
      ];
    case 'friendshipsGetId':
    case 'friendshipsDeleteId':
      return [
        buildValidator('id', 'userId'),
        buildValidator('id', 'friendshipId'),
      ];
    case 'friendshipsPutId':
      return [
        buildValidator('id', 'userId'),
        buildValidator('id', 'friendshipId'),
        buildValidator('id', 'friendship.requestant._id'),
        buildValidator('id', 'friendship.receivant._id'),
        buildValidator('boolean', 'friendship.accepted'),
        buildValidator('date', 'friendship.acceptedAt'),
      ];
    case 'messagesGet':
      return [
        buildValidator('id', 'userId'),
        buildValidator('id', 'friendshipId'),
      ];
    case 'messagesPost':
      return [
        buildValidator('id', 'userId'),
        buildValidator('id', 'friendshipId'),
        buildValidator('id', 'message.friendship._id'),
        buildValidator('id', 'message.user._id'),
        buildValidator('text', 'message.content'),
      ];
    case 'notificationsPutId':
      return [
        buildValidator('id', 'userId'),
        buildValidator('id', 'notificationId'),
        buildValidator('id', 'notification.user'),
        buildValidator('notificationType', 'notification.type'),
        buildValidator('text', 'notification.title'),
        buildValidator('text', 'notification.content'),
        buildValidator('path', 'notification.path'),
        buildValidator('boolean', 'notification.read'),
        buildValidator('date', 'notification.readAt'),
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
