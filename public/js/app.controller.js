/*
 * app.controller.js
 * Client application controller that ties calculators and views together
 *
 */

app.controller = (function() {
  "use strict";

  /*********************** BEGIN GLOBAL DOCUMENT READY TASKS ***********************/
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
  /*********************** END GLOBAL DOCUMENT READY TASKS *************************/


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
        .done(function(data) {

          // get, compile and fill results template
          if (!(data === null) && (typeof data.id === 'string')) {  // case where everything is alright
            if (data._1)
              app.helpers.compileTemplate('#results-1', '#main-results-template', data);

            if (data._2)
              app.helpers.compileTemplate('#results-2', '#' + data.id + '-results-2-template', data._2);

            if (data._3)
              app.helpers.compileTemplate('#results-3', '#' + data.id + '-results-3-template', data._3);

            // compile charts
            if (data._chart1){
              console.log('#'+data._chart1.id);
              app.helpers.compileTemplate('#results-11', '#main-results-chart-template', data._chart1);
              new Chartist[data._chart1.type]('#'+data._chart1.id, data._chart1.data, data._chart1.options, data._chart1.responsiveoptions);
            }

            // compile charts
            if (data._chart2){
              console.log('#'+data._chart2.id);
              app.helpers.compileTemplate('#results-12', '#main-results-chart-template', data._chart2);
              new Chartist[data._chart2.type]('#'+data._chart2.id, data._chart2.data, data._chart2.options, data._chart2.responsiveoptions);
            }

            // initialize new tooltips
            $('[data-toggle="tooltip"]').tooltip();

          } else if (!(data === null) && Array.isArray(data)){  // case where an errorMap is returned
            app.helpers.compileTemplate('#results-1','#main-results-error-template',{errors: data});

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