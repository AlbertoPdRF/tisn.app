const express = require('express');
const router = express.Router({ mergeParams: true });

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const notificationsController = require('../controllers/notificationsController');

router.get(
  '/',
  [auth.required, validations.create('notificationsGet'), validations.run],
  notificationsController.get
);

router.put(
  '/:notificationId',
  [auth.required, permissions],
  notificationsController.putId
);

module.exports = router;
