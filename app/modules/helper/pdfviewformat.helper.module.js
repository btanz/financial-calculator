/**
 * Created by benjamintanz on 24.09.15.
 */
var numeral = require('numeral');



/**
 * CONFIG NUMERAL
 */
numeral.language('de', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal:
      function(){return"."},
  currency: {
    symbol: '€'
  }
});

// switch languages
numeral.language('de');
numeral.defaultFormat('0,0.00');


/**
 * LOCAL FUNCTIONS
 */
round = function(number, digits){
  return (number < 0) ? - Math.round(Math.abs(number) * Math.pow(10, digits)) / Math.pow(10, digits) : Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
};






/**
 * EXPOSED FUNCTIONS
 */
exports.format = function(value){

  if(value.type === "string"){
    return value.value.toString();
  } else {

    var formatString = '0,0.';

    //if(typeof digits != 'number') digits = 2;
    if(!(isFinite(value.digits)) || value.digits === '' || value.digits === null) value.digits = 2;

    for (var i = 0; i<value.digits; i++) {
      formatString += '0';
    }

    // fix rounding if number is negativ, i.e. -26.375 goes to -26.38 instead of -26.37
    if(value.value < 0){

      return numeral(round(value.value, value.digits)).format(formatString);
    } else {
      return numeral(value.value).format(formatString);
    }

  }

};