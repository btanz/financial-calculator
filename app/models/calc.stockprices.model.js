var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/** 1. DEFINE SCHEMAS */
/** Quotes is the Schema for a single Stock quote, containing the date as well as a closing price */
var QuotesSchema = new Schema({
  date: Date,
  closing: Number
});

/** DailyStockPrices is the Schema for documents containing daily stock prices */
var DailyStockPricesSchema = new Schema({
  symbol: {type: String, required: true, unique: true},
  description: {type: String},
  quotes: [QuotesSchema]
});


/** 2. ASSIGN STATIC METHODS */
DailyStockPricesSchema.statics.findBySymbol = function(symbol, cb){
  return this.find({ symbol: symbol }, cb);
};


/** 3. ASSIGN VIRTUAL PROPERTY GETTERS */

/** price only array */
DailyStockPricesSchema.virtual('price.array').get(function(){
  var closings = [];
  this.quotes.forEach(function(val){
    closings.push(val.closing);
  });
  return closings;
});

/** date only array */
DailyStockPricesSchema.virtual('date.array').get(function(){
  var dates = [];
  this.quotes.forEach(function(val){
    dates.push(val.date);
  });
  return dates;
});


/** return only array */
DailyStockPricesSchema.virtual('return.array').get(function(){
  var returns = [];
  var lastclosing;
  this.quotes.forEach(function(val, ind){
    if(ind === 0){
      returns.push(null);
      lastclosing = val.closing;
    } else {
      returns.push(val.closing/lastclosing-1);
      lastclosing = val.closing;
    }

  });
  return returns;
});







mongoose.model('DailyStockPrices', DailyStockPricesSchema);