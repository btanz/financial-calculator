var qMeta = require(__dirname + '/../metadata/quandl/quandl');


exports.seedDB = function(){
  var Indicator = require('mongoose').model('Data.Equity.Ind');

  /** check whether model is actually empty */
  Indicator.find({}, function(err, calcs) {
    if (err) {
      return next(err);
    } else {
      if(calcs.length === 0){
        console.log('Seeding Data.Equity.Ind');
        seeder();
      } else {
        console.log('Data.Equity.Ind already contains data');
      }
    }
  });

};


function seeder() {
  var Indicator = require('mongoose').model('Data.Equity.Ind');

  /** seed indicators for Frankfurt Stock Exchange FSE */
  qMeta.fse.forEach(function(asset){
    new Indicator({id: asset.id, description: asset.description.toUpperCase()}).save(function (err) {
      if (err) {
        console.log(err);
        console.log('Seed Failed for an equity indicator');
        //return next(err);
        return;
      } else {
        console.log('Equity indicator successfully seeded');
      }
    })

  });


  /** seed indicators for Quandl WIKI */
  qMeta.wiki.forEach(function(asset){
    new Indicator({id: asset.id, description: asset.description.toUpperCase()}).save(function (err) {
      if (err) {
        console.log(err);
        console.log('Seed Failed for an equity indicator');
        //return next(err);
        return;
      } else {
        console.log('Equity indicator successfully seeded');
      }
    })

  });




}