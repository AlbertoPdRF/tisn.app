const express = require('express');
const router = express.Router();

const auth = require('./auth');

const interestsController = require('../controllers/interestsController');

router.get('/', auth.required, interestsController.get);
router.post('/', auth.required, interestsController.post);

router.get('/:id', auth.required, interestsController.getId);

module.exports = router;
