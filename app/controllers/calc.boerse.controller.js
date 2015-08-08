var boerse = require('../modules/boerse');
var calcElems = require('../../data/static/calcElems.json');

/** calculator-boerse-options */
exports.options = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    // todo: promisify
    Calc.find({name: 'options'}, function(err, data){
      if(err) console.log('ERROR OCCURED');
      res.render('calculator', {obj: data[0]});
    });

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
    boerse.portfolio(obj)
      .then(function(results){
        res.json(results);
      })
      .catch(function(){
        console.log('An error occured');
        res.json([]);
      });

  }


};


