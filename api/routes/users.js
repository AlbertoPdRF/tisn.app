var express = require('express');
var router = express.Router();

const auth = require('./auth');

const usersController = require('../controllers/usersController');

router.get('/', auth.required, usersController.get);
router.post('/', usersController.post);

router.post('/log-in', usersController.log_in);

module.exports = router;
