var express = require('express');
var router = express.Router();

const usersRouter = require('./users');
const eventsRouter = require('./events');
const interestsRouter = require('./interests');
const categoriesRouter = require('./categories');

const uploadsRouter = require('./uploads');

router.get('/', function (req, res, next) {
  res.json({ message: 'Tisn API' });
});

router.use('/users', usersRouter);
router.use('/events', eventsRouter);
router.use('/interests', interestsRouter);
router.use('/categories', categoriesRouter);

router.use('/uploads', uploadsRouter);

module.exports = router;
