var deposits = require('../modules/deposits');
var pdf       = require('simply-pdf');

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
  },

  guide: function(req,res){
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('depinterest')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depinterest guide.");
        });
  },


  /** generate pdf for propertyreturn */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('depinterest')
        .then(function(data){
          pdf.generate(res, deposits.interest, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the deposits.interest pdf.");
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
  },

  guide: function(req,res){
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('depsaving')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving guide.");
        });
  },


  /** generate pdf for propertyreturn */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('depsaving')
        .then(function(data){
          pdf.generate(res, deposits.savings, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the deposits.savings pdf.");
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
  },

  guide: function(req,res){
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('timedeposit')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-timedeposit guide.");
        });
  },


  /** generate pdf for timedeposit */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('timedeposit')
        .then(function(data){
          pdf.generate(res, deposits.timedeposit, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the deposits.timedeposit pdf.");
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
  },

  guide: function(req,res){
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('savingscheme')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-savingscheme guide.");
        });
  },


  /** generate pdf for propertyreturn */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('savingscheme')
        .then(function(data){
          pdf.generate(res, deposits.savingscheme, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the deposits.savingscheme pdf.");
        });
  }


};


/** calculator-deposits-interestpenalty */
exports.interestpenalty = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('interestpenalty')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    deposits.interestpenalty(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
  },

  guide: function(req,res){
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('interestpenalty')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-interestpenalty guide.");
        });
  },


  /** generate pdf for interestpenalty */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('interestpenalty')
        .then(function(data){
          pdf.generate(res, deposits.interestpenalty, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the deposits.interestpenalty pdf.");
        });
  }

};


/** calculator-deposits-timedeposit */
exports.overnightdeposit = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('overnight')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    deposits.overnight(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
  },

  guide: function(req,res){
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('overnight')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-overnight guide.");
        });
  },


  /** generate pdf for timedeposit */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('overnight')
        .then(function(data){
          pdf.generate(res, deposits.overnight, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the deposits.overnight pdf.");
        });
  }


};
