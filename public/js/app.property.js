app.property = (function() {
  /*********************** BEGIN PROPERTY DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {


    // attach event handler for fee inputs
    $('#property-buyrent-dynamics').on('change', function (e) {
      toggleInputsDynamics(e);
    });

    // attach event handler for rent calc choice
    $('#property-rent-select').on('change', function (e) {
      toggleRentSelect(e);
    });

    // attach event handler for homesave "Wohnungsbauprämie" choice
    $('#property-homesave-bonus').on('change', function (e) {
      toggleHomeSaveSelect(e);
    });


  });
  /*********************** END PROPERTY DOCUMENT READY TASKS *************************/

  /*********************** BEGIN PROPERTY EVENT HANDLERS ***********************/
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

  /*********************** END PROPERTY EVENT HANDLERS ***********************/

})();