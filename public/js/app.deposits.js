
app.deposits = (function() {
  /*********************** BEGIN DEPOSITS DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {
    // todo: abstract and shorten code, especially make it calculation-indepedent
    // attach event handler for calculation selection mode
    $('#deposits-interest-select').on('change', toggleInterestSelect);

    $('#deposits-savings-select').on('change', toggleSavingsSelect);

    $('#deposits-timedeposit-taxes').on('change', toggleTimedepositSelecttax);

    $('#deposits-timedeposit-calcselect').on('change', toggleTimedepositCalcselect);

    $('#deposits-savingscheme-taxes').on('change', toggleSavingschemeSelecttax);

    $('#deposits-savingscheme-calcselect').on('change', toggleSavingschemeCalcselect);

    // attach a div where annual interest rates will be added dynamically
    $('#deposits-savingscheme-term').closest('div[class^="form-group"]').after('<div class="interestInput"></div>');

    // attach event handler for interest input fields
    $('#deposits-savingscheme-term').on('change', toggleSavingschemeTerm);

    // attach event handler for overnight calculation selection
    $('#deposits-overnight-calcselect').on('change', toggleOvernightCalcselect);

    // attach event handler for overnight interest type
    $('#deposits-overnight-interesttype').on('change', toggleOvernightInteresttype);

    // attach a div where specialinterest amounts and rates will be added dynamically for overnight
    $('#deposits-overnight-specialinterestpositions').closest('div[class^="form-group"]').after('<div class="interesttypeInput"></div>');

    // attach event handler for overnight specialinterest input fields
    $('#deposits-overnight-specialinterestpositions').on('change', toggleOvernightInputsSpecialinterestpositions);

    // attach event handler for overnight periodselect
    $('#deposits-overnight-periodselect').on('change', toggleOvernightSelectperiod);

    // attach event handler for overnight taxes
    $('#deposits-overnight-taxes').on('change', toggleOvernightSelecttax);

    // compile first interest input fields
    prepopulateSavingScheme();

  });
  /*********************** END DEPOSITS DOCUMENT READY TASKS *************************/

  /*********************** BEGIN DEPOSITS EVENT HANDLERS ***********************/

  function toggleOvernightCalcselect (e){
    e.preventDefault();

    var state = $('#deposits-overnight-calcselect').val();
    var disabledMap = [undefined,'#deposits-overnight-interestgain','#deposits-overnight-principal','#deposits-overnight-interest','#deposits-overnight-interestdays'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }

  function toggleOvernightInteresttype (e){
    e.preventDefault();
    var elem = $('#deposits-overnight-specialinterestpositions');
    var state = $('#deposits-overnight-interesttype').val();
    if (state === 'true'){
      elem.closest('div[class^="form-group"]').removeClass('hide');
      elem.val(3);  // todo: trigger calcs
      elem.trigger('change');
      $('#deposits-overnight-interest').closest('div[class^="form-group"]').addClass('hide');
    } else if (state === 'false'){
      elem.closest('div[class^="form-group"]').addClass('hide');
      $('.interesttypeInput').children().remove();
      elem.val(0);
      $('#deposits-overnight-interest').closest('div[class^="form-group"]').removeClass('hide');
    }
  }

  function toggleOvernightInputsSpecialinterestpositions(e){
    e.preventDefault();
    var state = parseInt($('#deposits-overnight-specialinterestpositions').val());
    var first = false;
    if (state !== 0){
      $('.interesttypeInput').children().remove();
      for(var i = 0; i< state; i++){
        if (i === 0) {first = true} else {first = false};
        app.helpers.compileTemplate('.interesttypeInput','#deposits-overnight-interesttypeInput-template', {count: String(i+1) + '. Staffel', id1: 'deposits-overnight-specialinterestthreshold' + i, id2: 'deposits-overnight-specialinterest'+i, amount: 1000 * i, interest: (i/4) + 0.5, first: first}, true);
      }
    } else {
      $('.interesttypeInput').children().remove();
    }
  }

  function toggleOvernightSelecttax(e){
    e.preventDefault();
    var state = $('#deposits-overnight-taxes').val();
    if (state === 'true'){
      $('#deposits-overnight-taxrate, #deposits-overnight-taxfree').closest('div[class^="form-group"]').removeClass('hide');
    } else if (state === 'false'){
      $('#deposits-overnight-taxrate, #deposits-overnight-taxfree').closest('div[class^="form-group"]').addClass('hide');
    }
  }


  function toggleOvernightSelectperiod(e){
    e.preventDefault();
    var state = $('#deposits-overnight-periodselect').val();
    if (state === 'true'){
      $('#deposits-overnight-begindate, #deposits-overnight-enddate').closest('div[class^="form-group"]').removeClass('hide');
      $('#deposits-overnight-interestdays').closest('div[class^="form-group"]').addClass('hide');
    } else if (state === 'false'){
      $('#deposits-overnight-begindate, #deposits-overnight-enddate').closest('div[class^="form-group"]').addClass('hide');
      $('#deposits-overnight-interestdays').closest('div[class^="form-group"]').removeClass('hide');
    }
  }


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
    app.helpers.compileTemplate('.interestInput','#deposits-savingscheme-interestInput-template', {count: 'Zinssatz 5. Jahr', id1: 'deposits-savingscheme-interest4', val1: '2,75'}, true);
    app.helpers.compileTemplate('.interestInput','#deposits-savingscheme-interestInput-template', {count: 'Zinssatz 6. Jahr', id1: 'deposits-savingscheme-interest5', val1: '3,25'}, true);
    $('#deposits-savingscheme-term').val(6);
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