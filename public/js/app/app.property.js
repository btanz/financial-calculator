app.property = (function() {
  /*********************** BEGIN PROPERTY DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {


    // attach event handler for fee inputs
    $('#property-buyrent-dynamics').on('change', toggleInputsDynamics);

    // attach event handler for rent calc choice
    $('#property-rent-select').on('change', toggleRentSelect);

    // attach event handler for homesave "Wohnungsbauprämie" choice
    $('#property-homesave-bonus').on('change', toggleHomeSaveSelect);

    // attach event handler for propertyprice "Immobilienpreisrechner" choice
    $('#property-propertyprice-selection').on('change', togglePropertyPriceSelect);


    // attach event handler for mortgage calc choice 1
    $('#property-mortgage-select1').on('change', toggleMortgageSelect1);

    // attach event handler for mortgage calc choice 2
    $('#property-mortgage-select2').on('change', toggleMortgageSelect2);

    // attach event handler for fees
    $('#property-mortgage-fees').on('change', toggleMortgageInputsFees);

    // attach event handler for disagio
    $('#property-mortgage-disagio').on('change', toggleMortgageInputsDisagio);

    // attach event handler for repaymentfree
    $('#property-mortgage-repaymentfree').on('change', toggleMortgageInputsRepaymentfree);

    // attach event handler for followup
    $('#property-mortgage-followup').on('change', toggleMortgageInputsFollowup);

    // attach event handler for specialrepay
    $('#property-mortgage-specialrepay').on('change', toggleMortgageInputsSpecialrepay);

    // attach a div where specialrepay times and amounts will be added dynamically
    $('#property-mortgage-specialrepaypositions').closest('div[class^="form-group"]').after('<div class="specialrepayInput"></div>');

    // attach event handler for specialrepaypositions input fields
    $('#property-mortgage-specialrepaypositions').on('change', toggleMortgageInputsSpecialrepaypositions);


  });
  /*********************** END PROPERTY DOCUMENT READY TASKS *************************/

  /*********************** BEGIN PROPERTY EVENT HANDLERS ***********************/
  function toggleMortgageSelect1(e){
    e.preventDefault();
    var state = $('#property-mortgage-select1').val();

    var disabledMap = [undefined, '#property-mortgage-repay', '#property-mortgage-principal', '#property-mortgage-interest', '#property-mortgage-initialinterest'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }

  function toggleMortgageSelect2(e){
    e.preventDefault();
    var state = $('#property-mortgage-select2').val();

    var disabledMap = [undefined, '#property-mortgage-residual', '#property-mortgage-term', '#property-mortgage-annualrepay'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }


  function toggleMortgageInputsFees (e){
    e.preventDefault();
    var state = $('#property-mortgage-fees').val();
    if (state === 'true'){
      $('#property-mortgage-feeamount, #property-mortgage-feetype').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#property-mortgage-feeamount, #property-mortgage-feetype').closest('div[class^="form-group"]').addClass('hide')
    }
  }


  function toggleMortgageInputsDisagio (e){
    e.preventDefault();
    var state = $('#property-mortgage-disagio').val();
    if (state === 'true'){
      $('#property-mortgage-disagioamount').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#property-mortgage-disagioamount').closest('div[class^="form-group"]').addClass('hide')
    }
  }

  function toggleMortgageInputsFollowup (e){
    e.preventDefault();
    var state = $('#property-mortgage-followup').val();
    if (state === 'true'){
      $('#property-mortgage-followupinterest').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#property-mortgage-followupinterest').closest('div[class^="form-group"]').addClass('hide')
    }
  }

  function toggleMortgageInputsRepaymentfree (e){
    e.preventDefault();
    var state = $('#property-mortgage-repaymentfree').val();
    if (state === 'true'){
      $('#property-mortgage-repaymentfreeterm, #property-mortgage-repaymentfreetype').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#property-mortgage-repaymentfreeterm, #property-mortgage-repaymentfreetype').closest('div[class^="form-group"]').addClass('hide')
    }
  }

  function toggleMortgageInputsSpecialrepay (e){
    e.preventDefault();
    var state = $('#property-mortgage-specialrepay').val();
    if (state === 'true'){
      $('#property-mortgage-specialrepaypositions').closest('div[class^="form-group"]').removeClass('hide');
    } else if (state === 'false'){
      $('#property-mortgage-specialrepaypositions').closest('div[class^="form-group"]').addClass('hide');
      $('.specialrepayInput').children().remove();
      $('#property-mortgage-specialrepaypositions').val(0);
    }
  }


  function toggleMortgageInputsSpecialrepaypositions(e){
    e.preventDefault();
    var state = parseInt($('#property-mortgage-specialrepaypositions').val());
    var first = false;
    if (state !== 0){
      $('.specialrepayInput').children().remove();
      for(var i = 0; i< state; i++){
        if (i === 0) {first = true} else {first = false};
        app.helpers.compileTemplate('.specialrepayInput','#property-mortgage-specialrepayInput-template', {count: String(i+1) + '. Tilgung', id1: 'property-mortgage-specialrepaymonths' + i, id2: 'property-mortgage-specialrepayamount'+i, first: first}, true);
      }
    } else {
      $('.specialrepayInput').children().remove();
    }
  }


  function toggleInputsDynamics(e){
    e.preventDefault();
    var state = $('#property-buyrent-dynamics').val();
    if (state === 'true'){
      $('#property-buyrent-incomedynamic, #property-buyrent-rentdynamic, #property-buyrent-valuedynamic, #property-buyrent-costdynamic').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#property-buyrent-incomedynamic, #property-buyrent-rentdynamic, #property-buyrent-valuedynamic, #property-buyrent-costdynamic').closest('div[class^="form-group"]').addClass('hide')
    }
  }


  function toggleRentSelect(e){
    e.preventDefault();
    var state = $('#property-rent-select').val();

    var disabledMap = ['#property-rent-renttotal', '#property-rent-dynamic', '#property-rent-term', '#property-rent-rent'];

    disabledMap.forEach(function(ind, value){
      $(ind).prop("disabled", false);
      if (Number(value) === Number(state)){
        $(ind).prop("disabled", true);
        $(ind).val('');
      }
    });
  }


  function toggleHomeSaveSelect(e){
    e.preventDefault();
    var state = $('#property-homesave-bonus').val();
    if (state === 'true'){
      $('#property-homesave-marriage, #property-homesave-income').closest('div[class^="form-group"]').removeClass('hide');
    } else if (state === 'false'){
      $('#property-homesave-marriage, #property-homesave-income').closest('div[class^="form-group"]').addClass('hide');
    }
  }


  function togglePropertyPriceSelect(e){
    e.preventDefault();
    var state = $('#property-propertyprice-selection').val();
    if (state === '2'){
      $('#property-propertyprice-initrepay').closest('div[class^="form-group"]').removeClass('hide');
      $('#property-propertyprice-term').closest('div[class^="form-group"]').addClass('hide');
    } else if (state === '3'){
      $('#property-propertyprice-initrepay').closest('div[class^="form-group"]').addClass('hide');
      $('#property-propertyprice-term').closest('div[class^="form-group"]').removeClass('hide');
    }
  }

  /*********************** END PROPERTY EVENT HANDLERS ***********************/

})();