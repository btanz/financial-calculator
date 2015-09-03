/**
 * Created by benjamintanz on 31.08.15.
 *
 * Methods for savings (scheme) calculations such as terminal values and terms
 *
 */
var _ = require('underscore');
var basic = require('./basic');
var math = require('../../../app/modules/math');

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
  var scheduleTerminal, scheduleTerm, dyn, dynT, dynTermfix, dynTermfixT, j, k, l;
  /** set defaults */
  self.dynamic      = self.dynamic || 0;      // no dynamics (annual increases of the savings rate)
  self.inflowfreq   = self.inflowfreq || 12;  // monthly inflow frequency
  self.interestfreq = self.interestfreq || 1; // annual interest frequency
  self.compounding  = self.compounding || 1;  // compounded interest
  self.inflowtime   = self.inflowtime  || 1;  // post-inflow (nachschüssig)
  self.termfix      = self.termfix  || 0;     // fixed term zero by default


  /**
   * 0. Helper functions
   */

  /** 0.1 Create schedule when terminal is open (principal, inflow, dynamic, interest, term given) */
  scheduleTerminal = function(principal, inflow, interest, term, dynamic, inflowfreq, interestfreq, compounding, inflowtime, termfix){
    var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = [];
    var terminal, i, k = 1, interestVal = 0, termMonth;

    termfix = termfix || 0;
    termMonth = term * 12;

    for(i = 1, terminal = (term + termfix) * 12; i <= terminal; i++){

      /** current month */
      dyn[0][k - 1] = i;
      /** principal b.o.p */
      dyn[1][k - 1] = (k === 1) ? principal : dyn[4][k - 2];

      /** check whether month is a payment month */
      if((i % (12/inflowfreq) === 0 && (inflowtime === 1) && i <= termMonth) || ((i-1) % (12/inflowfreq) === 0 && (inflowtime === 2) && i <= termMonth)) {
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
    /** assign terminal interest value */
    helper.interestResidual = interestVal;

    return dyn;
  };


  /** 0.2 wrapper around scheduleTerminal for computing the principal (terminal, inflow, dynamic, interest, term given) */
  function computePrincipal(principal){
    var locDyn = scheduleTerminal(principal, self.inflow, self.interest, self.term, self.dynamic, self.inflowfreq, self.interestfreq, self.compounding, self.inflowtime, self.termfix);
    helper.totalInflow  = _.reduce(locDyn[2], basic.sum, 0);
    helper.totalInterest= _.reduce(locDyn[3], basic.sum, 0) + helper.interestResidual;
    /** return difference of terminal and principal */
    return self.terminal - locDyn[4][locDyn[4].length - 1] - (self.compounding - 1) * (helper.totalInterest - helper.interestResidual) - helper.interestResidual;
  }

  /** 0.3 wrapper around scheduleTerminal for computing the inflow (principal. terminal, dynamic, interest, term given) */
  function computeInflow(inflow){
    var locDyn = scheduleTerminal(self.principal, inflow, self.interest, self.term, self.dynamic, self.inflowfreq, self.interestfreq, self.compounding, self.inflowtime, self.termfix);
    helper.totalInflow  = _.reduce(locDyn[2], basic.sum, 0);
    helper.totalInterest= _.reduce(locDyn[3], basic.sum, 0) + helper.interestResidual;
    /** return difference of terminal and principal */
    return self.terminal - locDyn[4][locDyn[4].length - 1] - (self.compounding - 1) * (helper.totalInterest - helper.interestResidual) - helper.interestResidual;
  }

  /** 0.4 function for term computations */
  function computeTerm(){
    /** assign variables */
    var mz = self.interestfreq;  // number interest periods within a year
    var mr = self.inflowfreq;    // number of cash payments within a year
    var nf = self.termfix;       // fix termin in years
    var r  = self.interest;     // interest
    var K  = self.principal;     // principal
    var R  = self.inflow;        // principal
    var d  = self.dynamic;       // dynamics
    var E  = self.terminal;      // terminal value

    /** discount terminal */
    E = E / Math.pow( 1 + r / mz, nf * mz);

    /** compute iff self.dynamic === 0 */
    if(self.dynamic === 0){
      (function(){
        function findRootOf(n){
          return E - K * Math.pow(1 + r / mz,n * mz) - R * (Math.pow(1+r / mz,n * mz) - 1) * ((mr >= mz) * (mr / mz + (r / mz)/2 * (mr / mz+(self.inflowtime === 1) * (-1)+(self.inflowtime === 2)))/(r / mz) + (mr < mz)*((self.inflowtime === 1) * 1+(self.inflowtime === 2) * Math.pow(1 + r/mz,mz/mr))/(Math.pow(1+r/mz,mz/mr) - 1));
        }
        helper.term = math.roots(findRootOf,30,1500);

      })();
    }
    return helper.term;
    // todo: continue case with dynamics
  }

  /** 0.6 wrapper around scheduleTerminal for computing the required interest rate (principal, terminal, inflow, dynamic, term given) */
  function computeInterest(interest){
    var locDyn = scheduleTerminal(self.principal, self.inflow, interest, self.term, self.dynamic, self.inflowfreq, self.interestfreq, self.compounding, self.inflowtime, self.termfix);
    helper.totalInflow  = _.reduce(locDyn[2], basic.sum, 0);
    helper.totalInterest= _.reduce(locDyn[3], basic.sum, 0) + helper.interestResidual;
    /** return difference of terminal and principal */
    return self.terminal - locDyn[4][locDyn[4].length - 1] - (self.compounding - 1) * (helper.totalInterest - helper.interestResidual) - helper.interestResidual;
  }




  /**
   * 1. Main calculations
   */

  /** compute and invert schedule */
  if(self.mode === 1){          // terminal open parameter
    dyn = scheduleTerminal(self.principal, self.inflow, self.interest, self.term, self.dynamic, self.inflowfreq, self.interestfreq, self.compounding, self.inflowtime, self.termfix);
    dynT = dyn[0].map(function (col, i) {return dyn.map(function (row) {return row[i];})});
  } else if (self.mode === 2){  // principal open parameter
    /** find zero of computePrincipal */
    helper.principal = math.roots(computePrincipal,self.terminal / 2);
    if(helper.principal === null){
      return {
        error: 'Leider ist bei der Bestimmung des Anfangskapitals ein Fehler aufgetreten. Dies kann zum Beispiel passieren, wenn das rechnerische Anfangskapital negativ ist. Bitte senken Sie die Sparrate, das Sparintervall, den Anspar- und/oder Anlagezeitraum.'
      }
    }
    /** compute schedule */
    dyn = scheduleTerminal(helper.principal, self.inflow, self.interest, self.term, self.dynamic, self.inflowfreq, self.interestfreq, self.compounding, self.inflowtime, self.termfix);
    dynT = dyn[0].map(function (col, i) {return dyn.map(function (row) {return row[i];})});

  } else if (self.mode === 3) {  // inflow open parameter
    helper.inflow = math.roots(computeInflow,self.principal / (5 * self.inflowfreq));
    if(helper.inflow === null){
      return {
        error: 'Leider ist bei der Bestimmung der Sparrate ein Fehler aufgetreten. Dies kann zum Beispiel passieren, wenn die rechnerische Sparrate negativ ist. Bitte überprüfen Sie die Eingaben.'
      }
    }
    /** compute schedule */
    dyn = scheduleTerminal(self.principal, helper.inflow, self.interest, self.term, self.dynamic, self.inflowfreq, self.interestfreq, self.compounding, self.inflowtime, self.termfix);
    dynT = dyn[0].map(function (col, i) {return dyn.map(function (row) {return row[i];})});

  } else if (self.mode === 4) {  // term open parameter
    // todo
  } else if (self.mode === 5) {  // interest open parameter
    helper.interest = math.roots(computeInterest, 0.05);
    if(helper.interest === null){
      return {
        error: 'Leider ist bei der Bestimmung des Zinssatzes ein Fehler aufgetreten. Dies kann zum Beispiel passieren, wenn der rechnerische Zinssatz negativ ist. Bitte überprüfen Sie die Eingaben.'
      }
    }
    /** compute schedule */
    dyn = scheduleTerminal(self.principal, self.inflow, helper.interest, self.term, self.dynamic, self.inflowfreq, self.interestfreq, self.compounding, self.inflowtime, self.termfix);
    dynT = dyn[0].map(function (col, i) {return dyn.map(function (row) {return row[i];})});
  }



  /** compute parameters of interest */
  helper.principal    = dyn[1][0];
  helper.totalInflow  = _.reduce(dyn[2], basic.sum, 0);
  helper.totalInterest= _.reduce(dyn[3], basic.sum, 0) + helper.interestResidual;
  helper.terminal     = dyn[4][dyn[4].length - 1] + (self.compounding - 1) * (helper.totalInterest - helper.interestResidual) + helper.interestResidual;


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

  /** attach value short before final sum */
  if(!dynT[dynT.length - 1][5]){
    dynT.push([Math.ceil(self.term + self.termfix) + '. Jahr', dyn[1][dyn[1].length + 1 - k], _.reduce(dyn[2].slice(dyn[2].length + 1 - k, dyn[2].length), basic.sum, 0), _.reduce(dyn[3].slice(dyn[3].length + 1 - k, dyn[3].length), basic.sum, 0), dyn[4][dyn[4].length - 1],true]);
  }

  /** attach terminal accrued interest if present */
  if(helper.interestResidual !== 0){
    dynT.push(['Aufgelaufene Zinsen', 0, 0, helper.interestResidual, helper.terminal, false, true])
  }

  /** attach final values */
  dynT.push(['Summe', helper.principal, helper.totalInflow, helper.totalInterest, helper.terminal, true]);


  return {
    terminal: helper.terminal,
    principal: helper.principal,
    inflow: helper.totalInflow,
    interest: helper.totalInterest,
    schedule: dynT,
    inflowrate: self.inflow || helper.inflow,
    interestrate: self.interest || helper.interest
  }
};