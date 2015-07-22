var calcElems = require('../../data/static/calcElems.json');
var deposits = require('../modules/deposits');

/** calculator-deposits-depinterest */
exports.depinterest = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.depinterest});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = deposits.interest(obj);
    res.json(results);
  }
};


/** calculator-deposits-depsaving */
exports.depsaving = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.depsaving});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = deposits.savings(obj);
    res.json(results);
  }
};


/** calculator-deposits-timedeposit */
exports.timedeposit = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.timedeposit});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = deposits.timedeposit(obj);
    res.json(results);
  }
};


/** calculator-deposits-savingscheme */
exports.savingscheme = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.savingscheme});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = deposits.savingscheme(obj);
    res.json(results);
  }
};


/** calculator-deposits-interestpenalty */
exports.interestpenalty = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.interestpenalty});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = deposits.interestpenalty(obj);
    res.json(results);
  }
};