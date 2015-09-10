var express = require('express');
var router = express.Router();

/** privacy statement route */
var privacy = require('../controllers/legal/privacy.controller');
router.get('/datenschutzerklaerung', privacy.render);

/** impressum routes */
var impressum = require('../controllers/legal/impressum.controller');
router.get('/impressum', impressum.render);

/** expose routes */
module.exports = router;