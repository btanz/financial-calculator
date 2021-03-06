/**
 * basics.js
 * Copyright 2015 Benjamin Tanz
 *
 * Basic methods and helper functions for finance
 */

"use strict";
var math = require('../../../app/modules/math');
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
 * Method that computes the present value for a series of cash flows given a single interest rate
 *
 * @method pv
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param cf {Array} An array of cash flows (arrays), containing  either
 *                         a) time of cash flow {Number} and cash flow {Number}
 *                             Example: [[1,5],[3,105]] has a cash flow of 5 (105) at time 1 (3) OR
 *                         b) cash flows ordered by time
 *                             Example: [5, 0, 105] has a cash flows as the above example
 * @param periods {Number} the number of periods in a year (12 for month; default is 1 (annual))
 * @return {Number} The present value of the cash flow series
 */
basic.pv = function(interest, cf, periods){
  var pv = 0;

  /** set defaults */
  periods = typeof periods !== 'undefined' ? periods : 1;

  /** check whether cf contains times and cfs */
  if(cf && Array.isArray(cf[0])){
    cf.forEach(function(el){pv += el[1] / Math.pow(1 + interest, el[0] / periods);});
  } else if (cf && !Array.isArray(cf[0])){
    cf.forEach(function(el, ind){pv += el / Math.pow(1 + interest, (ind + 1) / periods);});
  } else { /** case incorrect/no cf inputs */
    return
  }

  return pv;
};



/**
 * tvSubperiodsLinear
 *
 * Method that computes the terminal value of a single cash flow where the term is given
 * as month and need not be a multiple of the interest period; the interest period conform
 * part of the term is compounded, whereas a linear interest is computed for the residual part
 * Example: term 20 months, interest period 2 times a year
 *  -> result = [principal * (1 + interest / 2)  ^ (3)] * (1 + interest * 2/12)
 *
 *
 * @method tvSubperiodsLinear
 * @param principal {Number} the principal in units of money
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param term {Number} the term in months (!)
 * @param payfreq {Number} the number of payments per year (i.e. 12 for monthly, 4 for quarterly)
 * @return {Number} The terminal value of the cash flow series
 */
basic.tvSubperiodsLinear = function(principal, interest, term, payfreq){
  var termadj = Math.floor(term / (12 / payfreq)) * (12 / payfreq);
  return principal * Math.pow(1 + interest / payfreq, termadj / (12 / payfreq)) * (1 + ((term - termadj)/12) * interest);
};


/**
 * tvInterestdaysSubperiodsLinear
 *
 * Method that computes the terminal value of a single cash flow / principal where the term is given
 * as interestdays and need not be a multiple of the interest period; the interest period conform
 * part of the term is compounded, whereas a linear interest is computed for the residual part
 * The function also deals with taxes is required.
 * Example: todo
 *
 *
 *
 * @method tvInterestdaysSubperiodsLinear
 * @param principal {Number} the principal in units of money
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param daysInYear {Number} the number of days in the year according to daycount convention (i.e. 360, 365, etc)
 * @param termDays {Number} the term in (interest) days
 * @param interestperiods {Number} the number of interest periods in a year
 * @param taxes {Boolean} An indicator whether taxes need to be calculated (true) or not (false)
 * @oaram taxrate {Number} the taxrate as a decimal number (i.e. 0.04)
 * @param taxfree {Number} the annual free amount for taxes
 * @return {Number} The terminal value of the cash flow series
 */
basic.tvInterestdaysSubperiodsLinear = function(principal, interest, daysInYear, termDays, interestperiods, taxes, taxrate, taxfree){
  /** case with taxes */
  if(taxes){
    var tax = 0, periodtax, princ = principal, princOld, availabletaxfree = taxfree, i, result;
    for (i = 1; i <= Math.floor(termDays / (daysInYear / interestperiods)); i++){
      princOld = princ;
      princ = princ * Math.pow(1 + interest * (1 / interestperiods), 1);
      periodtax = Math.max(0, princ - princOld - availabletaxfree) * taxrate;
      availabletaxfree = Math.max(0, availabletaxfree - (princ - princOld));
      tax += periodtax;
      princ -= periodtax;
      if (i % interestperiods === 0){ availabletaxfree = taxfree;}
    }
    princOld = princ;
    princ = princ * (1 + interest * (termDays % (daysInYear / interestperiods)) / daysInYear);
    periodtax = Math.max(0, princ - princOld - availabletaxfree) * taxrate;
    tax += periodtax;
    princ -= periodtax;
    return {
      terminal: princ,
      tax: -tax
    }
  /** case w/o taxes */
  } else {
    result = principal * Math.pow(1 + interest * (1 / interestperiods), Math.floor(termDays / (daysInYear / interestperiods))) * (1 + interest * (termDays % (daysInYear / interestperiods)) / daysInYear);

    return {
      terminal: result,
      tax: 0
    }
  }
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



/**
 * irr
 *
 * Method that returns the internal rate of return for any cash flow array
 *
 * todo: complete documentation
 * @method irr
 * @param initialcf {Number} the initial (usually negative) cash flow / outflow
 * @param cf {Array} An array of cash flows (arrays), containing  either
 *                         a) time of cash flow {Number} and cash flow {Number}
 *                             Example: [[1,5],[3,105]] has a cash flow of 5 (105) at time 1 (3) OR
 *                         b) cash flows ordered by time
 *                             Example: [5, 0, 105] has a cash flows as the above example
 * @param periods {Number} the number of periods in a year (12 for month; default is 1 (annual))
 * @return {Number} the irr that sets initialcf - discounted cf's to zero
 */
basic.irr = function(initialcf, cf, periods){
  var pv;

  /** set defaults */
  periods = typeof periods !== 'undefined' ? periods : 1;

  /** wrapper for present value */
  pv = function(i){
    return initialcf - basic.pv(i, cf, periods);
  };


  return math.roots(pv,0.05);
};