var boerse = require('../modules/boerse');
var pdf  = require('simply-pdf');

/** calculator-boerse-options */
exports.options = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('options')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-options calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    boerse.blackScholes(obj)
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

    Calc.findByCalcname('options')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-options guide.");
        });
  },


  /** generate pdf for options */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('options')
        .then(function(data){
          pdf.generate(res, boerse.blackScholes, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the boerse.blackScholes pdf.");
        });
  }

};


/** calculator-boerse-fx */
exports.fx = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('fx')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-fx calculator.");
        });
  },

  calculate: function(req,res) {
    var obj = req.query;
    boerse.fxConvert(obj, function (err, results) {
      if (results) {
        res.json(results);
      }
      if (err) {
        res.json(err)
      }
    });
  },

  guide: function(req,res){
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('fx')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-fx guide.");
        });
  },


  /** generate pdf for fx */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('fx')
        .then(function(data){
          pdf.generate(res, boerse.fxConvert, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the boerse.fxConvert pdf.");
        });
  }
};


/** calculator-boerse-equityreturn */
exports.equityreturn = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('equityreturn')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-equityreturn calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    boerse.equityReturn(obj)
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

    Calc.findByCalcname('equityreturn')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-equityreturn guide.");
        });
  },


  /** generate pdf for equityreturn */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('equityreturn')
        .then(function(data){
          pdf.generate(res, boerse.equityReturn, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the boerse.equityReturn pdf.");
        });
  }

};


/** calculator-boerse-portfolio */
exports.portfolio = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('portfolio')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-portfolio calculator.");
        });
  },


  calculate: function(req,res){
    var obj = req.query;
    boerse.portfolio(obj)
      .then(function(results){
        res.json(results);
      })
      .catch(function(){
        console.log('An error occured');
        res.json([]);
      });
  },

  guide: function(req,res){
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('portfolio')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-portfolio calculator.");
        });
  },


  /** generate pdf for dispo */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('portfolio')
        .then(function(data){
          pdf.generate(res, boerse.portfolio, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the boerse.portfolio pdf.");
        });
  }


};


