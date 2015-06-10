var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express', appTitle: 'SimplyFi'});
});


router.get('/optionspreisrechner', function(req, res, next) {
  res.render('calculator', { title: 'Sparrechner' });
});


module.exports = router;
