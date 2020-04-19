const express = require('express');
const router = express.Router();

const auth = require('./auth');
const permissions = require('./permissions');

const eventsController = require('../controllers/eventsController');

router.get('/', auth.required, eventsController.get);
router.post('/', auth.required, eventsController.post);

router.get('/:id', auth.required, eventsController.getId);
router.put('/:id', [auth.required, permissions], eventsController.putId);
router.delete('/:id', [auth.required, permissions], eventsController.deleteId);

const attendantsRouter = require('./attendants');

router.use('/:eventId/attendants', attendantsRouter);

const commentsRouter = require('./comments');

router.use('/:eventId/comments', commentsRouter);

module.exports = router;
