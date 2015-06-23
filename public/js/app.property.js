app.property = (function() {
  /*********************** BEGIN PROPERTY DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {


    // attach event handler for fee inputs
    $('#property-buyrent-dynamics').on('change', function (e) {
      toggleInputsDynamics(e);
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



  /*********************** END PROPERTY EVENT HANDLERS ***********************/

})();