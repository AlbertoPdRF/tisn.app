const express = require('express');
const router = express.Router();

const auth = require('./auth');
const validations = require('./validations');

const interestsController = require('../controllers/interestsController');

router.get('/', auth.required, interestsController.get);

router.post(
  '/',
  [auth.required, validations.create('interestsPost'), validations.run],
  interestsController.post
);

module.exports = router;
