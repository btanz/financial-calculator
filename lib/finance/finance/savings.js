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
 * // todo: DOKU
 *
 * @param inputs
 * @returns {{terminal: number}}
 */
savings.schedule = function(inputs){
  var self = this;
  var helper = {};
  var scheduleTerminal, dyn, dynT;
  /** set defaults */
  self.dynamic = self.dynamic || 0;


  /**
   * 0. Helper functions
   */

  /** 0.1 Create schedule when term is open (principal, inflow, dynamic, interest, term given) */
  scheduleTerminal = function(principal, inflow, interest, term, dynamic){
    var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = [];
    var terminal, i, k = 1;

    for(i = 1, terminal = term * 12; i <= terminal; i++){
      /** current month */
      dyn[0][k - 1] = i;
      /** principal b.o.p */
      dyn[1][k - 1] = (k === 1) ? principal : dyn[4][k - 2];
      /** periodical payment */
      dyn[2][k - 1] = inflow;
      /** periodical interest */
      dyn[3][k - 1] = dyn[1][k - 1] * (interest);
      /** balance e.o.p */
      dyn[4][k - 1] = dyn[1][k - 1] + dyn[2][k - 1] + dyn[3][k - 1];

      /** increment line in view */
      k += 1;
    }
    return dyn;
  };



  dyn = scheduleTerminal(self.principal, self.inflow, self.interest, self.term, self.dynamic);
  dynT = dyn[0].map(function (col, i) {return dyn.map(function (row) {return row[i];})});


  return {
    terminal: 1,
    schedule: dynT
  }
};