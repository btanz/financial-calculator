/**
 * Finance.js
 *
 * A finance library for JavaScript
 *
 *
 * Created by benjamintanz on 01.07.15.
 */

"use strict";

var add,
    annualInterestLinear,
    annualAmortizationLinear,
    annualResidualLinear,
    annualInterestPAngV,
    annualAmortizationPAngV,
    annualResidualPAngV;




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
annualInterestLinear = function(residualDebt, periodsPerYear, interest, periodicalPayment){
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
annualAmortizationLinear = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  return Math.min(residualDebt, periodsPerYear * periodicalPayment - annualInterestLinear(residualDebt, periodsPerYear, interest, periodicalPayment));
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
annualResidualLinear = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  return residualDebt - annualAmortizationLinear(residualDebt, periodsPerYear, interest, periodicalPayment);
};




/**
 * annualInterestPAngV
 *
 * Method that computes annual interest payments for 'subannual' annuity repayment schedules
 * according to the German PAngV. According to this method, 'subannual' payments
 * are only used for amortization and interests is accumulated and booked at the end
 * of the year only.
 *
 * @method annualInterestPAngV
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return annualInterest {Number} Returns the annual interest payment
 */
annualInterestPAngV = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  var result = 0, i;
  for (i=1; i <= periodsPerYear; i++){
    result += (residualDebt - periodicalPayment * (i-1)) * (interest / (periodsPerYear));
    if ((residualDebt - periodicalPayment * (i-1)) * (1 + interest / (periodsPerYear)) < periodicalPayment) { break;}
  }
  return result;
};

/* Notes for testing
console.log(annualInterestPAngV(100000,4,0.08,3000));  // 7640
console.log(annualInterestPAngV(95640,4,0.08,3000));  // 7291.20
console.log(annualInterestPAngV(4000,4,0.08,3000));    // 100
console.log(annualInterestPAngV(2500,4,0.08,1000));    // 90
console.log(annualInterestPAngV(4000,4,1,1500));       // 1875
console.log(annualInterestPAngV(3500,4,1,1500));       // 1500
*/



/**
 * annualAmortizationPAngV
 *
 * Method that computes annual amortization values for 'subannual' annuity repayment schedules
 * according to the German PAngV. According to this method, semiannual payments
 * are only used for amortization and interests is accumulated and booked at the end
 * of the year only. This method computes the end of year amortization value after
 * annual interest payments are made.
 *
 * @method annualAmortizationPAngV
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return {Number} Returns the end of year annual amortization value according to PAngV
 */
annualAmortizationPAngV = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  return Math.min(residualDebt, periodicalPayment * periodsPerYear - annualInterestPAngV(residualDebt, periodsPerYear, interest, periodicalPayment));
};

/* Notes for testing
 console.log(annualAmortizationPAngV(100000,4,0.08,3000));  // 4360
 console.log(annualAmortizationPAngV(95640,4,0.08,3000));   // 4708.8
 console.log(annualAmortizationPAngV(4000,4,0.08,3000));    // 4000
 console.log(annualAmortizationPAngV(2500,4,0.08,1000));    // 2500
 console.log(annualAmortizationPAngV(4000,4,1,1500));       // 4000
 console.log(annualAmortizationPAngV(3500,4,1,1500));       // 3500
 */




/**
 * annualResidualPAngV
 *
 * Method that computes the end of year residual debt for 'subannual' annuity repayment schedules
 * according to the German PAngV. According to this method, semiannual payments
 * are only used for amortization and interests is accumulated and booked at the end
 * of the year only.
 *
 * @method annualResidualPAngV
 * @param residualDebt {Number} debt at the beginning of the year
 * @param periodsPerYear {Number} the payment periods per year (example: equals 12 for monthly payments)
 * @param interest {Number} the annual interest as a decimal number (i.e. 0.04)
 * @param periodicalPayment {Number} the periodical annuity payment
 * @return {Number} Returns the end of year residual debt value according to PAngV
 */
annualResidualPAngV = function(residualDebt, periodsPerYear, interest, periodicalPayment){
  return residualDebt - annualAmortizationPAngV(residualDebt, periodsPerYear, interest, periodicalPayment);
};

/* Notes for testing
 console.log(annualResidualPAngV(100000,4,0.08,3000));  // 95640.00
 console.log(annualResidualPAngV(95640,4,0.08,3000));   // 90931.20
 console.log(annualResidualPAngV(4000,4,0.08,3000));    // 0
 console.log(annualResidualPAngV(2500,4,0.08,1000));    // 0
 console.log(annualResidualPAngV(4000,4,1,1500));       // 0
 console.log(annualResidualPAngV(3500,4,1,1500));       // 0
 */









/********************** LOCAL HELPERS *********************/


// a simple function that does addition
// mainly used as callback in reduce tasks
add = function(a,b){
  return a + b;
};

/********************** EXPOSE FUNCTIONS *********************/
module.exports = {
  annualInterestLinear: annualInterestLinear,
  annualAmortizationLinear: annualAmortizationLinear,
  annualResidualLinear: annualResidualLinear,
  annualInterestPAngV: annualInterestPAngV,
  annualAmortizationPAngV: annualAmortizationPAngV,
  annualResidualPAngV: annualResidualPAngV
};


