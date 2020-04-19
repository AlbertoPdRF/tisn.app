const express = require('express');
const router = express.Router({ mergeParams: true });

const auth = require('./auth');
const permissions = require('./permissions');

const commentsController = require('../controllers/commentsController');

router.get('/', auth.required, commentsController.get);
router.post('/', [auth.required, permissions], commentsController.post);

module.exports = router;
