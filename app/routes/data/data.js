/**
 * Created by benjamintanz on 19.08.15.
 *
 * routes for /data/
 *
 */
var express = require('express');
var router = express.Router();
//var equity = require('./data.equity');


router.use('/equity', require('./data.equity'));



module.exports = router;