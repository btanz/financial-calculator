/*
 * app.init.js
 * Client initialization function that is called on app init
 *
 */

app.init = function(){

  // initialize numeral.js package for number formatting
  (function(){

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
  }());

  // initialize Handlebars helpers
  Handlebars.registerHelper('numFormat', function(value,digits){
    var formatString = '0,0.';

    if(typeof digits != 'number') digits = 2;

    for (var i = 0; i<digits; i++) {
      formatString += '0';
    }

    return numeral(value).format(formatString);
  });


};