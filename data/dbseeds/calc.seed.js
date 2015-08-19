var seedCalcElem         = require('./calc.elem.seed');
var seedCalcStockprices  = require('./calc.stockprices.seed');
var seedEquityIndices    = require('./data.equity.ind.seed');

/**
 *  This is the master file for seeding the database for calculators
 *  It calls several 'sub-seeders' that fill in data for sub-modules such as
 *  the calculator descriptions and stock price data
 *
 * */




exports.seedDB = function(){

  /** Seed Calculator Elements */
  seedCalcElem.seedDB();

  /** Seed Calculator Stockprices */
  seedCalcStockprices.seedDB();

  /** Seed Equity Indicators database */
  seedEquityIndices.seedDB();

};


