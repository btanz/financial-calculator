var config = require('./config');
var mongoose = require('mongoose');

module.exports = function(){

  var db = mongoose.connect(config.db);

  /** require mongoose model files here */
  require('../app/models/calc.elem.model');

  return db;
};