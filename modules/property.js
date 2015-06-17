// * MODULE COLLECTING PROPERTY/REAL ESTATE FUNCTIONS
var helpers = require('./helpers');
var calcElems = require('../data/static/calcElems.json');
var math = require('./math');




/* PROPERTY-PROPERTYRETURN function that computes parameters for investments in real estate property
 * ARGUMENTS XXX
 *   start                      inital capital / principal; NUMBER (currency)
 *   end                        terminal value; NUMBER (currency)
 *   period                     holding period; NUMBER (years)
 *   rate                       interest rate; NUMBER (%, but in DECIMALS)
 * ACTIONS
 *   none
 * RETURNS XXX
 *   object result
 *     result.result             result of the calculation / null if computation failed; NUMBER
 *     result.computationMode    indicator of computation mode; indicates which argument was not handed over and hence computed; NUMBER
 *     result.resultAnnual       annual values of the stock and interest payments; ARRAY
 *     result.interestGain       total interest gain
 */
exports.propertyreturn = function(inputs){

  /* ******** 1. INIT AND ASSIGN ******** */
  var revenuePV, goal, irr, helper = {};
  var result = {}; result._1 = {};
  var localElems = calcElems.propertyreturn.outputs;
  var expectedInputs = calcElems.propertyreturn.inputs;
  var errorMap;


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  errorMap = helpers.validate(inputs, expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }

  inputs.costDynamic = inputs.costDynamic / 100;
  inputs.revDynamic = inputs.revDynamic / 100;

  /* ******** 3. COMPUTATIONS ******** */

  // todo: add monthly features (see idle inputs in view)
  // todo: check numerical stability if IRR is very high (>80%)

  // *** 3.A Compute effective interest ***
  revenuePV = function(interest){
    if (interest === inputs.revDynamic) {  // deal with corner case
      return inputs.terminal + (Math.pow(1 + interest, inputs.term) * (1 - Math.pow(1 + interest, -1))) / (1 - Math.pow(1 + interest, -1 / 12)) * inputs.revenue * inputs.term;
    } else {
      return inputs.terminal + (Math.pow(1 + interest, inputs.term) * (1 - Math.pow(1 + interest, -1))) / (1 - Math.pow(1 + interest, -1 / 12)) * inputs.revenue * (1 - Math.pow((1 + inputs.revDynamic) / (1 + interest), inputs.term)) / (1 - (1 + inputs.revDynamic) / (1 + interest));
    }
  };



  // define goal function
  goal = function(interest){
    var inflow, outflow;
    // compute PV of revenue
    inflow = revenuePV(interest);
    // compute PV of maintenance costs
    if (interest === inputs.costDynamic) {  // deal with corner case
      inflow -= (Math.pow(1 + interest, inputs.term) * (1 - Math.pow(1 + interest, -1))) / (1 - Math.pow(1 + interest, -1 / 12)) * inputs.maintenance * inputs.term;
    } else {
      inflow -= (Math.pow(1 + interest, inputs.term) * (1 - Math.pow(1 + interest, -1))) / (1 - Math.pow(1 + interest, -1 / 12)) * inputs.maintenance * (1 - Math.pow((1 + inputs.costDynamic) / (1 + interest), inputs.term)) / (1 - (1 + inputs.costDynamic) / (1 + interest));
    }

    // compute PV of intial and periodical inflows
    outflow = inputs.equity * Math.pow(1 + interest, inputs.term) + inputs.repay * Math.pow(1 + interest,inputs.term) * (1-Math.pow(1+interest, -inputs.termLoan)) / (1-Math.pow(1+interest,-1/12));
    return inflow - outflow;
  };

  // find root of goal function
  irr = (math.roots(goal,0.5)) * 100;





  // sanitize result
  if (!irr || (isNaN(irr))){
    return null;
  }




  // assign result to return object
  helper.irr = irr;

  // *** 3.B. Compute aggregate revenues and costs ***

  // todo: calculations should be alright, but re-very once monthly values are computed
  helper.revenue = inputs.revDynamic !== 0 ? inputs.terminal + inputs.revenue * 12 * (1-Math.pow(1 + inputs.revDynamic, Math.floor(inputs.term))) / (-inputs.revDynamic) + (Math.ceil((inputs.term - Math.floor(inputs.term)) * 12)) * inputs.revenue * Math.pow(1+inputs.revDynamic,Math.floor(inputs.term)) : inputs.terminal + (Math.ceil(inputs.term * 12)) * inputs.revenue;
  helper.rentRevenue = helper.revenue - inputs.terminal;
  helper.sellRevenue = inputs.terminal;
  helper.maintenance = inputs.costDynamic !== 0 ? inputs.maintenance * 12 * (1-Math.pow(1 + inputs.costDynamic, Math.floor(inputs.term))) / (-inputs.costDynamic) + (Math.ceil((inputs.term - Math.floor(inputs.term)) * 12)) * inputs.maintenance * Math.pow(1 + inputs.costDynamic, Math.floor(inputs.term)) : (Math.ceil(inputs.term * 12)) * inputs.maintenance;
  helper.investment = inputs.equity + (Math.ceil(inputs.termLoan * 12)) * inputs.repay + helper.maintenance;
  helper.loan =  (Math.ceil(inputs.termLoan * 12)) * inputs.repay;
  helper.initialInvestment = inputs.equity;
  helper.profit = helper.revenue - inputs.equity;




  /* ******** 4. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.propertyreturn.id;
  result._1.irr = {'description': 'Rendite (Effektivzins, IRR)',  'value': helper.irr,             'unit': '% p. a.', 'digits': 3, 'tooltip': {}};



  return result;
};



