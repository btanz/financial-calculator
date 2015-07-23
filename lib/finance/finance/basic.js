/**
 * basics.js
 *
 * Basic methods and helper functions for finance
 */

"use strict";
var basic = exports;



/**
 * adjustTermToLowerFullPeriod
 *
 * Method that adjust a term to the lower full period. Example: If the term is 10.27 years and there are 12 periods
 * in a year, the result is 10.25, which are 123 full months expressed as years.
 *
 * @method adjustTermToLowerFullPeriod
 * @param term {Number} the term (usually in years)
 * @param periods {Number} the periods per term (i.e. 12 for 12 months in a year)
 * @return {Number} The lower full period in units of the term
 */
basic.adjustTermToLowerFullPeriod = function(term, periods){
  return Math.floor(term / (1 / periods)) / periods;
};


/**
 * adjustTermToHigherFullPeriod
 *
 * Method that adjust a term to the higher full period. Example: If the term is 10.27 years and there are 12 periods
 * in a year, the result is 10.33, which are 124 full months expressed as years.
 *
 * @method adjustTermToHigherFullPeriod
 * @param term {Number} the term (usually in years)
 * @param periods {Number} the periods per term (i.e. 12 for 12 months in a year)
 * @return {Number} The higher full period in units of the term
 */
basic.adjustTermToHigherFullPeriod = function(term, periods){
  return Math.ceil(term / (1 / periods)) / periods;
};


/**
 * q
 *
 * Method that computes q for a given interest rate i, where q = 1 + i
 *
 * @method q
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @return {Number} The annual q
 */
basic.q = function(interest){
  return 1 + interest;
};


/**
 * qN
 *
 * Method that computes q^n for a given interest rate i, where q^n = (1 + i)^n
 *
 * @method qN
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param term {Number} the term (i.e. 12 for 12 years)
 * @return {Number} q^n
 */
basic.qN = function(interest, term){
  return Math.pow(basic.q(interest),term);
};


/**
 * qPeriod
 *
 * Method that computes periodical q for a given
 * (annual) interest rate i, where q = 1 + i / periods
 *
 * @method qPeriod
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periods {Number} the periods per term (i.e. 12 for 12 months in a year)
 * @return {Number} The periodical q
 */
basic.qPeriod = function(interest, periods){
  return basic.q(interest / periods);
};


/**
 * qPeriodN
 *
 * Method that computes periodical q^(n*periods) for a given
 * (annual) interest rate i, where q^(n*periods) = (1 + i / periods)^ (n * periods)
 *
 * @method qPeriodN
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periods {Number} the periods per term (i.e. 12 for 12 months in a year)
 * @param term {Number} the term (i.e. 12 for 12 years)
 * @return {Number} The periodical q
 */
basic.qPeriodN = function(interest, periods, term){
  return Math.pow(basic.qPeriod(interest,periods),term * periods);
};


/**
 * round
 *
 * Method that rounds to the supplied number of digits (german "kaufmännische Rundungsregeln")
 *
 * @method round
 * @param number {Number} the number to be rounded
 * @param digits {Number} the number of digits
 * @return {Number} The 'number' rounded to 'digits' digits
 */
basic.round = function(number, digits){
  return (number < 0) ? - Math.round(Math.abs(number) * Math.pow(10, digits)) / Math.pow(10, digits) : Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
};



/**
 * pv
 *
 * Method that computes the present value for a series of cash flows and a single interest rate
 *
 * @method pv
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param cf {Array} An array of cash flows, containing time of cash flow {Number} and cash flow {Number}
 *                   Example: [[1,5],[2,105]] has a cash flow of 5 (105) at time 1 (2)
 * @return {Number} The present value of the cash flow series
 */
basic.pv = function(interest, cf){
  var pv = 0;
  cf.forEach(function(el){pv += el[1] / Math.pow(1 + interest, el[0]);});
  return pv;
};



/**
 * sum
 *
 * Simple method that sums two numbers and is mainly used as callback
 *
 * @method add
 * @param a {Number} first summand
 * @param b {Number} second summand
 * @return {Number} sum
 */
basic.sum = function(a,b){
  return a + b;
};



/**
 * annualpayments
 *
 * Method that returns an array of length provided containing a payment provided at every provided position
 * and zeros in all other positions. It is used for example to pass annual special repayments to the annuuty.schedule
 * method
 *
 * @method annualpayments
 * @param length {Number} length of the created array
 * @param repay {Number} periodical repayment
 * @param period {Number} the payment period (12..for annual)
 * @return {Array} Array of length (length) with (repay) at every (period) position and zeros otherwise
 */
basic.annualpayments = function(length, repay, period){
  period = period || 12;  /** default to 12 */
  var payments = Array.apply(null, new Array(length)).map(Number.prototype.valueOf,0);
  if(basic.round(repay,2) > 0){
    payments.forEach(function(val,ind){
      if(ind % period === 0 && ind !== 0){ payments[ind] = repay; }
    });
  }
  return payments;
};
