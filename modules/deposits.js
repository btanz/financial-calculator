var _ = require('underscore');
var helpers = require('./helpers');
var calcElems = require('../data/static/calcElems.json');

var terminalValueHelper, annualCashHelper;

/* ************************ BEGIN DEPOSITS MODULE PUBLIC FUNCTIONS *****************************/

/* DEPOSITS-INTEREST function that computes terminal value OR inital value OR holding period OR interest rate;
 *   the argument that is not a number or can not be cast as a number is computed
 * ARGUMENTS
 *   start                      inital capital / principal; NUMBER (currency)
 *   end                        terminal value; NUMBER (currency)
 *   period                     holding period; NUMBER (years)
 *   rate                       interest rate; NUMBER (%, but in DECIMALS)
 * ACTIONS
 *   none
 * RETURNS
 *   object result
 *     result.result             result of the calculation / null if computation failed; NUMBER
 *     result.computationMode    indicator of computation mode; indicates which argument was not handed over and hence computed; NUMBER
 *     result.resultAnnual       annual values of the stock and interest payments; ARRAY
 *     result.interestGain       total interest gain
 */
exports.interest = function(inputs){

  /* ******** 1. INIT AND ASSIGN ******** */
  var result = {}; result._1 = {}; result._2 = {};
  var helper, helperAnnual, helperAnnualT;
  var localElems = calcElems.depinterest.outputs;
  var expectedInputs = calcElems.depinterest.inputs;
  var _expectedInputs = _.clone(expectedInputs);
  var errorMap;
  var selectMap = ['end','start','rate','period'];
  var outputMap = ['Endkapital', 'Anfangskapital', 'Zinssatz', 'Laufzeit'];

  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  // drop elems that are to be computed form input and expectedinputs object
  delete inputs[selectMap[inputs.select]];
  delete _expectedInputs[selectMap[inputs.select]];

  errorMap = helpers.validate(inputs, _expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }

  inputs.rate = inputs.rate/100;

  /* ******** 3. COMPUTATIONS ******** */
  // 3A. Compute main result
  if (inputs.select === 0){ // compute end value end
    helper =  terminalValueHelper(inputs.start, inputs.period, inputs.rate);
  } else if (inputs.select === 1) {  // compute initial value start
    helper = (inputs.end / Math.pow(1 + inputs.rate, inputs.period));
  } else if (inputs.select === 2){  // compute rate
    helper = ((-1 + Math.pow((inputs.end / inputs.start),(1 / inputs.period))));
  } else if (inputs.select === 3){  // compute period
    helper = ((Math.log(inputs.end) - Math.log(inputs.start)) / Math.log(1 + inputs.rate));
  } else {  // sth wrong
    return null;
  }

  // 3B. Compute single-period values
  inputs[selectMap[inputs.select]] = helper;
  helperAnnual= annualCashHelper(inputs['start'],inputs['period'],inputs['rate']);

  // transpose helperAnnual
  helperAnnualT = helperAnnual[0].map(function(col,i){
    return helperAnnual.map(function(row){
      return row[i];
    })
  });



  /* ******** 4. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.depinterest.id;
  // first result container
  result._1.value =          {'description': localElems[selectMap[inputs.select]].description,  'value': inputs.select == 2 ? helper * 100 : helper,                    'unit': localElems[selectMap[inputs.select]].unit, 'digits': localElems[selectMap[inputs.select]].digits, 'tooltip': localElems[selectMap[inputs.select]].tooltip};
  result._1.gain  =          {'description': localElems['gain'].description,                    'value': inputs.end - inputs.start, 'unit': localElems['gain'].unit                  , 'digits': localElems['gain'].digits,                   'tooltip': localElems['gain'].tooltip};
  // second result container
  result._2.title = 'Kapitalentwicklung';
  result._2.header = ['Jahr', 'Kapitalwert Beginn', 'Zins', 'Zins akkumuliert', 'Kapitalwert Ende'];
  result._2.body = helperAnnualT;

  return result;

};


/* ************************ END DEPOSITS MODULE PUBLIC FUNCTIONS *******************************/



/* ************************ BEGIN DEPOSITS MODULE HELPERS (NOT EXPOSED) ************************/


/* DEPOSITS-TERMINAL_VALUE_HELPER function that computes terminal value of an investment */
terminalValueHelper = function(start,period,rate,inflation){
  if (arguments.length === 4){  // calculate inflation adjusted
    return start * Math.pow( (1 + rate)/(1 + inflation),period);
  } else if (arguments.length === 3) {  // no inflation adjustment
    return start * Math.pow(1 + rate,period);
  } else {  // sthg wrong
    return null;
  }
};


/* DEPOSITS-ANNUAL_CASH_HELPER function that computes annual cash flows from primitives
 * ARGUMENTS
 *   start              the inital value (principal) of the asset; NUMBER
 *   period             the holding period of the asset; positive NUMBER
 *   interest           the interest rate in DECIMALS; NUMBER
 *   (NOTE)             the function expects three arguments and returns null otherwise
 * ACTIONS
 *   none
 * RETURNS
 *   result             two-dimensional array with numbers or null iff inputs are incorrect
 *      result[property][period], where property is in
 *              0 ... identifies the e.o.p time period
 *              1 ... identifies the b.o.p asset value
 *              2 ... identifies the e.o.p single-period interest
 *              3 ... identifies the e.o.p accumulated interest
 *              4 ... identifies the e.o.p asset value
 *       exampe: result[4][3] holds the e.o.p asset value of e.o.p period 4 (with index 3)
 */
annualCashHelper = function(start, period, interest){
  // assign and init
  var result, remaining;
  var i;

  // do some checks - return if args can't be casted to numbers OR number of args is incorrect OR Period <=0
  if (arguments.length !== 3){
    return null;
  } else if ( isNaN(start) || isNaN(period) || isNaN(interest)){
    return null;
  } else if (period <= 0){
    return null;
  }

  // initialize & set initial condition
  result = [];
  result[0] = []; result[1] = []; result[2] = []; result[3] = []; result[4] = [];
  remaining = period;
  if(period<1){
    result[0][0] = period;                 // time e.o.p.
    result[1][0] = start;             // value b.o.p
    result[4][0] = start * Math.pow((1+interest),period); // value e.o.p
    result[2][0] = result[4][0] - start;  // interest e.o.p
    result[3][0] = result[4][0] - start;  // interest e.o.p. accumulated
  } else {
    result[0][0] = 1;                 // time e.o.p.
    result[1][0] = start;             // value b.o.p
    result[2][0] = start * interest;  // interest e.o.p
    result[3][0] = start * interest;  // interest e.o.p. accumulated
    result[4][0] = result[1][0] + result[2][0];  // value e.o.p

    // iterate and compute
    for (i = 1; i < period; i++){
      result[0][i] = i + 1;
      result[1][i] = result[4][i-1];
      result[2][i] = result[1][i] * interest;
      result[3][i] = result[3][i-1] + result[2][i];
      result[4][i] = result[1][i] + result[2][i];
      remaining -= 1;
      if (remaining < 1){ // this means we are in the last iteration with a fractional period (i.e. 4.4, 6.1 years)
        result[0][i] = period;                 // time e.o.p.
        result[1][i] = result[4][i-1];             // value b.o.p
        result[4][i] = result[4][i-1] * Math.pow((1+interest),remaining); // value e.o.p
        result[2][i] = result[4][i] - result[1][i];  // interest e.o.p
        result[3][i] = result[4][i] - start;  // interest e.o.p. accumulated
      }
    }
  }

  // return array with results of computation
  return result;
};


/* ************************ END DEPOSITS MODULE HELPERS (NOT EXPOSED) **************************/