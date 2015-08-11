var Promise = require('bluebird');
var _ = require('underscore');
var request = require([__dirname, "request"].join("/"));
var configuration = require([__dirname, "config"].join("/"));

/*********** I. Constructor function */
function Quandl(dataset, multipleDatasets){
  this.data = dataset;
  this.multipleDatasets = multipleDatasets;
}

/*********** II. Methods */
/** return raw response from Quandl */
Quandl.prototype.rawResponse = function(){
  return this.data;
};

/** return remaining Quandl rate limit */
Quandl.prototype.dailyRemainingRateLimit = function(){
  return this.data.headers['x-ratelimit-remaining'];
};

/** return raw dataset from Quandl */
Quandl.prototype.rawDataset = function(){
  return JSON.parse(this.data.body).dataset;
};

/** return Quandl datacode = (database_code).(dataset_code) */
Quandl.prototype.dataCode = function(){
  return String(this.rawDataset().database_code + '.' + this.rawDataset().dataset_code);
};

/** return Quandl name of requested asset */
Quandl.prototype.dataName = function(){
  return this.rawDataset().name;
};

/** return Quandl newest and oldest available date */
Quandl.prototype.availability = function(){
  return [this.rawDataset().oldest_available_date, this.rawDataset().newest_available_date];
};

/** return dataset from Quandl */
Quandl.prototype.dataset = function(){
  return this.rawDataset().data;
};

/** return specified column of dataset; default is the first column after data */
Quandl.prototype.datasetColumn = function(col){
  typeof col === 'undefined' ? col = 1 : col = col;
  return _.map(this.rawDataset().data, function(val){
    return val[col];
  });

};

/** return dataset column names */
Quandl.prototype.columns = function(){
  return this.rawDataset().column_names;
};






/*********** III. Expose require method; return result promise */
module.exports = function(code, options){
  /** set defaults and check whether request is for more than one dataset */
  options = options || {};
  var multipleDatasets = (Array.isArray(code));
  var processedData = [];
  var requests = [];
  var config;

  /** set configs and authentication */
  var format = options.format || configuration.default_format;
  delete options.format;

  var qs = options;
  qs.auth_token = configuration.api_key;

  config = {
    uri: ['api', configuration.default_api, 'datasets', code.source, code.table].join('/'),
    format: format,
    qs: qs
  };


  if(multipleDatasets){
    for(var i = 0; i < code.length; i++){
      config = {
        uri: ['api', configuration.default_api, 'datasets', code[i].source, code[i].table].join('/'),
        format: format,
        qs: qs
      };
      console.log(config.uri);

      requests.push(request.create(config));
    }

    return Promise.all(requests).then(function(data){
      console.log(data);
      return new Quandl(data, multipleDatasets);
    });


  } else {

    /** return request */
    return request.create(config).then(function(data){
      console.log(data);
      return new Quandl(data[0], multipleDatasets);
    });
  }

};

