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
 * Method that rounds to the supplied number of digits
 *
 * @method round
 * @param number {Number} the number to be rounded
 * @param digits {Number} the number of digits
 * @return {Number} The 'number' rounded to 'digits' digits
 */
basic.round = function(number, digits){
  return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
};
