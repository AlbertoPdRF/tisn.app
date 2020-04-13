var express = require('express');
var router = express.Router( {mergeParams: true} );

const auth = require('./auth');
const permissions = require('./permissions');

const attendantsController = require('../controllers/attendantsController');

router.get('/', auth.required, attendantsController.get);
router.post('/', [auth.required, permissions], attendantsController.post);

router.delete('/:id', [auth.required, permissions], attendantsController.deleteId);

module.exports = router;
