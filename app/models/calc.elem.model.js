var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** CalcSchema is the Schema for the text content of calculators */
var InputsSchema = new Schema({
  name: String,
  id: String,
  label: String,
  placeholder: String,
  tooltip: String,
  type: String
});


var CalcSchema = new Schema({
  name: String,
  id: String,
  designation: String,
  description: String,
  inputs: [InputsSchema]
});

mongoose.model('Calc', CalcSchema);