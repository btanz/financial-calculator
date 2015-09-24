var fs = require('fs');
var misc = require('../modules/misc');
//var pdf = require('../../lib/phantompdf');
var jade = require('jade');
var path = require('path');
var appDir = path.dirname(require.main.filename);

var pdf = require('../../config/pdf');

/** calculator-misc-daycount */
exports.daycount = {

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


  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var app = require('../../config/app');
    var fileName = './' + new Date().getTime() + '.pdf';
    var inputObj = req.query;



    Calc.findByCalcname('daycount')
        .then(function(data){

          misc.daycount(inputObj)
              .then(function(results){

                app.render('calc/pdf/inputs', {obj: data[0], inputObj: inputObj, outputObj: results._1}, function(err,html){
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


        /*
          app.render('calc/pdf/inputs', {obj: data[0], inputObj: inputObj}, function(err,html){
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
        */




        })
        .onReject(function(){
          console.log("An error occurred while rendering the misc-daycount guide.");
        });

  }

};