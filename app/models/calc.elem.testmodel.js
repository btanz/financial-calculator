var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** InputsSchema is the Schema for the inputs fields text content of calculators */
var TestSchema = new Schema({
  inputs: [{type: Object}]
});



mongoose.model('Testmodel', TestSchema);