/*
 * app.controller.js
 * Client application controller that ties calculators and views together
 *
 */

app.controller = (function() {
  "use strict";

  /*********************** BEGIN DOCUMENT READY TASKS ***********************/
  $(document).ready(function(){

    // run initialization steps
    app.init();

    // initialize global event handlers
    $('#btn-calculate').on('click',function(e){submitBtnCalculate(e)});

    // calculate document once onLoad such that users can see first results
    $('#btn-calculate').trigger('click');

    // invalidate calculations if any of the input fields changes
    $('input, select').on('keyup change', function(e){ invalidateResults(e) })

  });
  /*********************** END DOCUMENT READY TASKS *************************/

  // XXX
    // Minimalize menu when screen is less than 768px
  $(window).bind("resize", function () {
    if ($(this).width() < 769) {
      $('body').addClass('body-small')
    } else {
      $('body').removeClass('body-small')
    }
  });



  /*********************** BEGIN GLOBAL EVENT HANDLERS ***********************/
  // handler that deals with submit button events
  function submitBtnCalculate(e){
    e.preventDefault();
    var inputs = {};

    // parse and collect inputs
    $('input').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).val();
    });

    $('select').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).find(":selected").val();
    });


    // make Ajax request to server
    $.getJSON(e.currentTarget.baseURI + '/inputs',inputs)
        .done(function(data){

          // get, compile and fill results template
          if(!(data === null) && (typeof data.id === 'string')) {
            if(data._1)
              app.helpers.compileTemplate('#results-1','#main-results-template',data._1);

            if(data._2)
              app.helpers.compileTemplate('#results-2','#' + data.id + '-results-2-template',data._2);

            $('.tooltipped').tooltip({delay: 50});  // initalize tooltips
            console.log(data);
          } else {
            app.helpers.compileTemplate('#results-1','#main-results-error-template',{});
          }
        })
        .fail(function(){
          console.log('Leider ist ein Fehler aufgetreten');
          app.helpers.compileTemplate('#results-1','#main-results-error-template',{});
        });
  }

  // handler that invalidates result (used for example if one of the inputs changes
  function invalidateResults(e){
    e.preventDefault();
    app.helpers.clearAllResultsTemplates();
  }


})();