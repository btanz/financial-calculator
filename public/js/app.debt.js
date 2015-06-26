
app.debt = (function() {
  /*********************** BEGIN DEBT DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {

    // attach event handler for calculation selection mode
    $('#debt-annuity-select').on('change', function (e) {
      toggleAnnuitySelect(e);
    });

    // attach event handler for fees
    $('#debt-annuity-fees').on('change', function (e) {
      toggleInputsFees(e);
    });

    // attach event handler for disagio
    $('#debt-annuity-disagio').on('change', function (e) {
      toggleInputsDisagio(e);
    });

    // attach event handler for repaymentfree
    $('#debt-annuity-repaymentfree').on('change', function (e) {
      toggleInputsRepaymentfree(e);
    });

    // attach event handler for calculation selection mode
    $('#debt-dispo-periodchoice').on('change', function (e) {
      toggleDispoSelect(e);
    });

  });
  /*********************** END DEBT DOCUMENT READY TASKS *************************/

  /*********************** BEGIN DEBT EVENT HANDLERS ***********************/
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