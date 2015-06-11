var express = require('express');
var router = express.Router();
var boerse = require('../modules/boerse');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express', appTitle: 'SimplyFi'});
});


router.get('/optionspreisrechner', function(req, res, next) {
  res.render('calculator', { title: 'Sparrechner' });
});

router.get('/optionspreisrechner/inputs',function(req,res,next){
  var obj = req.query;
  // console.log(obj);
  //var arr = Object.keys(obj).map(function(k) { return Number(obj[k]) });
  var results = boerse.blackScholes(obj);
  res.json(results);
});



/*
app.get("/users/:format?", function(req, res, next){
  if (req.params.format) { res.json(...); }
  else {
    res.render(...); //jade template
  }
});*/


module.exports = router;
