var planning = require('../modules/planning');


/** calculator-planning-retire */
exports.retire = {

  render: function(req, res) {
    var Calc = require('mongoose').model('Calc');

    Calc.findByCalcname('retire')
        .then(function(data){
          res.render('calculator', {obj: data[0]});
        })
        .onReject(function(){
          console.log("An error occurred while rendering the planning-retire calculator.");
        });
  },

  calculate: function(req, res){
    var obj = req.query;
    planning.retire(obj)
        .then(function(results){
          res.json(results);
        })
        .onReject(function(){
          console.log('Error occurred');
          res.json({});
        });
  }

};


