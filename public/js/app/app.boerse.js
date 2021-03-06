
app.boerse = (function() {

  // set counter for positions in boerse-portfolio
  var positioncounter = 0;

  /*********************** BEGIN BOERSE DOCUMENT READY TASKS ***********************/
  $(document).ready(function () {

    /** boerse-equityreturn */
    // attach a div where dividend dates and amounts will be added dynamically
    $('#boerse-equityreturn-dividends').closest('div[class^="form-group"]').after('<div class="dividendsInput"></div>');

    // attach event handler for dividend input fields
    $('#boerse-equityreturn-dividends').on('change', toggleInputsDividends);

    // attach event handler for fee inputs
    $('#boerse-equityreturn-fees').on('change', toggleInputsFees);

    /** boerse-portfolio */
    // attach a div where stocks will be added dynamically
    $('#boerse-portfolio-to').closest('div[class^="form-group"]').after('<h3 style="margin-top: 25px; margin-bottom: 0px;">Portfoliozusammensetzung</h3><div class="hr-line-dashed"></div><div class="stocksInput"><div class="stockElems"></div><div class="addBtn"></div></div>');

    // initialize portfolio calculator inputs
    portfolioInit();

    // attach event handler for remove button
    $('.boerse-portfolio-remove').on('click', removeAsset);

    // attach event handler for add button
    $('#boerse-portfolio-add').on('click', addAsset);

    // attach event handler for assetclass selector
    $('.boerse-portfolio-assetclass').on('change', requestAssets);


  });
  /*********************** END BOERSE DOCUMENT READY TASKS *************************/

  /*********************** BEGIN BOERSE EVENT HANDLERS ***********************/


  /** boerse-portfolio */
  function portfolioInit(){
    /** set date to yesteray */
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
      dd='0'+dd
    }
    if(mm<10) {
      mm='0'+mm
    }
    today = dd + '.' + mm + '.' + yyyy;
    $('#boerse-portfolio-to').val(today);


    app.helpers.compileTemplate('.stockElems','#boerse-portfolio-stocksInput-template', {count: String(positioncounter + 1) + '. Position', id0: 'boerse-portfolio-assetclass' + positioncounter, id1: 'boerse-portfolio-stock' + positioncounter, id2: 'boerse-portfolio-remove' + positioncounter}, true);
    $('#boerse-portfolio-stock' + positioncounter + ' option[value="FSE.ADS_X"]').attr('selected', true);
    positioncounter += 1;

    app.helpers.compileTemplate('.stockElems','#boerse-portfolio-stocksInput-template', {count: String(positioncounter + 1) + '. Position', id0: 'boerse-portfolio-assetclass' + positioncounter, id1: 'boerse-portfolio-stock' + positioncounter, id2: 'boerse-portfolio-remove' + positioncounter}, true);
    $('#boerse-portfolio-stock' + positioncounter + ' option[value="FSE.BAS_X"]').attr('selected', true);
    positioncounter += 1;

    app.helpers.compileTemplate('.stockElems','#boerse-portfolio-stocksInput-template', {count: String(positioncounter + 1) + '. Position', id0: 'boerse-portfolio-assetclass' + positioncounter, id1: 'boerse-portfolio-stock' + positioncounter, id2: 'boerse-portfolio-remove' + positioncounter}, true);
    $('#boerse-portfolio-stock' + positioncounter + ' option[value="FSE.BMW_X"]').attr('selected', true);
    positioncounter += 1;

    app.helpers.compileTemplate('.stockElems','#boerse-portfolio-stocksInput-template', {count: String(positioncounter + 1) + '. Position', id0: 'boerse-portfolio-assetclass' + positioncounter, id1: 'boerse-portfolio-stock' + positioncounter, id2: 'boerse-portfolio-remove' + positioncounter}, true);
    $('#boerse-portfolio-stock' + positioncounter + ' option[value="FSE.BOSS_X"]').attr('selected', true);
    positioncounter += 1;

    app.helpers.compileTemplate('.stockElems','#boerse-portfolio-stocksInput-template', {count: String(positioncounter + 1) + '. Position', id0: 'boerse-portfolio-assetclass' + positioncounter, id1: 'boerse-portfolio-stock' + positioncounter, id2: 'boerse-portfolio-remove' + positioncounter}, true);
    $('#boerse-portfolio-stock' + positioncounter + ' option[value="FSE.FME_X"]').attr('selected', true);
    positioncounter += 1;

    app.helpers.compileTemplate('.stockElems','#boerse-portfolio-stocksInput-template', {count: String(positioncounter + 1) + '. Position', id0: 'boerse-portfolio-assetclass' + positioncounter, id1: 'boerse-portfolio-stock' + positioncounter, id2: 'boerse-portfolio-remove' + positioncounter}, true);
    $('#boerse-portfolio-stock' + positioncounter + ' option[value="FSE.SAP_X"]').attr('selected', true);
    positioncounter += 1;

    //app.helpers.compileTemplate('.stockElems','#boerse-portfolio-stocksInput-template', {count: String(positioncounter + 1) + '. Position', id0: 'boerse-portfolio-assetclass' + positioncounter, id1: 'boerse-portfolio-stock' + positioncounter, id2: 'boerse-portfolio-remove' + positioncounter}, true);
    //$('#boerse-portfolio-stock' + positioncounter + ' option[value="FSE.TKA_X"]').attr('selected', true);
    //positioncounter += 1;

    app.helpers.compileTemplate('.addBtn','#boerse-portfolio-stocksAddButton-template', {}, true);
    $('#boerse-portfolio-stock' + positioncounter + ' option[value="FSE.DBK_X"]').attr('selected', true);
  }

  function removeAsset(e){
    e.preventDefault();
    e.currentTarget.closest('div[class^="form-group"]').remove();
  }

  function addAsset(e){
    e.preventDefault();
    app.helpers.clearAllResultsTemplates();
    app.helpers.compileTemplate('.stockElems','#boerse-portfolio-stocksInput-template', {count: String(positioncounter + 1) + '. Position',  id0: 'boerse-portfolio-assetclass' + positioncounter, id1: 'boerse-portfolio-stock' + positioncounter, id2: 'boerse-portfolio-remove' + positioncounter}, true);
    positioncounter += 1;
    // attach handlers to new element
    $('.boerse-portfolio-assetclass').on('change', requestAssets);
    $('.boerse-portfolio-remove').on('click', removeAsset);
    $('input, select').on('keyup change', app.helpers.clearAllResultsTemplates);
  }


  function requestAssets(e){
    /** retrieve selected asset class */
    if (!e.currentTarget.value.length) return;
    var selectedOption = e.currentTarget.value;

    /** retrieve jQuery obj for asset selection / this is the target for the AJAX request */
    var selectAsset = e.currentTarget.parentNode.nextSibling.firstChild.id;
    selectAsset = $('#'+selectAsset);

    selectAsset.prop("disabled", true);

    /** run AJAX request */
    $.getJSON(window.location.origin + '/data/equity/ind?db=' + selectedOption)
        .done(function(data) {

          /** remove previous options */
          selectAsset.find('option').remove();

          /** attach new options */
          $.each(data, function(key, val){
            selectAsset.append($("<option></option>").attr("value",val.id).text(val.description));
          });

          selectAsset.prop("disabled", false);

        })
        .fail(function(e){
          console.log('Leider ist ein Fehler aufgetreten');
        });

  }




  /** boerse-equityreturn */
  function toggleInputsFees (e){
    e.preventDefault();
    var state = $('#boerse-equityreturn-fees').val();
    if (state === 'true'){
      $('#boerse-equityreturn-feebuy, #boerse-equityreturn-feesell').closest('div[class^="form-group"]').removeClass('hide')
    } else if (state === 'false'){
      $('#boerse-equityreturn-feebuy, #boerse-equityreturn-feesell').closest('div[class^="form-group"]').addClass('hide')
    }
  }

  function toggleInputsDividends(e){
    e.preventDefault();
    var state = parseInt($('#boerse-equityreturn-dividends').val());
    if (state !== 0){
      $('.dividendsInput').children().remove();
      for(var i = 0; i< state; i++){
        app.helpers.compileTemplate('.dividendsInput','#boerse-equityreturn-dividendsInput-template', {count: String(i+1) + '. Dividende', id1: 'boerse-equityreturn-dividendDate' + i, id2: 'boerse-equityreturn-dividendAmount'+i}, true);
      }
      // initialize datepicker
      $('.input-group.date').datepicker({
        language: 'de',
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
      });
    } else {
      $('.dividendsInput').children().remove();
    }
    /** add invalidation handler */
    $('input, select').on('keyup change', app.helpers.clearAllResultsTemplates);
  }


  /*********************** END BOERSE EVENT HANDLERS ***********************/

  /** return empty object we can attach to */
  return {};

})();