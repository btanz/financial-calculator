var property  = require('../modules/property');
var pdf       = require('simply-pdf');


/** calculator-property-propertyreturn */
exports.propertyreturn = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('propertyreturn')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the property-propertyreturn calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    property.propertyreturn(obj)
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

    Calc.findByCalcname('propertyreturn')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the property-propertyreturn guide.");
        });
  },


  /** generate pdf for propertyreturn */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('propertyreturn')
        .then(function(data){
          pdf.generate(res, property.propertyreturn, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the property.propertyreturn pdf.");
        });
  }

};


/** calculator-property-buyrent */
exports.buyrent = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('propertybuyrent')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    property.buyrent(obj)
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

    Calc.findByCalcname('propertybuyrent')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the property-propertybuyrent guide.");
        });
  },


  /** generate pdf for propertybuyrent */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('propertybuyrent')
        .then(function(data){
          pdf.generate(res, property.buyrent, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the property.propertybuyrent pdf.");
        });
  }

};


/** calculator-property-rent */
exports.rent = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('rent')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    property.rent(obj)
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

    Calc.findByCalcname('rent')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the property-rent guide.");
        });
  },


  /** generate pdf for propertyrent */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('rent')
        .then(function(data){
          pdf.generate(res, property.rent, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the property.rent pdf.");
        });
  }


};


/** calculator-property-transfertax */
exports.transfertax = {


  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('transfertax')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    property.transfertax(obj)
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

    Calc.findByCalcname('transfertax')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the property-transfertax guide.");
        });
  },


  /** generate pdf for propertytax */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('transfertax')
        .then(function(data){
          pdf.generate(res, property.transfertax, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the property.transfertax pdf.");
        });
  }

};


/** calculator-property-homesave */
exports.homesave = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('homesave')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    property.homesave(obj)
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

    Calc.findByCalcname('homesave')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the property-homesave guide.");
        });
  },


  /** generate pdf for propertytax */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('homesave')
        .then(function(data){
          pdf.generate(res, property.homesave, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the property.homesave pdf.");
        });
  }

};


/** calculator-property-propertyprice */
exports.propertyprice = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('propertyprice')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    property.propertyprice(obj)
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

    Calc.findByCalcname('propertyprice')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the property-propertyprice guide.");
        });
  },


  /** generate pdf for propertytax */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('propertyprice')
        .then(function(data){
          pdf.generate(res, property.propertyprice, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the property.propertyprice pdf.");
        });
  }

};


/** calculator-property-mortgage */
exports.mortgage = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('mortgage')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    property.mortgage(obj)
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

    Calc.findByCalcname('mortgage')
        .then(function(data){
          res.render('calculatorGuide', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the property-mortgage guide.");
        });
  },


  /** generate pdf for mortgage */
  generatepdf: function(req,res){

    var Calc = require('mongoose').model('Calc');
    var inputObj = req.query;


    Calc.findByCalcname('mortgage')
        .then(function(data){
          pdf.generate(res, property.mortgage, data[0], inputObj);
        })
        .onReject(function(){
          console.log("An error occurred while generating the property.mortgage pdf.");
        });
  }

};