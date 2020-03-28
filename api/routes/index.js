var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({
    message: "API is working properly"
  });
});

router.use('/users', require('./users'));

module.exports = router;
