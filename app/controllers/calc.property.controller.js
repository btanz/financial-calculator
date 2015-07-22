var calcElems = require('../../data/static/calcElems.json');
var property = require('../modules/property');


/** calculator-property-propertyreturn */
exports.propertyreturn = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.propertyreturn});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = property.propertyreturn(obj);
    res.json(results);
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