const express = require('express');
const router = express.Router();

const auth = require('./auth');

const interestsController = require('../controllers/interestsController');

router.get('/', auth.required, interestsController.get);

module.exports = router;
