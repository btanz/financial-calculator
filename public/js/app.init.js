/*
 * app.init.js
 * Client initialization function that is called on app init
 *
 */

app.init = function(){

  // *** run scripts for responsive view ***

  // Add body-small class if window less than 768px
  if ($(document).width() < 769) {
    $('body').addClass('body-small')
  } else {
    $('body').removeClass('body-small')
  }

  // lhs menu
  $('#side-menu').metisMenu();

  // Full height of sidebar
  function fix_height() {
    var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    $(".sidebar-panel").css("min-height", heightWithoutNavbar + "px");

    console.log(heightWithoutNavbar);

    var navbarHeigh = $('nav.navbar-default').height();
    var wrapperHeigh = $('#page-wrapper').height();

    if(navbarHeigh > wrapperHeigh){
      $('#page-wrapper').css("min-height", navbarHeigh + "px");
    }

    if(navbarHeigh < wrapperHeigh){
      $('#page-wrapper').css("min-height", $(window).height()  + "px");
    }
  }
  fix_height();

  $(document).bind("load resize scroll", function() {
    if(!$("body").hasClass('body-small')) {
      fix_height();
    }
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