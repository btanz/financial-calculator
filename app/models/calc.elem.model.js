var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** InputsSchema is the Schema for the inputs fields text content of calculators */
var InputsSchema = new Schema({
  name: {type: String, required: true},
  id: {type: String, required: true, unique: true},
  label: String,
  placeholder: String,
  addon: String,
  tooltip: String,
  type: String,
  vtype: String,
  value: String,
  args: [Number],
  options: [{
    id: String,
    description: String
  }]
});


/** Results1Schema is the Schema for the results 1 fields text content of calculators */
var Results1Schema = new Schema({
  name: {type: String, required: true},
  description: String,
  unit: String,
  digits: String,
  importance: String,
  tooltip: String
});


/** CalcSchema is the Schema for the text content of calculators */
var CalcSchema = new Schema({
  name: {type: String, required: true, unique: true},
  id: {type: String, required: true, unique: true},
  designation: String,
  description: String,
  inputs: [InputsSchema],
  results_1: [Results1Schema]
});

mongoose.model('Calc', CalcSchema);