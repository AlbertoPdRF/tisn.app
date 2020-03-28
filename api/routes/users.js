var express = require('express');
var router = express.Router();

const auth = require('./auth');

const usersController = require('../controllers/usersController');

router.get('/', auth.required, usersController.get);
router.post('/', auth.optional, usersController.post);

router.post('/log-in', auth.optional, usersController.log_in);

module.exports = router;
