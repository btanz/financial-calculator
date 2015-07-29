var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** CalcSchema is the Schema for the text content of calculators */
var CalcSchema = new Schema({
  firstName: String,
  lastName: String
});

mongoose.model('Calc', CalcSchema);