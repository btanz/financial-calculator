/**
 * finstats.js
 * Copyright 2015 Benjamin Tanz
 *
 * Statistical methods for finance
 *
 */
var stats = require('jStat').jStat;

"use strict";
var finstats = exports;


/**
 * covarianceMatrix
 *
 * Method that computes the covariance matrix for an set of observations
 *
 * @param matrix {array} An array of arrays containing the values for which a covariance matrix is requested;
 *                       The array is in K*T form, where K is the number of assets and T is time/observations
 *                       [[r_11, r_12, .. , r_1T], ... ,[r_k1, ... , r_kT]]
 * @param options {object} contains options for calculation
 *              options.freq ... the return frequency to be used for annualizing the covariance matrix (Default = 1)
 *              options.sampleCov ... true when sample cov is desired, false otherwise (default: false)
 *
 */
finstats.covarianceMatrix = function(matrix, options){
  options           = options || {};
  options.freq      = options.freq || 1;
  options.sampleCov = options.sampleCov || false;

  var i,
      j,
      length = matrix.length,
      covariance = stats.zeros(length),
      covTemp = stats.zeros(length);

  for(i = 0; i < length; i++){
    for(j = i; j < length; j++) {
      // we add a correction factor as stats computes the empirical covariance by default
      // moreover, exploit symmetry of covariance matrix
      if(options.sampleCov){
        covariance[i][j] = options.freq * stats.covariance(matrix[i], matrix[j]);
      } else {
        covariance[i][j] = options.freq * stats.covariance(matrix[i], matrix[j]) * (matrix[0].length - 1) / matrix[0].length;
      }
      covTemp[i][j] = covariance[i][j];
      if(i !== j){
        covariance[j][i] = covariance[i][j];
        covTemp[j][i]    = covariance[i][j];
      }
    }
  }

  return covariance;

};