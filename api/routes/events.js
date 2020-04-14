const express = require('express');
const router = express.Router();

const auth = require('./auth');
const permissions = require('./permissions');

const eventsController = require('../controllers/eventsController');

router.get('/', auth.required, eventsController.get);
router.post('/', auth.required, eventsController.post);

router.get('/:id', auth.required, eventsController.getId);
router.put('/:id', [auth.required, permissions], eventsController.putId);

const attendantsRouter = require('./attendants');

router.use('/:eventId/attendants', attendantsRouter);

module.exports = router;
