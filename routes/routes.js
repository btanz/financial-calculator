var express = require('express');
var router = express.Router();
var boerse = require('../modules/boerse');
var calcElems = require('../data/static/calcElems.json');

/* ******* landing-route ****** */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express', appTitle: 'SimplyFi'});
});

/* ******* boerse-options routes ****** */
router.get('/optionspreisrechner', function(req, res, next) {
  res.render('calculator', {obj: calcElems.options });
});

router.get('/optionspreisrechner/inputs',function(req,res,next){
  var obj = req.query;
  var results = boerse.blackScholes(obj);
  res.json(results);
});

/* ******* boerse-fx routes ****** */
router.get('/waehrungsrechner',function(req, res, next){
  res.render('calculator', {obj: calcElems.fx});
});

router.get('/waehrungsrechner/inputs',function(req,res,next){
  var obj = req.query;
  boerse.fxConvert(obj,function(results){ res.json(results); });
});





module.exports = router;
