const express = require('express');
const router = express.Router();

const auth = require('./auth');

const categoriesController = require('../controllers/categoriesController');

router.post('/', auth.required, categoriesController.post);

module.exports = router;
