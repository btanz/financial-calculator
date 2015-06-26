var express = require('express');
var router = express.Router();
var boerse = require('../modules/boerse');
var planning = require('../modules/planning');
var property = require('../modules/property');
var deposits = require('../modules/deposits');
var debt = require('../modules/debt');
var misc = require('../modules/misc');
var calcElems = require('../data/static/calcElems.json');


/* **********************************
** landing page route route
*********************************** */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express', appTitle: 'SimplyFi'});
});


/* **********************************
** boerse-options routes
*********************************** */
router.get('/optionspreisrechner', function(req, res, next) {
  res.render('calculator', {obj: calcElems.options });
});

router.get('/optionspreisrechner/inputs',function(req,res,next){
  var obj = req.query;
  var results = boerse.blackScholes(obj);
  res.json(results);
});


/* **********************************
 ** boerse-fx routes
 *********************************** */
router.get('/waehrungsrechner',function(req, res, next){
  res.render('calculator', {obj: calcElems.fx});
});

router.get('/waehrungsrechner/inputs',function(req,res,next){
  var obj = req.query;
  boerse.fxConvert(obj,function(err, results){
    if(results) {res.json(results);}
    if(err) {res.json(err)}
  });
});


/* **********************************
 ** boerse-equityreturn routes
 *********************************** */
router.get('/aktienrenditerechner',function(req,res,next){
  res.render('calculator', {obj: calcElems.equityreturn});
});

router.get('/aktienrenditerechner/inputs',function(req,res,next){
  var obj = req.query;
  var results = boerse.equityReturn(obj);
  res.json(results);
});

/* **********************************
 ** planning-retire routes
 *********************************** */
router.get('/altersvorsorgerechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.retire});
});

router.get('/altersvorsorgerechner/inputs',function(req,res,next){
  var obj = req.query;
  var results = planning.retire(obj);
  res.json(results);
});


/* **********************************
 ** property-propertyreturn routes
 *********************************** */
router.get('/immobilienrenditerechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.propertyreturn});
});

router.get('/immobilienrenditerechner/inputs',function(req,res,next){
  var obj = req.query;
  var results = property.propertyreturn(obj);
  res.json(results);
});


/* **********************************
 ** property-buyorrent routes
 *********************************** */
router.get('/kaufen-oder-mieten', function(req,res,next){
  res.render('calculator', {obj: calcElems.propertybuyrent});
});

router.get('/kaufen-oder-mieten/inputs',function(req,res,next){
 /* todo: complete
  var obj = req.query;
  var results = property.propertyreturn(obj);
  res.json(results);*/
});


/* **********************************
 ** property-rent routes
 *********************************** */
router.get('/mietrechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.rent});
});


router.get('/mietrechner/inputs', function(req,res,next){
  var obj = req.query;
  var results = property.rent(obj);
  res.json(results);
});

/* **********************************
 ** property-transfertax routes
 *********************************** */
router.get('/grunderwerbssteuerrechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.transfertax});
});


router.get('/grunderwerbssteuerrechner/inputs', function(req,res,next){
  var obj = req.query;
  console.log(obj);
  var results = property.transfertax(obj);
  res.json(results);
});


/* **********************************
 ** deposit-depinterest routes
 *********************************** */
router.get('/zinsrechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.depinterest});
});

router.get('/zinsrechner/inputs', function(req,res,next){
  var obj = req.query;
  var results = deposits.interest(obj);
  res.json(results);
});


/* **********************************
 ** deposit-depsaving routes
 *********************************** */
router.get('/sparrechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.depsaving});
});

router.get('/sparrechner/inputs', function(req,res,next){
  var obj = req.query;
  var results = deposits.savings(obj);
  res.json(results);
});


/* **********************************
 ** debt-annuity routes
 *********************************** */
router.get('/annuitaetenrechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.annuity});
});


router.get('/annuitaetenrechner/inputs', function(req,res,next){
  var obj = req.query;
  var results = debt.annuity(obj);
  res.json(results);
});


/* **********************************
 ** debt-dispo routes
 *********************************** */
router.get('/dispozinsrechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.dispo});
});


router.get('/dispozinsrechner/inputs', function(req,res,next){
  var obj = req.query;
  var results = debt.dispo(obj);
  res.json(results);
});


/* **********************************
 ** misc-daycount routes
 *********************************** */
router.get('/zinstagerechner', function(req,res,next){
  res.render('calculator', {obj: calcElems.daycount});
});


router.get('/zinstagerechner/inputs', function(req,res,next){
  var obj = req.query;
  var results = misc.daycount(obj);
  res.json(results);
});


/* **********************************
 ** expose routes
 *********************************** */
module.exports = router;
