const express = require('express');
const router = express.Router();

const auth = require('./auth');

const fileUpload = require('express-fileupload');

const uploadsMiddleware = fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }
});

const middleware = [auth.required, uploadsMiddleware];

const uploadsController = require('../controllers/uploadsController');

router.post('/', middleware, uploadsController.post);

module.exports = router;
