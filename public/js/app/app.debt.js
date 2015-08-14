
app.debt = (function() {
  /*********************** BEGIN DEBT DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {

    // attach event handler for calculation selection mode
    $('#debt-annuity-select').on('change', toggleAnnuitySelect);

    // attach event handler for fees
    $('#debt-annuity-fees').on('change', toggleInputsFees);

    // attach event handler for disagio
    $('#debt-annuity-disagio').on('change', toggleInputsDisagio);

    // attach event handler for repaymentfree
    $('#debt-annuity-repaymentfree').on('change', toggleInputsRepaymentfree);

    // attach event handler for calculation selection mode
    $('#debt-dispo-periodchoice').on('change', toggleDispoSelect);


    // attach event handler for repaysurrogat selection
    $('#debt-repaysurrogat-selection').on('change', toggleInputsRepaysurrogat);

    // attach event handler for repaysurrogat tax
    $('#debt-repaysurrogat-taxes').on('change', toggleInputsRepaysurrogatTaxes);

  });
  /*********************** END DEBT DOCUMENT READY TASKS *************************/

  /*********************** BEGIN DEBT EVENT HANDLERS ***********************/
  function toggleInputsRepaysurrogat (e){
    e.preventDefault();
    var state = $('#debt-repaysurrogat-selection').val();
    if (state === "2"){
      $('#debt-repaysurrogat-initrepay').closest('div[class^="form-group"]').removeClass('hide');
      $('#debt-repaysurrogat-term, #debt-repaysurrogat-repay').closest('div[class^="form-group"]').addClass('hide');
    } else if (state === "3"){
      $('#debt-repaysurrogat-term').closest('div[class^="form-group"]').removeClass('hide');
      $('#debt-repaysurrogat-initrepay, #debt-repaysurrogat-repay').closest('div[class^="form-group"]').addClass('hide');
    } else if (state === "4"){
      $('#debt-repaysurrogat-repay').closest('div[class^="form-group"]').removeClass('hide');
      $('#debt-repaysurrogat-initrepay, #debt-repaysurrogat-term').closest('div[class^="form-group"]').addClass('hide');
    }
  }

  function toggleInputsRepaysurrogatTaxes (e){
    e.preventDefault();
    var state = $('#debt-repaysurrogat-taxes').val();
    if (state === 'true'){
      $('#debt-repaysurrogat-taxrate, #debt-repaysurrogat-taxfree, #debt-repaysurrogat-taxtime').closest('div[class^="form-group"]').removeClass('hide');
    } else if (state === 'false'){
      $('#debt-repaysurrogat-taxrate, #debt-repaysurrogat-taxfree, #debt-repaysurrogat-taxtime').closest('div[class^="form-group"]').addClass('hide');
    }
  }



  function toggleAnnuitySelect (e){
    e.preventDefault();

    var state = $('#debt-annuity-select').val();
    var disabledMap = ['#debt-annuity-repay','#debt-annuity-residual','#debt-annuity-term','#debt-annuity-rate','#debt-annuity-principal'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }


  function toggleInputsFees (e){
    e.preventDefault();
    var state = $('#debt-annuity-fees').val();
    if (state === 'true'){
      $('#debt-annuity-feeamount, #debt-annuity-feetype').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#debt-annuity-feeamount, #debt-annuity-feetype').closest('div[class^="form-group"]').addClass('hide')
    }
  }


  function toggleInputsDisagio (e){
    e.preventDefault();
    var state = $('#debt-annuity-disagio').val();
    if (state === 'true'){
      $('#debt-annuity-disagioamount').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#debt-annuity-disagioamount').closest('div[class^="form-group"]').addClass('hide')
    }
  }


  function toggleInputsRepaymentfree (e){
    e.preventDefault();
    var state = $('#debt-annuity-repaymentfree').val();
    if (state === 'true'){
      $('#debt-annuity-repaymentfreeterm, #debt-annuity-repaymentfreetype').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#debt-annuity-repaymentfreeterm, #debt-annuity-repaymentfreetype').closest('div[class^="form-group"]').addClass('hide')
    }
  }

  function toggleDispoSelect(e){
    e.preventDefault();
    var state = $('#debt-dispo-periodchoice').val();
    if (state === 'days'){
      $('#debt-dispo-days').closest('div[class^="form-group"]').removeClass('hide');
      $('#debt-dispo-startdate, #debt-dispo-enddate').closest('div[class^="form-group"]').addClass('hide');
      $('#debt-dispo-daycount option[value="actact"]').remove();
    } else if (state === 'dates'){
      $('#debt-dispo-days').closest('div[class^="form-group"]').addClass('hide');
      $('#debt-dispo-startdate, #debt-dispo-enddate').closest('div[class^="form-group"]').removeClass('hide');
      $('#debt-dispo-daycount').append('<option value="actact">act / act, Taggenaue Methode</option>');
    }

  }

  /*********************** END DEBT EVENT HANDLERS ***********************/

})();