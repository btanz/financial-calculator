
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


  });
  /*********************** END DEPOSITS DOCUMENT READY TASKS *************************/

  /*********************** BEGIN DEPOSITS EVENT HANDLERS ***********************/
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