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
 *                                       full time series of stock returns as a decimal number
 *                                       example: [[0.02, 0.03, -0.01], [0.06, -0.03, 0.04]]
 * @return tbd
 */
equity.efficientPortfolio = function (desiredPortfolioReturn, stockReturns){
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
    e.push([stats.mean(val)]);
  });

  /** compute covariance matrix */
  for(i = 0; i < length; i++){
    for(j = i; j < length; j++) {
      // we add a correction factor as stats computes the empirial covariance by default
      // moreover, exploit symmetry of covariance matrix
      covariance[i][j] = stats.covariance(stockReturns[i], stockReturns[j]) * (stockReturns[0].length - 1) / stockReturns[0].length;
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