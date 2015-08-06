var Promise = require('bluebird');
//var request = Promise.promisify(require('request'));
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

  }

};