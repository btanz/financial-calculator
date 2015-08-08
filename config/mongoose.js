/** config file for Mongoose */
var config = require('./config');
var mongoose = require('mongoose');

module.exports = function(){

  var db = mongoose.connect(config.db);

  /** require mongoose model files here */
  require('../app/models/calc.elem.model');
  require('../app/models/calc.stockprices.model');
  require('../app/models/calc.elem.testmodel');

  return db;
};