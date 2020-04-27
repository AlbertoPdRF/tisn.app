const express = require('express');
const router = express.Router({ mergeParams: true });

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const messagesController = require('../controllers/messagesController');

router.get(
  '/',
  [auth.required, validations.create('messagesGet'), validations.run],
  messagesController.get
);

router.post(
  '/',
  [
    auth.required,
    permissions,
    validations.create('messagesPost'),
    validations.run,
  ],
  messagesController.post
);

module.exports = router;
