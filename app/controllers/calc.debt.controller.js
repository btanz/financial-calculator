var calcElems = require('../../data/static/calcElems.json');
var debt = require('../modules/debt');


/** calculator-debt-annuity */
exports.annuity = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('annuity')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-options calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    debt.annuity(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
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