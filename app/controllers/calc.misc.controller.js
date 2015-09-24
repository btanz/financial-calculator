var fs        = require('fs');
var misc      = require('../modules/misc');
var jade      = require('jade');
var path      = require('path');
var _         = require('underscore');
var pdf       = require('../../config/pdf');
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
    var fileName = './' + new Date().getTime() + '.pdf';
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

                app.render('calc/pdf/layout', {obj: data[0], inputObj: inputPrintObj, outputObj: results._1, format: pdfFormat.format}, function(err,html){
                  // todo: error handling
                  if(err){
                    console.log(err);
                  } else {
                    pdf(html, fileName, function(err, response) {
                      if (err) return console.log(err);
                      res.sendFile(response.filename);
                    });
                  }
                });


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