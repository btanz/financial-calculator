
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

    $('#deposits-savingscheme-taxes').on('change', function (e) {
      toggleSavingschemeSelecttax(e);
    });

    $('#deposits-savingscheme-calcselect').on('change', function (e) {
      toggleSavingschemeCalcselect(e);
    });

    // attach a div where annual interest rates will be added dynamically
    $('#deposits-savingscheme-term').closest('div[class^="form-group"]').after('<div class="interestInput"></div>');

    // attach event handler for interest input fields
    $('#deposits-savingscheme-term').on('change', function (e) {
      toggleSavingschemeTerm(e);
    });

    // compile first interest input fields
    prepopulateSavingScheme();

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
    var disabledMap = [undefined,undefined,'#deposits-timedeposit-interestgain','#deposit-timedeposit-principal','#deposits-timedeposit-interest','#deposits-timedeposit-term'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }

  function toggleSavingschemeSelecttax(e){
    e.preventDefault();
    var state = $('#deposits-savingscheme-taxes').val();
    if (state === 'true'){
      $('#deposits-savingscheme-taxrate, #deposits-savingscheme-taxfree, #deposits-savingscheme-taxtime').closest('div[class^="form-group"]').removeClass('hide');
    } else if (state === 'false'){
      $('#deposits-savingscheme-taxrate, #deposits-savingscheme-taxfree, #deposits-savingscheme-taxtime').closest('div[class^="form-group"]').addClass('hide');
    }
  }

  function toggleSavingschemeCalcselect (e){
    e.preventDefault();

    var state = $('#deposits-savingscheme-calcselect').val();
    var disabledMap = [undefined,undefined,'#deposits-savingscheme-terminal','#deposits-savingscheme-principal'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }

  function toggleSavingschemeTerm(e){
    e.preventDefault();
    var state = parseInt($('#deposits-savingscheme-term').val());
    if (state !== 0){
      $('.interestInput').children().remove();
      for(var i = 0; i< state; i++){
        app.helpers.compileTemplate('.interestInput','#deposits-savingscheme-interestInput-template', {count: 'Zinssatz ' + String(i+1) + '. Jahr', id1: 'deposits-savingscheme-interest' + i}, true);
      }
    } else {
      $('.interestInput').children().remove();
    }
  }

  function prepopulateSavingScheme(){
    app.helpers.compileTemplate('.interestInput','#deposits-savingscheme-interestInput-template', {count: 'Zinssatz 1. Jahr', id1: 'deposits-savingscheme-interest0', val1: '1,25'}, true);
    app.helpers.compileTemplate('.interestInput','#deposits-savingscheme-interestInput-template', {count: 'Zinssatz 2. Jahr', id1: 'deposits-savingscheme-interest1', val1: '1,50'}, true);
    app.helpers.compileTemplate('.interestInput','#deposits-savingscheme-interestInput-template', {count: 'Zinssatz 3. Jahr', id1: 'deposits-savingscheme-interest2', val1: '1,75'}, true);
    app.helpers.compileTemplate('.interestInput','#deposits-savingscheme-interestInput-template', {count: 'Zinssatz 4. Jahr', id1: 'deposits-savingscheme-interest3', val1: '2,25'}, true);
    $('#deposits-savingscheme-term').val(4);
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