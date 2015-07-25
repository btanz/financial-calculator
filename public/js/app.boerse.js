
app.boerse = (function() {
  /*********************** BEGIN BOERSE DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {

    // attach a div where dividend dates and amounts will be added dynamically
    $('#boerse-equityreturn-dividends').closest('div[class^="form-group"]').after('<div class="dividendsInput"></div>');

    // attach event handler for dividend input fields
    $('#boerse-equityreturn-dividends').on('change', toggleInputsDividends);

    // attach event handler for fee inputs
    $('#boerse-equityreturn-fees').on('change', toggleInputsFees);

  });
  /*********************** END BOERSE DOCUMENT READY TASKS *************************/

  /*********************** BEGIN BOERSE EVENT HANDLERS ***********************/
  function toggleInputsFees (e){
    e.preventDefault();
    var state = $('#boerse-equityreturn-fees').val();
    if (state === 'true'){
      $('#boerse-equityreturn-feebuy, #boerse-equityreturn-feesell').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#boerse-equityreturn-feebuy, #boerse-equityreturn-feesell').closest('div[class^="form-group"]').addClass('hide')
    }
  }

  function toggleInputsDividends(e){
    e.preventDefault();
    var state = parseInt($('#boerse-equityreturn-dividends').val());
    if (state !== 0){
      $('.dividendsInput').children().remove();
      for(var i = 0; i< state; i++){
        app.helpers.compileTemplate('.dividendsInput','#boerse-equityreturn-dividendsInput-template', {count: String(i+1) + '. Dividende', id1: 'boerse-equityreturn-dividendDate' + i, id2: 'boerse-equityreturn-dividendAmount'+i}, true);
      }
      // initialize datepicker
      $('.input-group.date').datepicker({
        language: 'de',
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
      });
    } else {
      $('.dividendsInput').children().remove();
    }
  }




  /*********************** END BOERSE EVENT HANDLERS ***********************/

})();