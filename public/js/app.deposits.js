
app.deposits = (function() {
  /*********************** BEGIN DEPOSITS DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {

    // attach event handler for calculation selection mode
    $('#deposits-interest-select').on('change', function (e) {
      toggleInterestSelect(e);
    });


  });
  /*********************** END DEPOSITS DOCUMENT READY TASKS *************************/

  /*********************** BEGIN DEPOSITS EVENT HANDLERS ***********************/
  function toggleInterestSelect (e){
    e.preventDefault();

    var state = $('#deposits-interest-select').val();
    console.log(state);

    // todo: continue here!!

    /*
    var state = $('#boerse-equityreturn-fees').val();
    if (state === 'true'){
      $('#boerse-equityreturn-feebuy, #boerse-equityreturn-feesell').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#boerse-equityreturn-feebuy, #boerse-equityreturn-feesell').closest('div[class^="form-group"]').addClass('hide')
    }*/
  }






  /*********************** END DEPOSITS EVENT HANDLERS ***********************/

})();