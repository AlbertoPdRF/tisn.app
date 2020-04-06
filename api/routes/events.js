var express = require('express');
var router = express.Router();

const auth = require('./auth');

const eventsController = require('../controllers/eventsController');

router.get('/', auth.required, eventsController.get);
router.post('/', auth.required, eventsController.post);

router.get('/:id', auth.required, eventsController.getId);

module.exports = router;
