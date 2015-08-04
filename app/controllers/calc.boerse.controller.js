var boerse = require('../modules/boerse');
var calcElems = require('../../data/static/calcElems.json');

/** calculator-boerse-options */
exports.options = {
  render: function(req, res) {
    res.render('calculator', {obj: calcElems.options });
  },

  calculate: function(req,res){
    var obj = req.query;
    var results = boerse.blackScholes(obj);
    res.json(results);
  }
};


/** calculator-boerse-fx */
exports.fx = {
  render: function(req, res){
    res.render('calculator', {obj: calcElems.fx});
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
  }
};


/** calculator-boerse-equityreturn */
exports.equityreturn = {
  render: function(req,res){
    res.render('calculator', {obj: calcElems.equityreturn});
  },

  calculate: function(req,res){
    var obj = req.query;
    var results = boerse.equityReturn(obj);
    res.json(results);
  }
};


/** calculator-boerse-portfolio */
exports.portfolio = {
  render: function(req,res){
    res.render('calculator', {obj: calcElems.portfolio});
  },

  calculate: function(req,res){
    var obj = req.query;
    boerse.portfolio(obj, function (err, results) {
      if (results) {
        res.json(results);
      }
      if (err) {
        res.json(err)
      }
    });

  }
};


