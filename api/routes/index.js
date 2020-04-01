var express = require('express');
var router = express.Router();

const usersRouter = require('./users');
const interestsRouter = require('./interests');
const categoriesRouter = require('./categories');

router.get('/', function(req, res, next) {
  res.json({ message: "Tisn API" });
});

router.use('/users', usersRouter);
router.use('/interests', interestsRouter);
router.use('/categories', categoriesRouter);

module.exports = router;
