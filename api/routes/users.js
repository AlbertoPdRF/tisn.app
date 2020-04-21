const express = require('express');
const router = express.Router();

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const usersController = require('../controllers/usersController');

router.get('/', auth.required, usersController.get);
router.post(
  '/',
  [validations.create('usersPost'), validations.run],
  usersController.post
);

router.get('/:id', auth.required, usersController.getId);
router.put('/:id', [auth.required, permissions], usersController.putId);
router.delete('/:id', [auth.required, permissions], usersController.deleteId);

router.get('/:id/events', auth.required, usersController.getEvents);

router.post('/log-in', usersController.logIn);

module.exports = router;
