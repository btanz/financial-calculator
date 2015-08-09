var calcElems = require('../../data/static/calcElems.json');
var deposits = require('../modules/deposits');

/** calculator-deposits-depinterest */
exports.depinterest = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('depinterest')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    deposits.interest(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
  }

};


/** calculator-deposits-depsaving */
exports.depsaving = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('depsaving')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    deposits.savings(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
  }
};


/** calculator-deposits-timedeposit */
exports.timedeposit = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('timedeposit')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    deposits.timedeposit(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
  }

};


/** calculator-deposits-savingscheme */
exports.savingscheme = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('savingscheme')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    deposits.savingscheme(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
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


/** calculator-deposits-timedeposit */
exports.overnightdeposit = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.overnight});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = deposits.overnight(obj);
    res.json(results);
  }
};
