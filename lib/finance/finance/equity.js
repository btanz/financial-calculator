/**
 * annuity.js
 * Copyright 2015 Benjamin Tanz
 *
 * methods for equity calculations
 *
 */
var _ = require('underscore');
var stats = require('jStat').jStat;
var basic = require('./basic');


"use strict";
var equity = exports;


/**
 * portfolioPrice
 *
 * Function that computes the series of portfolio prices given a set of portfolio weights
 *
 * If options.equalWeight is true, the price series of a porfolio with equally-weighted assets
 * is returned (default is false)
 *
 * @param prices {array of arrays} Prices of individual assets; example: [[2,3,4],[5,3,2]]
 * @param weights {array} Portfolio weights; example: [0.2, 0.8]
 * @param options {object} Options object
 * @returns {array} series of portfolio prices
 */
equity.portfolioPrice = function(prices, weights, options){
  /** set defaults */
  options = options || {};
  options.equalWeight = options.equalWeight || false;
  var results = [],
      i;

  /** return null if prices is not a multidimensional array */
  if (typeof prices[0] !== 'object'){
    return null;
  }

  if(options.equalWeight){
    weights = [];
    for (i = 0; i < prices.length; i++){
      weights.push(1 / prices.length);
    }
  }

  /** check whether length of weights is consistent with length of prices */
  if (prices.length !== weights.length){
    return null;
  }

  /** compute price series */
  for (i = 0; i < prices[0].length; i++){
    results[i] = 0;
    weights.forEach(function(val, ind){
      results[i] += val * prices[ind][i];
    });

  }

  return results;

};




/**
 * diff
 *
 * Method that takes differences of a series. If a simple array [y[1], y[2], .. ] is passed,
 * it returns a simple array containing the specified differences; If a multidimensional array is
 * passed [[y[1], y[2], .. ], [z[1], z[2], .. ]], it returns a multidimensional array containing
 * the differences. Set options.diffType to specify the required difference.
 *
 *
 * If options.diffType is equal to
 *        1 (default)       (y[t] - y[t-1])/y[t-1]    is returned
 *        2                 (y[t] - y[t-1])           is returned
 *        3                 Math.log(y[t] / y[t-1])   is returned
 *
 * If options.newFirst is equal to
 *        false (default)   the ordering of the series is [y[T-2], y[T-1], y[T]]
 *        true              the ordering of the series is [y[T], y[T-1], y[T-2]]
 *
 * @param prices
 * @param options
 */
equity.diff = function(series, options){
  /** set defaults */
  options = options || {};
  options.diffType = options.diffType || 1;
  options.newFirst = options.newFirst || false;

  var result = [],
      isMultArray;

  /** detect multidimensional array */
  if (typeof series[0] === 'number') {
    isMultArray = false;
  } else if (typeof series[0] === 'object'){
    isMultArray = true;
  } else {
    return null;
  }

  if(isMultArray){

    series.forEach(function(series, ind){
      result[ind] = [];

      if(options.newFirst){
        series.reverse();
      }

      if (options.diffType === 1){
        for(i = 1; i < series.length; i++){
          result[ind].push((series[i]-series[i-1]) / series[i-1]);
        }
      } else if (options.diffType === 2){
        for(i = 1; i < series.length; i++){
          result[ind].push(series[i] - series[i-1]);
        }
      } else if (options.diffType === 3){
        for(i = 1; i < series.length; i++){
          result[ind].push(Math.log(series[i] / series[i-1]));
        }
      }

      if(options.newFirst){
        result[ind].reverse();
        series.reverse();
      }

    });
  } else {

    if(options.newFirst){
      series.reverse();
    }

    if (options.diffType === 1){
      for(i = 1; i < series.length; i++){
        result.push((series[i]-series[i-1]) / series[i-1]);
      }
    } else if (options.diffType === 2){
      for(i = 1; i < series.length; i++){
        result.push(series[i] - series[i-1]);
      }
    } else if (options.diffType === 3){
      for(i = 1; i < series.length; i++){
        result.push(Math.log(series[i] / series[i-1]));
      }
    }

    if(options.newFirst){
      result[ind].reverse();
      series.reverse();
    }

  }

  return result;

};



/**
 * efficientPortfolio
 *
 * Method that takes an array of individual stock return arrays and computes the weights
 * of the efficient portfolio for a given desired portfolio return according to the
 * (analytic) Huang-Litzenberger approach
 * A reference for this approach is http://www.financetoys.com/portfolio/markeng.htm
 *
 *
 * @method efficientPortfolio
 * @param desiredPortfolioReturn {Number} the desired portfolio return as a decimal number (i.e. 0.04)
 * @param stockReturns {Array of Arrays} an array of arrays with stock returns where each array contains the
 *                                       full time series of stock returns for a given stock as a decimal number
 *                                       example: [[0.02, 0.03, -0.01], [0.06, -0.03, 0.04]]
 * @param options {object} object containing options for use in the calculation
 * @return tbd
 */
equity.efficientPortfolio = function (desiredPortfolioReturn, stockReturns, options){

  /** set defaults */
  options = options || {};
  options.freq = options.freq || 1;

  var length = stockReturns.length;
  var u = stats.ones(length,1);
  var e = [];
  var w = [], wT;
  var i, j;
  var covariance = stats.zeros(length), covTemp = stats.zeros(length), covarianceInv;
  var temp, portfolioVariance;
  var A, B, C, D, l, m, g, h;

  // todo: error handling when return vectors are not of same length
  // todo: error handling when less than two assets

  /** compute initial weights */
  for(i = 0; i < length; i++){
    w.push(1/length);
  }
  wT = stats.transpose(w);

  /** compute expected return */
  stockReturns.forEach(function(val){
    e.push([stats.mean(val) * options.freq]);
  });


  /** compute covariance matrix */
  for(i = 0; i < length; i++){
    for(j = i; j < length; j++) {
      // we add a correction factor as stats computes the empirial covariance by default
      // moreover, exploit symmetry of covariance matrix
      covariance[i][j] = options.freq * stats.covariance(stockReturns[i], stockReturns[j]) * (stockReturns[0].length - 1) / stockReturns[0].length;
      covTemp[i][j] = covariance[i][j];
      if(i !== j){
        covariance[j][i] = covariance[i][j];
        covTemp[j][i]    = covariance[i][j];
      }
    }
  }



  temp = stats.multiply(covariance, wT);
  portfolioVariance = 0;
  /** compute portfolio standard dev */
  for(i = 0; i < length; i++){
    portfolioVariance += w[i] * temp[i][0];
  }



  /** compute inverse of covariance matrix */
  covarianceInv = stats.inv(covTemp);

  /** Define and compute scalars A, B, C, D and coefficients m, l */
    // A
  temp = stats.multiply(covarianceInv, u);
  A = 0;
  for(i = 0; i < length; i++){
    A += e[i][0] * temp[i][0];
  }

  // B
  temp = stats.multiply(covarianceInv, e);
  B = 0;
  for(i = 0; i < length; i++){
    B += e[i][0] * temp[i][0];
  }

  // C
  temp = stats.multiply(covarianceInv, u);
  C = 0;
  for(i = 0; i < length; i++){
    C += u[i][0] * temp[i][0];
  }

  // D
  D = B * C - A * A;

  // l
  temp = stats.multiply(covarianceInv, e);
  l = [];
  for(i = 0; i < length; i++){
    l.push(temp[i][0]);
  }

  // m
  temp = stats.multiply(covarianceInv, u);
  m = [];
  for(i = 0; i < length; i++){
    m.push(temp[i][0]);
  }

  /** calculate portfolio coordinates g, h */
    // g (portfolio with minimal expected return) g = (B*m - A*l)/D
  g = stats.divide(stats.subtract(stats.multiply(m, B), stats.multiply(l, A)), D);

  // h (portfolio with maximal expected return) h = (B*l - A*m)/D
  h = stats.divide(stats.subtract(stats.multiply(l, C), stats.multiply(m, A)), D);


  /** find efficient portfolio for given return */
  w = stats.add(g,stats.multiply(h, desiredPortfolioReturn));
  wT = stats.transpose(w);

  /** compute portfolio risk */
  temp = stats.multiply(covariance, wT);
  portfolioVariance = 0;
  for(i = 0; i < length; i++){
    portfolioVariance += w[i] * temp[i][0];
  }


  return {
    weights: w,
    portfolioVariance: portfolioVariance,
    portfolioReturn: desiredPortfolioReturn
  };

};