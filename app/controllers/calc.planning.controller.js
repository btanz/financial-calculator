var planning = require('../modules/planning');
var calcElems = require('../../data/static/calcElems.json');


/** calculator-planning-retire */
exports.retire = {

  render: function(req,res){
    res.render('calculator', {obj: calcElems.retire});
  },

  calculate: function(req,res){
    var obj = req.query;
    var results = planning.retire(obj);
    res.json(results);
  }

};


