var express = require('express');
var router = express.Router();

const auth = require('./auth');

const categoriesController = require('../controllers/categoriesController');

router.get('/', auth.required, categoriesController.get);
router.post('/', auth.required, categoriesController.post);

router.get('/:id', auth.required, categoriesController.getId);

module.exports = router;
