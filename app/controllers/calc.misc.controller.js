var fs        = require('fs');
var misc      = require('../modules/misc');
var jade      = require('jade');
var path      = require('path');
var _         = require('underscore');
var pdf       = require('simply-pdf');


/** calculator-misc-daycount */
exports.daycount = {

  /** render daycount on first load */
  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('daycount')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the boerse-options calculator.");
        });
  },

  /** calculate daycount */
  calculate: function(req, res){
    var obj = req.query;
    misc.daycount(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
  },

  /** render daycount guide */
  guide: function(req,res){

    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('daycount')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the misc-daycount guide.");
        });
  },


  /** generate pdf for daycount */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('daycount')
        .then(function(data){
          pdf.generate(res, misc.daycount, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the misc-daycount pdf.");
        });
  }

};