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

    // initialize global event handlers
    $('#btn-calculate').on('click',function(e){submitBtnCalculate(e)});

  });
  /*********************** END DOCUMENT READY TASKS *************************/


  /*********************** BEGIN GLOBAL EVENT HANDLERS ***********************/
  function submitBtnCalculate(e){
    e.preventDefault();
    var inputs = {};
    // parse and collect inputs
    $('input').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).val();
    });

    $.getJSON('/optionspreisrechner/inputs',inputs)
        .done(function(data){
          console.log(data);
        })
        .fail(function(){
          console.log('Leider ist ein Fehler aufgetreten');
        });
  }


})();