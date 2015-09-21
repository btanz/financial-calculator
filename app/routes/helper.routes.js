/**
 * Created by benjamintanz on 21.09.15.
 *
 * Helper routes for misc helpers tasks such as receiving feedback and handling user feedback
 */
var express = require('express');
var router = express.Router();

/** user feedback route */
var helper = require('../controllers/helper.controller');

router.get('/feedback',     helper.feedback.submit);


/** expose routes */
module.exports = router;