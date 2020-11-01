const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const eventsRouter = require('./events');
const interestsRouter = require('./interests');

const uploadsRouter = require('./uploads');

router.get('/', function (req, res, next) {
	res.json({ message: 'Tisn API' });
});

router.use('/users', usersRouter);
router.use('/events', eventsRouter);
router.use('/interests', interestsRouter);

router.use('/uploads', uploadsRouter);

module.exports = router;
