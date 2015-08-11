var Promise = require('bluebird');
var _ = require('underscore');
var request = require([__dirname, "request"].join("/"));
var configuration = require([__dirname, "config"].join("/"));

/*********** I. Constructor function *********************************/
function Quandl(dataset, multipleDatasets){
  this.data = dataset;
  this.multipleDatasets = multipleDatasets;
  this.numberOfDatasets = (this.multipleDatasets) ? this.data.length : 1;
}


/*********** II. Methods **********************************************/
/**
 * Returns the raw unprocessed and unparsed response incl. headers etc from Quandl
 *
 * @returns {*}
 */
Quandl.prototype.rawResponse = function(){
  return this.data;
};


/**
 * Returns the remaining daily Quandl rate limit
 *
 * @returns {*}
 */
Quandl.prototype.dailyRemainingRateLimit = function(){
  if(this.multipleDatasets){
    return this.data[this.numberOfDatasets-1][0].headers['x-ratelimit-remaining'];
  } else {
    return this.data.headers['x-ratelimit-remaining'];
  }
};


/**
 * Returns an array of objects, where each object represents a raw but parsed
 * Quandl dataset (incl. dataset meta-information)
 *
 * @returns {*}
 */
Quandl.prototype.rawDatasets = function(){
  var result = [];
  if(this.multipleDatasets) {
    for (var i = 0; i < this.numberOfDatasets; i++){
      result.push(JSON.parse(this.data[i][0].body).dataset)
    }
    return result;
  } else {
    return [JSON.parse(this.data.body).dataset];
  }
};



/**
 * Returns an array of the  Quandl datacodes [= (database_code).(dataset_code)] of
 * all requested assets
 *
 * @returns {Array}
 */
Quandl.prototype.dataCodes = function(){
  var result = [];
  this.rawDatasets().forEach(function(val){
    result.push(String(val.database_code + '.' + val.dataset_code));

  });
  return result;
};



/**
 * Returns an array of the names of all requested assets
 *
 * @returns {Array}
 */
Quandl.prototype.dataNames = function(){
  var result = [];
  this.rawDatasets().forEach(function(val){
    result.push(val.name);

  });
  return result;
};

/** return Quandl newest and oldest available date */
/**
 * Returns an array of arrays of the newest and oldest available date
 * for all requested assets, where the inner array contains the
 * oldest and newest date [oldestAvailableDate, newestAvailableDate]
 *
 * @returns {Array}
 */
Quandl.prototype.availability = function(){
  var result = [];
  this.rawDatasets().forEach(function(val){
    result.push([val.oldest_available_date, val.newest_available_date]);

  });
  return result;
};


/**
 * Function to return (an array of) dataset(s) from Quandl
 *
 * By default, it returns an array of arrays of arrays, where the inner array contains a date and
 * data for a given asset at a given date, such as [ '2015-07-13', 0.024858757062147 ]; the middle
 * array contains this arrays for a given asset and all requested times; the outer array contains the
 * data for all requested assets;
 * If options.dataCode is true, the innermost array also contains a code for data identification, such
 * as [ 'FSE.BAYN_X', '2015-07-13', 0.024858757062147 ]
 *
 * @param options
 * @returns {Array}
 */
Quandl.prototype.datasets = function(options){
  options = options || {};
  options.dataCode = options.dataCode || false;
  var result = [],
      helper = [];

  if(options.dataCode){
    this.rawDatasets().forEach(function(val){
      val.data.forEach(function(entry){
        entry.unshift(String(val.database_code + '.' + val.dataset_code));
        helper.push(entry);
      });
      result.push(helper);
      helper = [];
    });
  } else {
    this.rawDatasets().forEach(function(val){
      result.push(val.data);
    })
  }

  return result;

};


/**
 * Returns names of data columns from request
 *
 * @returns {*}
 */
Quandl.prototype.columns = function(){
  return this.rawDatasets()[0].column_names;
};


/** return specified column of dataset; default is the first column after data */
/**
 * Returns an array of arrays, where by default the inner array contains all time series
 * observations for a single asset and the outer array contains all assets;
 * Example (2 assets and 4 periods):
 *    [[r_00, r_01, r_02, r_03, r_04],
 *     [r_10, r_11, r_12, r_13, r_14]],
 *     with r_it (i..asset, t..time)
 *     (note: time need not be identical across assets)
 *
 * If options.transposed is true, a transpose of the above array/matrix is returned
 *
 * @param col
 * @returns {Array}
 */
Quandl.prototype.datasetColumn = function(col, options){
  typeof col === 'undefined' ? col = 1 : col = col;
  options = options || {};
  options.transposed = options.transposed || false;

  var result = [],
      helper = [];
  this.rawDatasets().forEach(function(val){
    val.data.forEach(function(entry){
      helper.push(entry[col]);
    });
    result.push(helper);
    helper = [];
  });

  if(options.transposed){
    return result[0].map(function(col,i){
      return result.map(function(row){
        return row[i];
      })
    })
  } else {
    return result;
  }
};





/*********** III. Expose require method; return result promise *********************************/
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
    format: format,
    qs: qs
  };

  /** return (promise on) all finished (parallel) requests in case of multiple datasets */
  if(multipleDatasets){
    for(var i = 0; i < code.length; i++){
      config.uri = ['api', configuration.default_api, 'datasets', code[i].source, code[i].table].join('/');
      requests.push(request.create(config));
    }

    return Promise.all(requests).then(function(data){
      return new Quandl(data, multipleDatasets);
    });

  /** return (promise on) single requests in case of single datasets */
  } else {

    config.uri = ['api', configuration.default_api, 'datasets', code.source, code.table].join('/');
    /** return request */
    return request.create(config).then(function(data){
      return new Quandl(data[0], multipleDatasets);
    });
  }

};

