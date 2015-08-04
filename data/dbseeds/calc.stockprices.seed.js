

exports.seedDB = function(){
  var DailyStockPrices = require('mongoose').model('DailyStockPrices');

  /** check whether DB.dailystockprices is actually empty */
  DailyStockPrices.find({}, function(err, dailystockprices) {
    if (err) {
      return next(err);
    } else {
      if(dailystockprices.length === 0){
        console.log('Seeding DB.dailystockprices');
        seeder();
      } else {
        console.log('DB.dailystockprices already contains data');
      }
    }
  });

};



function seeder(){
  var DailyStockPrices = require('mongoose').model('DailyStockPrices');

  /** Seed Symbol AAPL */
  var aapl = new DailyStockPrices({
    symbol: 'AAPL',
    description: 'Apple',
    quotes: [
      {date: new Date('2010-03-26'), closing: 230.9},
      {date: new Date('2010-04-02'), closing: 235.97},
      {date: new Date('2010-04-09'), closing: 241.79},
      {date: new Date('2010-04-16'), closing: 247.4},
      {date: new Date('2010-04-23'), closing: 270.83},
      {date: new Date('2010-04-30'), closing: 261.09},
      {date: new Date('2010-05-07'), closing: 235.86},
      {date: new Date('2010-05-14'), closing: 253.82},
      {date: new Date('2010-05-21'), closing: 242.32},
      {date: new Date('2010-05-28'), closing: 256.88},
      {date: new Date('2010-06-04'), closing: 255.965},
      {date: new Date('2010-06-11'), closing: 253.51},
      {date: new Date('2010-06-18'), closing: 274.074},
      {date: new Date('2010-06-25'), closing: 266.7},
      {date: new Date('2010-07-02'), closing: 246.94},
      {date: new Date('2010-07-09'), closing: 259.62},
      {date: new Date('2010-07-16'), closing: 249.9},
      {date: new Date('2010-07-23'), closing: 259.94},
      {date: new Date('2010-07-30'), closing: 257.25},
      {date: new Date('2010-08-06'), closing: 260.091},
      {date: new Date('2010-08-13'), closing: 249.1},
      {date: new Date('2010-08-20'), closing: 249.64},
      {date: new Date('2010-08-27'), closing: 241.62},
      {date: new Date('2010-09-03'), closing: 258.77},
      {date: new Date('2010-09-10'), closing: 263.41},
      {date: new Date('2010-09-17'), closing: 275.37},
      {date: new Date('2010-09-24'), closing: 292.32},
      {date: new Date('2010-10-01'), closing: 282.52},
      {date: new Date('2010-10-08'), closing: 294.07},
      {date: new Date('2010-10-15'), closing: 314.74},
      {date: new Date('2010-10-22'), closing: 307.47}
    ]
  });


  aapl.save(function(err){
    if(err){
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.APPL');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.APPL successfully seeded');
    }
  });

  /** Seed Symbol C */
  var c = new DailyStockPrices({
    symbol: 'C',
    description: 'Citi Group',
    quotes: [
      {date: new Date('2010-03-26'), closing: 4.31},
      {date: new Date('2010-04-02'), closing: 4.18},
      {date: new Date('2010-04-09'), closing: 4.55},
      {date: new Date('2010-04-16'), closing: 4.56},
      {date: new Date('2010-04-23'), closing: 4.86},
      {date: new Date('2010-04-30'), closing: 4.37},
      {date: new Date('2010-05-07'), closing: 4},
      {date: new Date('2010-05-14'), closing: 3.98},
      {date: new Date('2010-05-21'), closing: 3.75},
      {date: new Date('2010-05-28'), closing: 3.96},
      {date: new Date('2010-06-04'), closing: 3.79},
      {date: new Date('2010-06-11'), closing: 3.88},
      {date: new Date('2010-06-18'), closing: 4.01},
      {date: new Date('2010-06-25'), closing: 3.94},
      {date: new Date('2010-07-02'), closing: 3.79},
      {date: new Date('2010-07-09'), closing: 4.04},
      {date: new Date('2010-07-16'), closing: 3.9},
      {date: new Date('2010-07-23'), closing: 4.02},
      {date: new Date('2010-07-30'), closing: 4.1},
      {date: new Date('2010-08-06'), closing: 4.06},
      {date: new Date('2010-08-13'), closing: 3.88},
      {date: new Date('2010-08-20'), closing: 3.75},
      {date: new Date('2010-08-27'), closing: 3.76},
      {date: new Date('2010-09-03'), closing: 3.91},
      {date: new Date('2010-09-10'), closing: 3.91},
      {date: new Date('2010-09-17'), closing: 3.95},
      {date: new Date('2010-09-24'), closing: 3.904},
      {date: new Date('2010-10-01'), closing: 4.09},
      {date: new Date('2010-10-08'), closing: 4.19},
      {date: new Date('2010-10-15'), closing: 3.95},
      {date: new Date('2010-10-22'), closing: 4.11}
    ]
  });


  c.save(function(err){
    if(err){
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.C');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.C successfully seeded');
    }
  });


  /** Seed Symbol GE */
  var ge = new DailyStockPrices({
    symbol: 'GE',
    description: 'General Electric',
    quotes: [
      {date: new Date('2010-03-26'), closing: 18.34},
      {date: new Date('2010-04-02'), closing: 18.33},
      {date: new Date('2010-04-09'), closing: 18.52},
      {date: new Date('2010-04-16'), closing: 18.97},
      {date: new Date('2010-04-23'), closing: 19.07},
      {date: new Date('2010-04-30'), closing: 18.86},
      {date: new Date('2010-05-07'), closing: 16.88},
      {date: new Date('2010-05-14'), closing: 17.64},
      {date: new Date('2010-05-21'), closing: 16.42},
      {date: new Date('2010-05-28'), closing: 16.35},
      {date: new Date('2010-06-04'), closing: 15.71},
      {date: new Date('2010-06-11'), closing: 15.56},
      {date: new Date('2010-06-18'), closing: 15.95},
      {date: new Date('2010-06-25'), closing: 14.91},
      {date: new Date('2010-07-02'), closing: 13.88},
      {date: new Date('2010-07-09'), closing: 14.95},
      {date: new Date('2010-07-16'), closing: 14.55},
      {date: new Date('2010-07-23'), closing: 15.71},
      {date: new Date('2010-07-30'), closing: 16.12},
      {date: new Date('2010-08-06'), closing: 16.45},
      {date: new Date('2010-08-13'), closing: 15.38},
      {date: new Date('2010-08-20'), closing: 15.03},
      {date: new Date('2010-08-27'), closing: 14.71},
      {date: new Date('2010-09-03'), closing: 15.3925},
      {date: new Date('2010-09-10'), closing: 15.98},
      {date: new Date('2010-09-17'), closing: 16.29},
      {date: new Date('2010-09-24'), closing: 16.66},
      {date: new Date('2010-10-01'), closing: 16.36},
      {date: new Date('2010-10-08'), closing: 17.12},
      {date: new Date('2010-10-15'), closing: 16.3},
      {date: new Date('2010-10-22'), closing: 16.055}
    ]
  });


  ge.save(function(err){
    if(err){
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.GE');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.GE successfully seeded');
    }
  });


  /** Seed Symbol XOM */
  var xom = new DailyStockPrices({
    symbol: 'XOM',
    description: 'Exxon Mobil',
    quotes: [
      {date: new Date('2010-03-26'), closing: 66.54},
      {date: new Date('2010-04-02'), closing: 67.61},
      {date: new Date('2010-04-09'), closing: 68.76},
      {date: new Date('2010-04-16'), closing: 67.93},
      {date: new Date('2010-04-23'), closing: 69.24},
      {date: new Date('2010-04-30'), closing: 67.77},
      {date: new Date('2010-05-07'), closing: 63.7},
      {date: new Date('2010-05-14'), closing: 63.6},
      {date: new Date('2010-05-21'), closing: 60.88},
      {date: new Date('2010-05-28'), closing: 60.46},
      {date: new Date('2010-06-04'), closing: 59.525},
      {date: new Date('2010-06-11'), closing: 61.86},
      {date: new Date('2010-06-18'), closing: 63.1},
      {date: new Date('2010-06-25'), closing: 59.1},
      {date: new Date('2010-07-02'), closing: 56.57},
      {date: new Date('2010-07-09'), closing: 58.78},
      {date: new Date('2010-07-16'), closing: 57.96},
      {date: new Date('2010-07-23'), closing: 59.72},
      {date: new Date('2010-07-30'), closing: 59.68},
      {date: new Date('2010-08-06'), closing: 61.97},
      {date: new Date('2010-08-13'), closing: 59.91},
      {date: new Date('2010-08-20'), closing: 58.89},
      {date: new Date('2010-08-27'), closing: 59.8},
      {date: new Date('2010-09-03'), closing: 61.32},
      {date: new Date('2010-09-10'), closing: 61.2},
      {date: new Date('2010-09-17'), closing: 60.78},
      {date: new Date('2010-09-24'), closing: 61.75},
      {date: new Date('2010-10-01'), closing: 62.54},
      {date: new Date('2010-10-08'), closing: 64.38},
      {date: new Date('2010-10-15'), closing: 65.19},
      {date: new Date('2010-10-22'), closing: 66.34}
    ]
  });


  xom.save(function(err){
    if(err){
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.XOM');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.XOM successfully seeded');
    }
  });


}
