/*
 * app.init.js
 * Client initialization function that is called on document ready
 *
 */

app.init = function(){


  // initialize datepicker
  $('.input-group.date').datepicker({
    language: 'de',
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    calendarWeeks: true,
    autoclose: true
  });


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

  // ******* HANDLEBARS HELPER ********
  Handlebars.registerHelper('numFormat', function(value,digits,type){
    if(type === "string"){
      return value.toString();
    } else {

      var formatString = '0,0.';

      //if(typeof digits != 'number') digits = 2;
      if(!(isFinite(digits)) || digits === '' || digits === null) digits = 2;

      for (var i = 0; i<digits; i++) {
        formatString += '0';
      }

      // fix rounding if number is negativ, i.e. -26.375 goes to -26.38 instead of -26.37
      if(value<0){

        return numeral(app.helpers.round(value,digits)).format(formatString);
      } else {
        return numeral(value).format(formatString);
      }

    }

  });


  Handlebars.registerHelper('tableElemImportance', function(value){
    if (value === 'second'){
      return 'table-secondary'
    } else {
      return '';
    }
  });


};