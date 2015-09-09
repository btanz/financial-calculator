var property = require('../modules/property');


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
  }

};