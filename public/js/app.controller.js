/**
 * app.controller.js
 * Client application controller that ties calculators and views together
 *
 */

app.controller = (function() {
  "use strict";

  /*********************** BEGIN GLOBAL DOCUMENT READY TASKS ***********************/
  $(document).ready(function(){

    /**
     * run initialization steps
     */
    app.init();

    /**
     * attach global event handlers
     */

    /** calculate document once submit button is clicked */
    $('#btn-calculate').on('click', submitBtnCalculate);

    /** calculate document once onLoad such that users can see first results */
    $('#btn-calculate').trigger('click');

    /** invalidate calculations if any of the input fields changes */
    $('input, select').on('keyup change', invalidateResults);

    /** handling for input field dropdown buttons */
    $('ul.dropdown-menu li a').on('click', dropdownToggle);

  });
  /*********************** END GLOBAL DOCUMENT READY TASKS *************************/


  /*********************** BEGIN GLOBAL EVENT HANDLERS ***********************/

  /**
   * Handle submit button events
   * @param e
   */
  function submitBtnCalculate(e){
    e.preventDefault();
    var inputs = {};

    /**
     * Parse and collect inputs
     */

    /** parse input fields */
    $('input').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).val();
    });

    /** parse select fields */
    $('select').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).find(":selected").val();
    });

    /** parse button-numberselect fields */
    $('button.dropdown-toggle').each(function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).attr('value');
    });


    /**
     * Make AJAX-request to server
     */
    $.getJSON(e.currentTarget.baseURI + '/inputs',inputs)
        .done(function(data) {


          // stop wait spinner
          app.spinner.stop();
          $('#wrapper').removeClass('overlay');

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

              // add the chartist autoscale function if x-axis should not be a standard step axis
              data._chart1.autoscaleAxisX ? data._chart1.options.axisX.type =  Chartist.AutoScaleAxis : null;

              app.helpers.compileTemplate('#results-11', '#main-results-chart-template', data._chart1);
              new Chartist[data._chart1.type]('#'+data._chart1.id, data._chart1.data, data._chart1.options, data._chart1.responsiveoptions);

            }

            // compile charts
            if (data._chart2){

              // add the chartist autoscale function if x-axis should not be a standard step axis
              data._chart2.autoscaleAxisX ? data._chart2.options.axisX.type =  Chartist.AutoScaleAxis : null;

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
        .fail(function(e){
          console.log('Leider ist ein Fehler aufgetreten');
          console.log(e);
          app.helpers.compileTemplate('#results-1','#main-results-error-template',{});
        });


    // run spinner to bridge waiting times
    app.spinner.spin($('#wrapper')[0]);
    $('#wrapper').toggleClass('overlay');


  }

  /**
   * Read selected value from a clicked dropdown toggle and write it to associated button
   * @param e
   */
  function dropdownToggle(e){
    /** prevent following the link */
    e.preventDefault();
    /** set button text to selected element from dropdown */
    e.currentTarget.parentElement.parentElement.previousSibling.innerHTML = e.currentTarget.innerHTML + '<span class="caret"></span>';
    /** set button value to href index of selected element from dropdown */
    e.currentTarget.parentElement.parentElement.previousSibling.value = e.currentTarget.pathname.substring(1)
  }


  /**
   * Invalidate and clear results
   * @param e
   */
  function invalidateResults(e){
    e.preventDefault();
    app.helpers.clearAllResultsTemplates();
  }


})();