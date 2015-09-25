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

    /** generate pdf */
    // todo: move this to place where it is only visible when calculation was performed
    $('#btn-pdf').on('click', submitGeneratePdf);

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
    $('#inputs input').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).val();
    });

    /** parse select fields */
    $('#inputs select').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).find(":selected").val();
    });

    /** parse button-numberselect fields */
    $('#inputs button.dropdown-toggle').each(function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).attr('value');
    });


    /**
     * Make AJAX-request to server
     */
    $.getJSON($(location).attr('pathname') + '/inputs',inputs)
        .done(function(data) {


          // stop wait spinner and remove overlay class
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
              app.charts.create(data._chart1, '#results-11');
            }

            // compile charts
            if (data._chart2){
              app.charts.create(data._chart2, '#results-12');
            }

            // compile feedback template and add button event handler
            app.helpers.compileTemplate('#feedback', '#main-results-feedback-template', data);
            $('#btn-feedback').on('click', submitBtnFeedback);

            // initialize new tooltips
            $('[data-toggle="tooltip"]').tooltip();

          } else if (!(data === null) && Array.isArray(data)){  // case where an errorMap is returned
            app.helpers.compileTemplate('#results-1','#main-results-error-template',{errors: data});

          } else {
            app.helpers.compileTemplate('#results-1','#main-results-error-template',{});
          }
        })
        .fail(function(e){
          // stop wait spinner and remove overlay class
          app.spinner.stop();
          $('#wrapper').removeClass('overlay');

          app.helpers.compileTemplate('#results-1','#main-results-servererror-template',{});
        })
        .always(function(e){
          /** re-set output containers given adjusted height */
          var $container = $('.masonry-container');
          $container.masonry({});
        });


    // run spinner to bridge waiting times
    app.spinner.spin($('#wrapper')[0]);
    $('#wrapper').toggleClass('overlay');


  }


  /**
   * Handle feedback button submission
   */
  function submitBtnFeedback(e) {
    e.preventDefault();
    var message = {};
    message.text = $('#feedback-text').val();
    message.name = $('#feedback-name').val();
    message.email = $('#feedback-email').val();

    console.log(message);

    $.ajax({
      url: '/helper/feedback',
      type: 'GET',
      data: message
    })
    .done(function(data){
      $('#feedback-text, #feedback-name, #feedback-email, #btn-feedback').hide('slow',function(){
        $('#feedback-content').append('<h3 hidden id="feedback-thanks" class="sf-green"><i class="fa fa-check fa-lg"></i> Wir haben Ihr Feedback erhalten. Vielen Dank!</h3>');
        $('#feedback-thanks').show('slow',function(){
          /* resize box */
          var $container = $('.masonry-container');
          $container.masonry({});
        });

      });

    })
    .fail(function(){

      $('#feedback-text, #feedback-name, #feedback-email, #btn-feedback').hide('slow',function(){
        $('#feedback-content').append('<p hidden id="feedback-error" class="sf-red"><i class="fa fa-times fa-lg"></i> Hoppla. Leider ist ein Fehler aufgetreten und Ihre Feedback konnte nicht übermittelt werden. Bitte versuchen Sie es später noch einmal.</p>');
        $('#feedback-error').show('slow',function(){
          /* resize box */
          var $container = $('.masonry-container');
          $container.masonry({});
        });
      });
    })


  }


  /**
   * Handle request for pdf
   */
  function submitGeneratePdf(e) {
    e.preventDefault();

    var inputs = {};
    var queryString;

    /**
     * Parse and collect inputs
     */

    /** NEW parser for input fields
    $('#inputs .form-group').each(function(){
      //console.log($(this).find('label').text());
      //console.log($(this).find('input').val());
      inputs[$(this).find('label').text().trim()] = $(this).find('input').val();
    });*/


    /** parse input fields (legacy) */
    $('#inputs input').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).val();
    });


    /** parse select fields */
    $('#inputs select').each( function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).find(":selected").val();
    });

    /** parse button-numberselect fields */
    $('#inputs button.dropdown-toggle').each(function(){
      var id = $(this).attr('id');
      inputs[id.split('-')[id.split('-').length-1]] = $(this).attr('value');
    });


    /** assign parsed values to query string */
    queryString = $.param(inputs);

    /** perform request */
    window.open($(location).attr('pathname') + '/pdf?' + queryString);


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