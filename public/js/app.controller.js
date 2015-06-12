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
          app.helpers.compileTemplate('#main-results','#main-results-template',data.main);
          // intialize tooltips
          $('.tooltipped').tooltip({delay: 50});
        })
        .fail(function(){
          // todo: error handling
          console.log('Leider ist ein Fehler aufgetreten');
        });
  }


})();