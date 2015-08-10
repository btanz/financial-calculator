var calcElems = require('../../data/static/calcElems.json');
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
          console.log("An error occurred while rendering the deposits-depsaving calculator.");
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
  }

};


/** calculator-property-buyrent */
exports.buyrent = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.propertybuyrent});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = property.buyrent(obj);
    res.json(results);
  }
};


/** calculator-property-rent */
exports.rent = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.rent});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = property.rent(obj);
    res.json(results);
  }
};


/** calculator-property-transfertax */
exports.transfertax = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.transfertax});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = property.transfertax(obj);
    res.json(results);
  }
};


/** calculator-property-homesave */
exports.homesave = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.homesave});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = property.homesave(obj);
    res.json(results);
  }
};


/** calculator-property-propertyprice */
exports.propertyprice = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.propertyprice});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = property.propertyprice(obj);
    res.json(results);
  }
};


/** calculator-property-mortgage */
exports.mortgage = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.mortgage});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = property.mortgage(obj);
    res.json(results);
  }
};