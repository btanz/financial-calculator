var Promise = require('bluebird');
var _ = require('underscore');
var request = require([__dirname, "request"].join("/"));
var configuration = require([__dirname, "config"].join("/"));




module.exports = {


  /**
   * getData
   *
   * method to retrieve datasets from the Quandl API
   *
   * @param code {object} An object containing source (database) and table (dataset) for the data request
   *                      example: {source: 'FSE', table: 'BAYN_X'}
   * @param options {object} An object of quandl API options
   *                      Example:
   *                        {format: 'json', sort_order: 'asc', rows: 20, trim_start='2008-01-30', trim_end='2012-01-30', column=3, collapse: 'weekly', transformation: 'rdiff'}
   *                      See also https://www.quandl.com/help/api for documentation
   *
   * @returns {Promise} Returns a promise that contains the data if request was succesful
   */
  getData: function(code, options){
    options = options || {};

    var format = options.format || configuration.default_format;
    delete options.format;

    var qs = options;
    qs.auth_token = configuration.api_key;

    var config = {
      uri: ['api', configuration.default_api, 'datasets', code.source, code.table].join('/'),
      format: format,
      qs: qs
    };

    return request.create(config);

  },



  /**
   * getMultiData
   *
   * method to retrieve multiple datasets in parallel from the Quandl API
   *
   * @param codes {array} An array of objects containing sources (database) and tables (dataset) for the data request
   *                      Example: [{source: 'FSE', table: 'BAYN_X'},{source: 'FSE', table: 'BMW_X'}]
   * @param options {object} An object of quandl API options
   *                      Example:
   *                        {format: 'json', sort_order: 'asc', rows: 20, trim_start='2008-01-30', trim_end='2012-01-30', column=3, collapse: 'weekly', transformation: 'rdiff'}
   *                      See also https://www.quandl.com/help/api for documentation
   *
   * @returns {Promise} Returns a promise that contains the data if request was successful; the Promise returns an array of data objects that in turn contain the individual data
   */
  getMultiData: function(codes, options){

    var processedData = [];
    var requests = [];


    function processData (data){

      data.forEach(function(element){
        var response =  JSON.parse(element[0].body);
        processedData.push({qsymbol: response.dataset.database_code + '.' + response.dataset.dataset_code, data: response.dataset.data});
      });

    }



    for(var i = 0; i < codes.length; i++){
      requests.push(this.getData(codes[i], options));
    }

    return Promise.all(requests).then(processData).then(function(){
      return processedData;
    });

  }


};


