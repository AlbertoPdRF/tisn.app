const express = require('express');
const router = express.Router({ mergeParams: true });

const auth = require('./auth');
const validations = require('./validations');
const permissions = require('./permissions');

const friendshipsController = require('../controllers/friendshipsController');

router.get(
	'/',
	[auth.required, validations.create('friendshipsGet'), validations.run],
	friendshipsController.get
);

router.post(
	'/',
	[
		auth.required,
		permissions,
		validations.create('friendshipsPost'),
		validations.run,
	],
	friendshipsController.post
);

router.get(
	'/:friendshipId',
	[
		auth.required,
		permissions,
		validations.create('friendshipsGetId'),
		validations.run,
	],
	friendshipsController.getId
);

router.put(
	'/:friendshipId',
	[
		auth.required,
		permissions,
		validations.create('friendshipsPutId'),
		validations.run,
	],
	friendshipsController.putId
);

router.delete(
	'/:friendshipId',
	[
		auth.required,
		permissions,
		validations.create('friendshipsDeleteId'),
		validations.run,
	],
	friendshipsController.deleteId
);

const messagesRouter = require('./messages');

router.use('/:friendshipId/messages', messagesRouter);

module.exports = router;
