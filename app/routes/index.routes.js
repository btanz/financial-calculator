var express = require('express');
var router = express.Router();

/** index page route */
var index = require('../controllers/index.controller');
router.get('/', index.render);

/** expose routes */
module.exports = router;