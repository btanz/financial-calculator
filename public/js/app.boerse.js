
app.boerse = (function() {
  /*********************** BEGIN BOERSE DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {

    $('#boerse-equityreturn-fees').on('change', function (e) {
      toggleInputs(e);
    });

  });
  /*********************** END BOERSE DOCUMENT READY TASKS *************************/

  /*********************** BEGIN BOERSE EVENT HANDLERS ***********************/
  function toggleInputs (e){
    e.preventDefault();
    var state = parseInt($('#boerse-equityreturn-fees').val());
    if (state === 2){
      $('#boerse-equityreturn-feebuy, #boerse-equityreturn-feesell').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 1){
      $('#boerse-equityreturn-feebuy, #boerse-equityreturn-feesell').closest('div[class^="form-group"]').addClass('hide')
    }

  }

  /*********************** END BOERSE EVENT HANDLERS ***********************/

})();