var fs        = require('fs');
var misc      = require('../modules/misc');
var jade      = require('jade');
var path      = require('path');
var _         = require('underscore');
var pdf       = require('simply-pdf');
var pdfFormat = require('../modules/helper/pdfviewformat.helper.module');


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
    var app = require('../../config/app');
    var inputObj = req.query;
    var inputPrintObj = {};

    Calc.findByCalcname('daycount')
        .then(function(data){

          /** map label to input element */
          var test = data[0].inputs;

          _.each(inputObj, function(value, key){
            inputPrintObj[_.find(test, function(item){return (item.name === key);}).label] = inputObj[key];
          });


          misc.daycount(inputObj)
              .then(function(results){
                pdf.fullgenerate(res, app, data[0], inputPrintObj, results._1, pdfFormat.format);

              })
              .onReject(function(){
                console.log('Error occurred');
              });


        })
        .onReject(function(){
          console.log("An error occurred while generating the misc-daycount pdf.");
        });

  }

};