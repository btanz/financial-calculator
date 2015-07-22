var calcElems = require('../../data/static/calcElems.json');
var misc = require('../modules/misc');


/** calculator-misc-daycount */
exports.daycount = {

  render: function(req,res,next){
    res.render('calculator', {obj: calcElems.daycount});
  },

  calculate: function(req,res,next){
    var obj = req.query;
    var results = misc.daycount(obj);
    res.json(results);
  }
};