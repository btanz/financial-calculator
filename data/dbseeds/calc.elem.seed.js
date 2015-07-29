

exports.seedDB = function(){
  var Calc = require('mongoose').model('Calc');

  /** check whether DB.calcs is actually empty */
  Calc.find({}, function(err, calcs) {
    if (err) {
      return next(err);
    } else {
      if(calcs.length === 0){
        console.log('Seeding DB.calcs');
        seeder();
      } else {
        return
      }
    }
  });

};



function seeder(){
  var Calc = require('mongoose').model('Calc');

  var options = new Calc({
    name: 'options',
    id: 'boerse-options',
    designation: 'Optionspreisrechner',
    description: 'Mit dem Optionspreisrechner kannst du Preise und Parameter für Put- und Call-Optionen auf Aktien nach dem Black-Scholes-Modell bestimmen.',
    inputs: [
      {
        name: 'optiontype',
        id: 'boerse-options-optiontype',
        label: 'Art der Option',
        placeholder: 'Art der Option',
        tooltip: 'Gebe hier ein, ob die Parameter für eine Call- oder Put-Option berechnet werden sollen. Eine Call-Option (Kaufoption) räumt dem Käufer das Recht ein, eine oder mehrere Aktien zu einem vorher vereinbarten Preis (Basispreis/Strike) zu kaufen. Eine Put-Option (Verkaufsoption) räumt dem Käufer das Recht ein, eine oder mehrere Aktien zu einem vorher vereinbarten Preis (Basispreis/Strike) zu verkaufen.',
        type: 'select'
      },
      {
        name: 'price',
        id: 'boerse-options-price',
        label: 'Preis der Aktie',
        placeholder: 'Preis der Aktie',
        tooltip: 'Gebe hier den Preis der Aktien bzw. des Underlyings ein.',
        type: 'number'
      }
    ]
  });

  options.save(function(err){
    if(err){
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model');
      return next(err);
    } else {
      console.log('Calc.Elem.Model successfully seeded');
    }
  });
}