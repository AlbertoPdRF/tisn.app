const express = require('express');
const router = express.Router({ mergeParams: true });

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const commentsController = require('../controllers/commentsController');

router.get(
	'/',
	[auth.required, validations.create('commentsGet'), validations.run],
	commentsController.get
);

router.post(
	'/',
	[
		auth.required,
		permissions,
		validations.create('commentsPost'),
		validations.run,
	],
	commentsController.post
);

module.exports = router;
