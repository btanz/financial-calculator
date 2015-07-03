/**
 * annuity.js
 * Copyright 2015 Benjamin Tanz
 *
 * methods for annuity calculations
 *
 */

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
