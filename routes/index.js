var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express', appTitle: 'SimplyFi'});
});


router.get('/ben', function(req, res, next) {
  res.render('index', { title: 'Ben' });
});

module.exports = router;
