const express = require('express');
const router = express.Router({ mergeParams: true });

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const attendeesController = require('../controllers/attendeesController');

router.get(
  '/',
  [auth.required, validations.create('attendeesGet'), validations.run],
  attendeesController.get
);

router.post(
  '/',
  [
    auth.required,
    permissions,
    validations.create('attendeesPost'),
    validations.run,
  ],
  attendeesController.post
);

router.delete(
  '/:attendeeId',
  [
    auth.required,
    permissions,
    validations.create('attendeesDeleteId'),
    validations.run,
  ],
  attendeesController.deleteId
);

module.exports = router;
