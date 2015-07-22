var calcElems = require('../../data/static/calcElems.json');
var debt = require('../modules/debt');


/** calculator-debt-annuity */
exports.annuity = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.annuity});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = debt.annuity(obj);
    res.json(results);
  }
};


/** calculator-debt-dispo */
exports.dispo = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.dispo});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = debt.dispo(obj);
    res.json(results);
  }
};


/** calculator-debt-repaysurrogat */
exports.repaysurrogat = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.repaysurrogat});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = debt.repaysurrogat(obj);
    res.json(results);
  }
};