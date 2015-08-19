var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** 1. DEFINE SCHEMAS */
var IndicatorSchema = new Schema({
  id: {type: String, required: true, unique: true},
  description: {type: String, required: true}
});

/** 2. ASSIGN STATIC METHODS */
IndicatorSchema.statics.findAll = function(){
  return this.find({}).lean().exec();
};

IndicatorSchema.statics.findByDB = function(db){
  return this.find({"id" : {$regex : ".*" + db + ".*"}}).lean().exec();
};


mongoose.model('Data.Equity.Ind', IndicatorSchema);