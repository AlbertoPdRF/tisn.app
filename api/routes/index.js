var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    message: "API is working properly"
  });
});

module.exports = router;
