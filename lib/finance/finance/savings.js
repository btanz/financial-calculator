/**
 * Created by benjamintanz on 31.08.15.
 *
 * Methods for savings (scheme) calculations such as terminal values and terms
 *
 */
var _ = require('underscore');
var basic = require('./basic');

"use strict";
var savings = exports;



/**
 * schedule
 *
 * Method that computes the payment schedule and balances for savings plans (with periodic inflows) with various
 * given parameters. Use call and pass an object with parameters to this method
 *
 * @method schedule
 * @param {Object} inputs - The input parameters
 * @param {Number} inputs.mode - the calculation mode; the following modes are supported and
 *                               require the defined additional parameters
 *                 inputs.mode = 1: Computes terminal value given principal, inflow, interest, term (optionally: dynamic, inflowfreq, interestfreq, compounding)
 * @param {Number} inputs.principal    - principal (Anfangskapital) of the plan
 * @param {Number} inputs.term         - term of the period with inflows in years
 * @param {Number} inputs.inflow       - periodical saving amount
 * @param {Number} inputs.interest     - savings plan interest rate
 * @param {Number} inputs.inflowfreq   - amount of (equally spaced) inflow periods per year
 * @param {Number} inputs.interestfreq - amount of (equally spaced) interest accrual/pay dates per year
 * @param {Number} inputs.compounding  - 1 if compounded interest, 2 if interest is paid out
 * @param {Number} inputs.inflowtime   - 1 if post-inflow (nachschüssig), 2 if pre-period inflow (vorschüssig)
 *
 *
 * @param inputs
 * @returns {{terminal: number}}
 */
savings.schedule = function(inputs){
  var self = this;
  var helper = {};
  var scheduleTerminal, dyn, dynT, j, k, l;
  /** set defaults */
  self.dynamic      = self.dynamic || 0;      // no dynamics (annual increases of the savings rate)
  self.inflowfreq   = self.inflowfreq || 12;  // monthly inflow frequency
  self.interestfreq = self.interestfreq || 1; // annual interest frequency
  self.compounding  = self.compounding || 1;  // compounded interest
  self.inflowtime   = self.inflowtime  || 1;  // post-inflow (nachschüssig)


  /**
   * 0. Helper functions
   */

  /** 0.1 Create schedule when term is open (principal, inflow, dynamic, interest, term given) */
  scheduleTerminal = function(principal, inflow, interest, term, dynamic, inflowfreq, interestfreq, compounding, inflowtime){
    var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = [];
    var terminal, i, k = 1, interestVal = 0;

    for(i = 1, terminal = term * 12; i <= terminal; i++){

      /** current month */
      dyn[0][k - 1] = i;
      /** principal b.o.p */
      dyn[1][k - 1] = (k === 1) ? principal : dyn[4][k - 2];

      /** check whether month is a payment month */
      if((i % (12/inflowfreq) === 0 && (inflowtime === 1)) || ((i-1) % (12/inflowfreq) === 0 && (inflowtime === 2))) {
        /** periodical payment */
        dyn[2][k - 1] = inflow;
      } else {
        dyn[2][k - 1] = 0;
      }

      /** accumulate interest */
      interestVal += (dyn[1][k - 1] + (inflowtime - 1) * dyn[2][k - 1])* (interest / 12);

      /** check whether month is an interest payment month */
      if(i % (12/interestfreq) === 0) {
        /** periodical interest */
        dyn[3][k - 1] = interestVal;
        interestVal = 0;
      } else {
        dyn[3][k - 1] = 0;
      }

      /** balance e.o.p */
      dyn[4][k - 1] = dyn[1][k - 1] + dyn[2][k - 1] + (2 - compounding) * dyn[3][k - 1];

      /** check whether we are at the end of a year and need to increment the savings (dynamic) */
      if(i % 12 === 0) {
        inflow *= 1 + dynamic;
      }

      /** increment line in view */
      k += 1;

    }
    return dyn;
  };


  /**
   * 1. Main calculations
   */

  /** compute and invert schedule */
  dyn = scheduleTerminal(self.principal, self.inflow, self.interest, self.term, self.dynamic, self.inflowfreq, self.interestfreq, self.compounding, self.inflowtime);
  dynT = dyn[0].map(function (col, i) {return dyn.map(function (row) {return row[i];})});

  /** compute parameters of interest */
  helper.principal    = dyn[1][0];
  helper.totalInflow  = _.reduce(dyn[2], basic.sum, 0);
  helper.totalInterest= _.reduce(dyn[3], basic.sum, 0);
  helper.terminal     = dyn[4][dyn[4].length - 1] + (self.compounding - 1) * helper.totalInterest;


  /** attach annual values */
  j = 1; k = 1; l = 0;
  dyn[0].forEach(function(val, ind){
    if((val) % 12 === 0){
      dynT.splice(ind + j,    0,[val/12 + '. Jahr', dyn[1][ind + 1 - k ], _.reduce(dyn[2].slice(ind + 1 - k, ind + 1), basic.sum, 0), _.reduce(dyn[3].slice(ind + 1 - k, ind + 1), basic.sum, 0), dyn[4][ind], true]);
      j += 1;
      k = 0;
    }
    k += 1;
  });

  /** attach final values */
  dynT.push(['Summe', helper.principal, helper.totalInflow, helper.totalInterest, helper.terminal, true]);




  return {
    terminal: 1,
    schedule: dynT
  }
};