var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** 1. DEFINE SCHEMAS */

/** InputsSchema is the Schema for the inputs fields text content of calculators */
var InputsSchema = new Schema({
  name: {type: String, required: true, unique: true},
  id: {type: String, required: true},
  label: String,
  placeholder: String,
  addon: String,
  tooltip: String,
  type: String,
  vtype: String,
  value: String,
  labelselect: String,
  idselect: String,
  selectedoption: String,
  linetop: Boolean,
  secondary: Boolean,
  optional: Boolean,
  disabled: Boolean,
  hide: Boolean,
  array: Boolean,
  arrayParent: String,
  args: [Number],
  options: [{
    id: String,
    description: String,
    selected: Boolean
  }]
});


/** Results1Schema is the Schema for the results 1 fields text content of calculators */
var Results1Schema = new Schema({
  name: {type: String, required: true},
  description: String,
  unit: String,
  digits: String,
  importance: String,
  tooltip: String,
  type: String,
  omittooltip: Boolean
});


/** CalcSchema is the Schema for the text content of calculators */
var CalcSchema = new Schema({
  name: {type: String, required: true},
  id: {type: String, required: true},
  designation: String,
  description: String,
  keywords: [String],
  guidelink: String,
  guidegoal: String,
  guidequestions: [String],
  guideaudience: [String],
  guidesteps: [String],
  guideresult: [String],
  guidereferences: [String],
  guidetext: String,
  inputs: [InputsSchema],
  results_1: [Results1Schema]
});


/** 2. ASSIGN STATIC METHODS */
CalcSchema.statics.findByCalcname = function(name, cb){
  return this.find({ name: name }).lean().exec();
};





mongoose.model('Calc', CalcSchema);