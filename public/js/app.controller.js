/*
 * app.controller.js
 * Client application controller that ties calculators and views together
 *
 */

app.controller = (function() {
  "use strict";

  /*********************** BEGIN DOCUMENT READY TASKS ***********************/
  $(document).ready(function(){

    // initialize materializecss select buttons
    $('.button-collapse').sideNav({'edge': 'left'});
    $('select').material_select2();

    // initialie materializecss tooltips
    $('.tooltipped').tooltip({delay: 50});

    // initialize global event handlers
    $('#btn-calculate').on('click',function(e){submitBtnCalculate(e)});

    // calculate document once onLoad such that users can see first results
    $('#btn-calculate').trigger('click');

    // invalidate calculations if any of the input fields changes
    $('input, select').on('keyup change', function(e){ invalidateResults(e) })
    //$('select').on('change', function(e){ invalidateResults(e) })

  });
  /*********************** END DOCUMENT READY TASKS *************************/


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

    // make Ajax request to server
    $.getJSON('/optionspreisrechner/inputs',inputs)
        .done(function(data){

          // get, compile and fill results template
          if(!(data === null)) {
            app.helpers.compileTemplate('#main-results','#main-results-template',data.main);
            $('.tooltipped').tooltip({delay: 50});  // initalize tooltips
          } else {
            app.helpers.compileTemplate('#main-results','#main-results-error-template',{});
          }
        })
        .fail(function(){
          console.log('Leider ist ein Fehler aufgetreten');
          app.helpers.compileTemplate('#main-results','#main-results-error-template',{});
        });
  }

  // handler that invalidates result (used for example if one of the inputs changes
  function invalidateResults(e){
    app.helpers.compileTemplate('#main-results','#main-results-input-template',{});
    console.log('changed');
  }


})();