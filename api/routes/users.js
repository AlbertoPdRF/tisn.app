const express = require('express');
const router = express.Router();

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const usersController = require('../controllers/usersController');

router.get(
  '/',
  [auth.required, validations.create('usersGet'), validations.run],
  usersController.get
);

router.post(
  '/',
  [validations.create('usersPost'), validations.run],
  usersController.post
);

router.get(
  '/:userId',
  [auth.required, validations.create('usersGetId'), validations.run],
  usersController.getId
);

router.put(
  '/:userId',
  [
    auth.required,
    permissions,
    validations.create('usersPutId'),
    validations.run,
  ],
  usersController.putId
);

router.delete(
  '/:userId',
  [
    auth.required,
    permissions,
    validations.create('usersDeleteId'),
    validations.run,
  ],
  usersController.deleteId
);

router.get(
  '/:userId/events',
  [auth.required, validations.create('usersGetEvents'), validations.run],
  usersController.getEvents
);

router.get(
  '/:userId/send-email-confirmation-email',
  [
    auth.required,
    permissions,
    validations.create('usersSendEmailConfirmationEmail'),
    validations.run,
  ],
  usersController.sendEmailConfirmationEmail
);

router.get(
  '/:userId/confirm-email',
  [
    auth.required,
    permissions,
    validations.create('usersConfirmEmail'),
    validations.run,
  ],
  usersController.confirmEmail
);

router.post(
  '/log-in',
  [validations.create('usersLogIn'), validations.run],
  usersController.logIn
);

router.post('/log-in/google', usersController.logInGoogle);

const notificationsRouter = require('./notifications');

router.use('/:userId/notifications', notificationsRouter);

const friendshipsRouter = require('./friendships');

router.use('/:userId/friendships', friendshipsRouter);

module.exports = router;
