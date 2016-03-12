var Promise = require('bluebird');
var _ = require('underscore');
var request = require([__dirname, "request"].join("/"));
var configuration = require([__dirname, "config"].join("/"));
var keys = require('../../keys/keys');

// todo: layer that removes responses that contain no data (such as Telefonica@FSE)

/*********** I. CONSTRUCTOR FUNCTION *********************************/
function Quandl(dataset, multipleDatasets){
  this.data = dataset;
  this.multipleDatasets = multipleDatasets;
  this.numberOfDatasets = (this.multipleDatasets) ? this.data.length : 1;
}


/*********** II. METHODS **********************************************/
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
 * If options.noDatabase is true, the source database will not be attached (i.e. "ADS_X" instead of "FSE.ADS_X"
 * If options.noUnderscore is true, underscore and following elements will be replaced (i.e. "ADS" instead of "ADS_X"
 *
 * @returns {Array}
 */
Quandl.prototype.dataCodes = function(options){
  options = options || {};
  options.noDatabase   = options.noDatabase || false;
  options.noUnderscore = options.noUnderscore || false;
  var result = [];
  this.rawDatasets().forEach(function(val){
    if(options.noDatabase){
      options.noUnderscore ? result.push(String(val.dataset_code.replace(/\_.*$/,""))) : result.push(String(val.dataset_code));
    } else {
      options.noUnderscore ? result.push(String(val.database_code + '.' + val.dataset_code.replace(/\_.*$/,""))) : result.push(String(val.database_code + '.' + val.dataset_code));
    }
  });

  return result;
};



/**
 * Returns an array of the names of all requested assets
 *
 * If
 *    options.removeParentheses is true, all content in parentheses is removed, that is,
 *     'Bmw AG St (BMW_X)' becomes 'Bmw AG St'
 *
 *     options.trimParentheses is true, all content after a parenthesis is removed
 *
 * @returns {Array}
 */
Quandl.prototype.dataNames = function(options){
  options = options || {};
  options.removeParentheses = options.removeParentheses || false;
  options.trimParentheses   = options.trimParentheses || false;
  var result = [];
  var helper;
  var matchParentheses = /\([^)]*\)/g;
  this.rawDatasets().forEach(function(val){
    if(options.trimParentheses){
      helper = val.name;
      helper = helper.substring(0, helper.indexOf('('));
      result.push(helper);
    } else if (options.removeParentheses){
      result.push(val.name.replace(matchParentheses,'').trim());

      /*if(options.trimComma){
        console.log(val.name);
        helper = val.name;
        console.log(helper.substring(0, helper.indexOf(',')));

        result.push(helper.replace(matchParentheses,'').trim());
      } else {

      }*/
    } else {
      result.push(val.name);
    }

  });
  return result;
};

/** return Quandl newest and oldest available date */
/**
 * Returns an array of arrays of the newest and oldest available date
 * for all requested assets, where the inner array contains the
 * oldest and newest date [oldestAvailableDate, newestAvailableDate]
 *
 * See method availabilityIntersection for the newest and oldest date for
 * the (actual) intersection of all dates across assets
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

/** return Quandl oldest and newest available date from the date intersection */
/**
 * Returns an array of the newest and oldest available date
 * for the actual interesection of dates for all requested assets
 *
 *
 * @returns {Array}  [oldestAvailableDate, newestAvailableDate]
 */
Quandl.prototype.availabilityIntersection = function(){
  var result = [],
      helper = [],
      allDates = this.dateIntersection();

  function convertDate(rawDate){
    rawDate = new Date(rawDate);
    var dd = rawDate.getDate();
    var mm = rawDate.getMonth()+1; //January is 0!
    var yyyy = rawDate.getFullYear();
    if(dd<10) {
      dd='0'+dd
    }
    if(mm<10) {
      mm='0'+mm
    }
    return yyyy + '-' + mm + '-' + dd;
  }

  allDates.forEach(function(val){
    helper.push(Date.parse(val));
  });

  result[0] = convertDate(Math.min.apply( Math, helper));
  result[1] = convertDate(Math.max.apply( Math, helper));

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


/**
 * Returns the intersections (array) of all dates in a dataset (with multiple assets), that is,
 * the returned array contains the set of dates which is common across datasets
 *
 * @param options
 */
Quandl.prototype.dateIntersection = function(){
  var obsDates = [],
      helper = [],
      data = this.datasets();

  for(var i = 0; i < data.length; i++){
    for(var j = 0; j < data[i].length; j++) {
      helper.push(data[i][j][0]);
    }
    obsDates.push(helper);
    helper = [];
  }
  obsDates =  _.intersection.apply(_, obsDates);

  return obsDates;

};


/**
 * Returns the observations only for the dates that are common across assets.
 * By default returns the following format (example with 2 assets and 4 periods:
 *    [[r_00, r_01, r_02, r_03, r_04],
 *     [r_10, r_11, r_12, r_13, r_14]],
 *     with r_it (i..asset, t..time) and t identical across assets
 *
 *     If options.transposed is true, a transpose of the above array/matrix is returned
 *
 */
Quandl.prototype.datasetCommonDates = function(options){
  options = options || {};
  options.transposed = options.transposed || false;

  var obsDates = this.dateIntersection(),
      data = this.datasets(),
      dataset = [];

  obsDates.forEach(function(date, dateIndex){
    dataset[dateIndex] = [];
    data.forEach(function(asset){
      asset.forEach(function(obs){
        if(obs[0] === date){
          dataset[dateIndex].push(obs[1]);
        }
      });
    });
  });

  if(options.transposed){
    return dataset;
  } else {
    return dataset[0].map(function(col,i){
      return dataset.map(function(row){
        return row[i];
      })
    })
  }

};



/*********** III. EXPOSE REQUIRE METHODS; RETURN RESULTS PROMISE *********************************/
module.exports = function(code, options){
  /** set defaults and check whether request is for more than one dataset */
  options = options || {};
  var multipleDatasets = (Array.isArray(code));
  var requests = [];
  var config;

  /** set configs and authentication */
  var format = options.format || configuration.default_format;
  delete options.format;

  var qs = options;
  qs.auth_token = keys.quandlApiKey;

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

