/**
 * annuity.js
 * Copyright 2015 Benjamin Tanz
 *
 * methods for annuity calculations
 *
 */
var _ = require('underscore');
var basic = require('./basic');

"use strict";
var annuity = exports;


/**
 * annualInterestLinear
 *
 * Method that computes annual interest payments for 'subannual' annuity repayment schedules
 * according to the linear interest method. Each period, the periodical (linear) interest rate is applied
 * to the beginning-of-period residual account balance. The end of period account balance is computed
 * by subtracting the periodical payment and adding the periodical interest. Note that this is different
 * to, for example, the PAngV method, where the 'subannual' account balance is computed as
 * by subtracting the periodical payment only.
 *
 * @method annualInterestLinear
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return annualInterest {Number} Returns the annual interest payment
 */
annuity.annualInterestLinear = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  var result = 0, i, iAmount;
  for (i = 1; i <= periodsPerYear; i++){
    iAmount = Math.max(residualDebt, 0) * (interest / periodsPerYear);
    residualDebt -= (periodicalPayment - iAmount);
    result += iAmount;
  }
  return result;
};


/**
 * annualAmortizationLinear
 *
 * Method that computes the annual amortization values for 'subannual' annuity repayment schedules
 * according to the linear interest method. Each period, the periodical (linear) interest rate is applied
 * to the beginning-of-period residual account balance. The end of period account balance is computed
 * by subtracting the periodical payment and adding the periodical interest.
 *
 * @method annualAmortizationLinear
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return annualInterest {Number} Returns the annual interest payment
 */
annuity.annualAmortizationLinear = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  return Math.min(residualDebt, periodsPerYear * periodicalPayment - annuity.annualInterestLinear(residualDebt, periodsPerYear, interest, periodicalPayment));
};


/**
 * annualResidualLinear
 *
 * Method that computes the end of year residual debt values for 'subannual' annuity repayment schedules
 * according to the linear interest method. Each period, the periodical (linear) interest rate is applied
 * to the beginning-of-period residual account balance. The end of period account balance is computed
 * by subtracting the periodical payment and adding the periodical interest.
 *
 * @method annualResidualLinear
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return annualInterest {Number} Returns the annual interest payment
 */
annuity.annualResidualLinear = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  return residualDebt - annuity.annualAmortizationLinear(residualDebt, periodsPerYear, interest, periodicalPayment);
};



/**
 * annualInterestPAngV
 *
 * Method that computes annual interest payments for 'subannual' annuity repayment schedules
 * according to the German PAngV. According to this method, 'subannual' payments
 * are only used for amortization and interests is accumulated and booked at the end
 * of the year only.
 * See Script Prof. J. Sigloch, Finanzmathematik und Wirtschaftsrechnen, F82
 *
 * @method annualInterestPAngV
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return annualInterest {Number} Returns the annual interest payment
 */
annuity.annualInterestPAngV = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  var result = 0, i;
  for (i=1; i <= periodsPerYear; i++){
    result += (residualDebt - periodicalPayment * (i-1)) * (interest / (periodsPerYear));
    if ((residualDebt - periodicalPayment * (i-1)) * (1 + interest / (periodsPerYear)) < periodicalPayment) { break;}
  }
  return result;
};


/**
 * annualAmortizationPAngV
 *
 * Method that computes annual amortization values for 'subannual' annuity repayment schedules
 * according to the German PAngV. According to this method, semiannual payments
 * are only used for amortization and interests is accumulated and booked at the end
 * of the year only. This method computes the end of year amortization value after
 * annual interest payments are made.
 * See Script Prof. J. Sigloch, Finanzmathematik und Wirtschaftsrechnen, F82
 *
 * @method annualAmortizationPAngV
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return {Number} Returns the end of year annual amortization value according to PAngV
 */
annuity.annualAmortizationPAngV = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  return Math.min(residualDebt, periodicalPayment * periodsPerYear - annuity.annualInterestPAngV(residualDebt, periodsPerYear, interest, periodicalPayment));
};


/**
 * annualResidualPAngV
 *
 * Method that computes the end of year residual debt for 'subannual' annuity repayment schedules
 * according to the German PAngV. According to this method, semiannual payments
 * are only used for amortization and interests is accumulated and booked at the end
 * of the year only.
 * See Script Prof. J. Sigloch, Finanzmathematik und Wirtschaftsrechnen, F82
 *
 * @method annualResidualPAngV
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return {Number} Returns the end of year residual debt value according to PAngV
 */
annuity.annualResidualPAngV = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  return residualDebt - annuity.annualAmortizationPAngV(residualDebt, periodsPerYear, interest, periodicalPayment);
};



/**
 * annuityTerm
 *
 * Method that computes the term of an annuity loan.
 *
 * It is computed as the inverse of the annuity formula on
 * http://www.mathematik.de/ger/fragenantworten/erstehilfe/zinsrechnung/annuitaetenkredit/der_annuitaetenkredit.html
 *
 * @method annuityTerm
 * @param principal {Number} the face value of the outstanding debt
 * @param repay {Number} the periodical annuity payment
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periods {Number} the payment periods in an interest period (i.e. 12 if monthly payments with annual interest)
 * @return {Number} Returns the term of the annuity
 */
annuity.annuityTerm = function(principal, repay, interest, periods){
  return (interest === 0) ? principal / (periods * repay) : Math.log((repay / ((interest / periods) * principal)) / ((repay / ((interest / periods) * principal))-1)) / (periods * Math.log(1 + (interest/periods)));
};


/**
 * annuity
 *
 * Method that computes the annuity from principal, interest, periods and term
 *
 * It is computed according to the formula
 * Annuity = Principal * q^nT * (q-1)/(q^(nT)-1)
 *
 * See also
 * http://www.mathematik.de/ger/fragenantworten/erstehilfe/zinsrechnung/annuitaetenkredit/der_annuitaetenkredit.html
 *
 * @method annuity
 * @param principal {Number} the face value of the outstanding debt
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periods {Number} the payment periods in an interest period (i.e. 12 if monthly payments with annual interest)
 * @param term {Number} the term of the annuity
 * @return {Number} Returns the (periodical) annuity
 */
annuity.annuity = function(principal, interest, periods, term){
  //return (interest === 0) ? principal / (periods * repay) : Math.log((repay / ((interest / periods) * principal)) / ((repay / ((interest / periods) * principal))-1)) / (periods * Math.log(1 + (interest/periods)));
  return principal * basic.qPeriodN(interest, periods, term) * (basic.qPeriod(interest, periods) - 1) / (basic.qPeriodN(interest, periods, term) - 1);
};


/**
 * annuityInitialInterest
 *
 * Method that computes the annuity from principal, initial interest ('anfängliche Tilgung'), interest and periods
 *
 * It is computed according to the formula
 * Annuity = Principal * (i + s) / n
 *    i .. interest
 *    s .. initialinterest
 *    n .. periods
 *
 *
 * @method annuityInitialInterest
 * @param principal {Number} the face value of the outstanding debt
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periods {Number} the payment periods in a year (this is a reference for initialinterest
 * @param initialinterest {Number} the inital interest of the annuity as a decimal number
 *                                 this is the first year actual repayment (after interest) of the loan as percentage of the total loan
 * @return {Number} Returns the (periodical) annuity
 */
annuity.annuityInitialInterest = function(principal, interest, periods, initialinterest){
  return (principal * interest + principal * initialinterest) / periods;
};


/**
 * principalInitialInterest
 *
 * Method that computes the principal from annuity, initial interest ('anfängliche Tilgung'), interest and periods
 *
 * It is computed according to the formula
 * Principal = (Annuity * n) / (i + s)
 *    i .. interest
 *    s .. initialinterest
 *    n .. periods
 *
 *
 * @method principalInitialInterest
 * @param annuity {Number} the periodical annuity
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periods {Number} the payment periods in a year (this is a reference for initialinterest
 * @param initialinterest {Number} the inital interest of the annuity as a decimal number
 *                                 this is the first year actual repayment (after interest) of the loan as percentage of the total loan
 * @return {Number} Returns the principle
 */
annuity.principalInitialInterest = function(annuity, interest, periods, initialinterest){
  return (annuity * periods) / (interest + initialinterest);
};


/**
 * interestInitialInterest
 *
 * Method that computes the interest rate from principle, annuity, initial interest ('anfängliche Tilgung') and periods
 *
 * It is computed according to the formula
 * i = (Annuity * n - Principal * s) / Principal
 *    i .. interest
 *    s .. initialinterest
 *    n .. periods
 *
 *
 * @method interestInitialInterest
 * @param annuity {Number} the periodical annuity
 * @param principal {Number} the face value of the outstanding debt
 * @param periods {Number} the payment periods in a year (this is a reference for initialinterest
 * @param initialinterest {Number} the inital interest of the annuity as a decimal number
 *                                 this is the first year actual repayment (after interest) of the loan as percentage of the total loan
 * @return {Number} Returns the principle
 */
annuity.interestInitialInterest = function(principal, annuity, periods, initialinterest){
  return (annuity * periods - principal * initialinterest) / principal;
};


/**
 * initialInterest
 *
 * Method that computes the initial interest ('anfängliche Tilgung') from principle, annuity, interest and periods
 *
 * It is computed according to the formula
 * s = (Annuity * n - Principal * i) / Principal
 *    i .. interest
 *    s .. initialinterest
 *    n .. periods
 *
 *
 * @method initialInterest
 * @param principal {Number} the face value of the outstanding debt
 * @param annuity {Number} the periodical annuity
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periods {Number} the payment periods in a year (this is a reference for initialinterest
 * @return {Number} Returns the principle
 */
annuity.initialInterest = function(principal, annuity, interest, periods){
  return (annuity * periods - principal * interest) / principal;
};


/**
 * schedule
 *
 * Method that computes the annuity payment schedule for various given parameters
 * Use call and pass an object with parameters to this method
 *
 * @method schedule
 * @param {Object} inputs - The input parameters
 * @param {Number} inputs.mode - the calculation mode; the following modes are supported and
 *                               require the defined additional parameters
 *                 inputs.mode = 1: Computes residual value given Term, Paymentfrequency, Annuity, Principal and Interest
 * @param {Number} inputs.term - term of the loan
 * @param {Number} inputs.repayfreq - number of repayments per year
 * @param {Number} inputs.principal - principal of the loan
 * @param {Number} inputs.repay - periodic annuity
 * @param {Number} inputs.interest - loan interest rate
 *
 * @returns {Array} An array containing
 */
annuity.schedule = function(inputs){
  var self = this;
  var dyn, dynRepayFree;
  var dynT, dynTRepayFree;
  var i, j, k, l, disagioTotal, feesTotal, repaymentfreeTotal = 0, repaymentfreeTotalInitiallyAdded;
  var scheduleResidual, viewPrincipal = this.principal;
  var specialRepayCounter = 0;

  /**
   * 0. Helper functions
   */
  /** create schedule given Term, Paymentfrequency, Annuity, Principal and Interest with Residual open */
  scheduleResidual = function(principal, repay, term, repayfreq, interest, noamortization, annualrepay){
    var i, j, k;
    var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = []; dyn[5] = []; dyn[6] = []; dyn[7] = [];
    var dynT;
    for(i = 1; i <= term * repayfreq; i++){
      dyn[0][i-1] = i * 12 / repayfreq;                               /** current month */
      dyn[1][i-1] = (i === 1) ? principal : dyn[5][i-2];              /** outstanding debt b.o.p */
      dyn[3][i-1] = dyn[1][i-1] * (interest / repayfreq);             /** periodical interest */
      if(noamortization){
        dyn[2][i-1] = dyn[3][i-1];
        dyn[4][i-1] = 0;
        dyn[5][i-1] =  Math.max(0, dyn[1][i-1]);
      } else {
        dyn[2][i-1] = (repay < dyn[1][i-1] + dyn[3][i-1]) ? repay : dyn[1][i-1] + dyn[3][i-1];  /** periodical annuity */
        dyn[4][i-1] = dyn[2][i-1] - dyn[3][i-1];                        /** periodical debt reduction */
        dyn[5][i-1] = Math.max(0, dyn[1][i-1] - dyn[4][i-1]);           /** outstanding debt e.o.p */
      }
      dyn[6][i-1] = false;                                            /** annual value indicator */
      dyn[7][i-1] = false;                                            /** special repayment indicator */
    }

    /** attach annual special repayments if desired */
    j = 1; k = 0;
    if(basic.round(annualrepay,2) > 0){

      dynT = dyn[0].map(function (col, i) {return dyn.map(function (row) {return row[i];})});

      dyn[0].forEach(function(val, ind){
        if((val) % 6 === 0){
          dynT.splice(ind + j,0,[val + ' (ST)',99,99,99,99,99,false,true]);
          j += 1;
          k = 0;
        }
        k += 1;
      });

      dyn = dynT[0].map(function (col, i) {return dynT.map(function (row) {return row[i];})});
    }

    return dyn;
  };


  /**
   * A. Term, Paymentfrequency, Annuity, Principal and Interest are given
   */
  if(this.mode === 1){

    /** calculate disagio if necessary */
    if(this.disagio){
      disagioTotal = this.principal * this.disagioamount;
    } else {
      disagioTotal = 0;
    }

    /** attach fees added to principal (verrechnet) if necessary */
    if(this.fees && !this.feeupfront){
      this.principal += this.feeamount;
    }

    /** calculate interest for repaymentfree periods added to principal and add it to principal*/
    if(this.repaymentfree && this.repaymentfreetype === 2){
      repaymentfreeTotalInitiallyAdded = this.principal * Math.pow(1 + this.interest / this.repayfreq, this.repaymentfreeterm * this.repayfreq) - this.principal;
      this.principal += repaymentfreeTotalInitiallyAdded;
    }

    /** create schedule */
    dyn = scheduleResidual(this.principal, this.repay, this.term, this.repayfreq, this.interest, false, this.annualrepay);
    dynT = dyn[0].map(function (col, i) {return dyn.map(function (row) {return row[i];})});
    viewPrincipal = this.principal;

    /** create schedule for repaymentfree periods with periodical interest */
    if(this.repaymentfree && this.repaymentfreetype === 3){
      dynRepayFree = scheduleResidual(this.principal, this.repay, this.repaymentfreeterm, this.repayfreq, this.interest, true);
      dynTRepayFree = dynRepayFree[0].map(function (col, i) {return dynRepayFree.map(function (row) {return row[i];})});
      repaymentfreeTotal = _.reduce(dynRepayFree[2], basic.sum, 0);
      dynTRepayFree.push(['Tilgungsfreie Zeit', dyn[1][0], repaymentfreeTotal, _.reduce(dynRepayFree[3], basic.sum, 0), _.reduce(dynRepayFree[4], basic.sum, 0), dyn[1][0], true]);

    }


    /** attach annual values if desired */
    if(this.annualvals){
      j = 1; k = 0; l = 0;
      dyn[0].forEach(function(val, ind){
        if(dyn[7][ind + 1]) { specialRepayCounter += 1;}
        if((val) % 12 === 0){
          //console.log('Ind: '+ (ind+1) + ' Value: ' + dyn[7][ind+1]);
          /** escape special repayments that happen at the end of a year */
          dyn[7][ind + 1] ? l = 1 : l = 0;
          dynT.splice(ind + j + l,0,[val/12, dyn[1][ind + 1 - self.repayfreq - 1], _.reduce(dyn[2].slice(ind + 1 - self.repayfreq, ind + 1), basic.sum, 0), _.reduce(dyn[3].slice(ind + 1 - self.repayfreq, ind + 1), basic.sum, 0), _.reduce(dyn[4].slice(ind + 1 - self.repayfreq, ind + 1), basic.sum, 0),dyn[5][ind],true]);


          j += 1;
          k = 0;
        }
        k += 1;
      });
      console.log(specialRepayCounter);

      if(!dynT[dynT.length - 1][6]){
        dynT.push([Math.ceil(this.term), dyn[1][dyn[1].length + 1 - k], _.reduce(dyn[2].slice(dyn[2].length + 1 - k, dyn[2].length), basic.sum, 0), _.reduce(dyn[3].slice(dyn[3].length + 1 - k, dyn[3].length), basic.sum, 0), _.reduce(dyn[4].slice(dyn[4].length + 1 - k, dyn[4].length), basic.sum, 0), dyn[5][dyn[5].length - 1],true]);
      }
    }

    /** attach schedule view for repaymentfree periods with periodical interest if necessary */
    if(this.repaymentfree && this.repaymentfreetype === 3){
      Array.prototype.unshift.apply(dynT, dynTRepayFree);
    }


    /** attach upfront fees if necessary */
    if(this.fees && this.feeupfront){
      feesTotal = this.feeamount;
      dynT.unshift(['Gebühren', dyn[1][0], feesTotal, feesTotal, 0, dyn[1][0], true]);
    } else {
      feesTotal = 0;
    }

    /** attach view line for interestfree periods added to principal (verrechnet) if necessary */
    if(this.repaymentfree && this.repaymentfreetype === 2){
      dynT.unshift(['Tilgungsfreie Zeit', this.principal, 0, 0, 0, this.principal, true]);
      viewPrincipal -= repaymentfreeTotalInitiallyAdded;
    }

    /** attach view line for fees added to principal (verrechnet) if necessary */
    if(this.fees && !this.feeupfront){
      dynT.unshift(['Gebühren', viewPrincipal, 0, 0, 0, this.principal, true]);
      viewPrincipal -= this.feeamount;
    }

    /** attach view line for disagio if necessary */
    if(this.disagio){
      dynT.unshift(['Disagio', viewPrincipal, disagioTotal, disagioTotal, 0, dyn[1][0], true]);
    }

    /** attach final values if desired */
    if(this.finalvals){
      dynT.push(['Summe', dyn[1][0], _.reduce(dyn[2], basic.sum, 0) + disagioTotal + feesTotal + repaymentfreeTotal, _.reduce(dyn[3], basic.sum, 0) + disagioTotal + feesTotal + repaymentfreeTotal, _.reduce(dyn[4], basic.sum, 0), dyn[5][dyn[5].length - 1], true]);
    }


    return {
      schedule:   dynT,
      residual:   dyn[5][dyn[5].length - 1],
      totalrepay: _.reduce(dyn[2], basic.sum, 0) + disagioTotal + feesTotal + repaymentfreeTotal,
      totalinterest: _.reduce(dyn[3], basic.sum, 0),
      totalreduction: _.reduce(dyn[4], basic.sum, 0),
      totalrepaymentfreeinterest: repaymentfreeTotal
    }


  } else {
    return null;
  }


};

