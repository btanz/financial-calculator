
app.deposits = (function() {
  /*********************** BEGIN DEPOSITS DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {
    // todo: abstract and shorten code, especially make it calculation-indepedent
    // attach event handler for calculation selection mode
    $('#deposits-interest-select').on('change', function (e) {
      toggleInterestSelect(e);
    });

    $('#deposits-savings-select').on('change', function (e) {
      toggleSavingsSelect(e);
    });

    $('#deposits-timedeposit-taxes').on('change', function (e) {
      toggleTimedepositSelecttax(e);
    });

    $('#deposits-timedeposit-calcselect').on('change', function (e) {
      toggleTimedepositCalcselect(e);
    });


  });
  /*********************** END DEPOSITS DOCUMENT READY TASKS *************************/

  /*********************** BEGIN DEPOSITS EVENT HANDLERS ***********************/

  function toggleTimedepositSelecttax(e){
    e.preventDefault();
    var state = $('#deposits-timedeposit-taxes').val();
    if (state === 'true'){
      $('#deposits-timedeposit-taxrate, #deposits-timedeposit-taxfree, #deposits-timedeposit-taxtime').closest('div[class^="form-group"]').removeClass('hide');
    } else if (state === 'false'){
      $('#deposits-timedeposit-taxrate, #deposits-timedeposit-taxfree, #deposits-timedeposit-taxtime').closest('div[class^="form-group"]').addClass('hide');
    }
  }

  function toggleTimedepositCalcselect (e){
    e.preventDefault();

    var state = $('#deposits-timedeposit-calcselect').val();
    var disabledMap = ['#deposits-timedeposit-interestgain','#deposit-timedeposit-principal','#deposits-timedeposit-interest','#deposits-timedeposit-term'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }



  function toggleInterestSelect (e){
    e.preventDefault();

    var state = $('#deposits-interest-select').val();
    var disabledMap = ['#deposits-interest-end','#deposits-interest-start','#deposits-interest-rate','#deposits-interest-period'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }


  function toggleSavingsSelect (e){
    e.preventDefault();

    var state = $('#deposits-savings-select').val();
    var disabledMap = ['#deposits-savings-terminal','#deposits-savings-principal','#deposits-savings-inflow','#deposits-savings-term','#deposits-savings-interest'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }

  /*********************** END DEPOSITS EVENT HANDLERS ***********************/

})();