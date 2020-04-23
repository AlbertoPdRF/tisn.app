const express = require('express');
const router = express.Router({ mergeParams: true });

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const attendantsController = require('../controllers/attendantsController');

router.get(
  '/',
  [auth.required, validations.create('attendantsGet'), validations.run],
  attendantsController.get
);

router.post(
  '/',
  [
    auth.required,
    permissions,
    validations.create('attendantsPost'),
    validations.run,
  ],
  attendantsController.post
);

router.delete(
  '/:attendantId',
  [
    auth.required,
    permissions,
    validations.create('attendantsDeleteId'),
    validations.run,
  ],
  attendantsController.deleteId
);

module.exports = router;
