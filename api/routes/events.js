const express = require('express');
const router = express.Router();

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const eventsController = require('../controllers/eventsController');

router.get('/', auth.required, eventsController.get);

router.post(
  '/',
  [auth.required, validations.create('eventsPost'), validations.run],
  eventsController.post
);

router.get(
  '/:eventId',
  [auth.required, validations.create('eventsGetId'), validations.run],
  eventsController.getId
);

router.put(
  '/:eventId',
  [
    auth.required,
    permissions,
    validations.create('eventsPutId'),
    validations.run,
  ],
  eventsController.putId
);

router.delete(
  '/:eventId',
  [
    auth.required,
    permissions,
    validations.create('eventsDeleteId'),
    validations.run,
  ],
  eventsController.deleteId
);

const attendantsRouter = require('./attendants');

router.use('/:eventId/attendants', attendantsRouter);

const commentsRouter = require('./comments');

router.use('/:eventId/comments', commentsRouter);

module.exports = router;
