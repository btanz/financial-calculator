// * MODULE COLLECTING PROPERTY/REAL ESTATE FUNCTIONS
var helpers = require('./helpers');
var _ = require('underscore');
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
  var cash = [], totals = [], cashHelper;
  var result = {}; result._1 = {}; result._2 = {};
  var localElems = calcElems.propertyreturn.results_1;
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
  helper.profit = helper.revenue - inputs.equity - (Math.ceil(inputs.termLoan * 12)) * inputs.repay - helper.maintenance;


  // *** 3.C. Compute monthly and annual values  / all values b.o.p ***
  cash[0] = []; cash[1] = []; cash[2] = []; cash[3] = []; cash[4] = []; cash[5] = []; cash[6] = [];
  cash[0][0] = 1;
  cash[1][0] = inputs.maintenance;
  cashHelper = inputs.termLoan !== 0 ? inputs.repay : 0;
  cash[2][0] = (inputs.term > 1) ? cash[1][0] * 12 : cash[1][0] * Math.ceil(12 * (inputs.term));
  cash[2][0] += (inputs.termLoan > 1) ? cashHelper * 12 : cashHelper * Math.ceil(12 * (inputs.termLoan));
  cash[1][0] += cashHelper;
  totals[0] = cash[2][0];
  cash[3][0] = inputs.revenue;
  cash[4][0] = (inputs.term > 1) ? cash[3][0] * 12 : cash[3][0] * Math.ceil(12 * (inputs.term));
  totals[1] = cash[4][0];
  cash[5][0] = cash[4][0] - cash[2][0];
  cash[6][0] = - inputs.equity + cash[5][0];



  for (var i=1; i < inputs.term; i++){
    cash[0][i] = i + 1;
    cash[1][i] = inputs.maintenance * Math.pow(1 + inputs.costDynamic,i);
    cash[2][i] = (inputs.term - i > 1) ? cash[1][i] * 12 : cash[1][i] * Math.ceil(12 * (inputs.term - i));
    cashHelper = i < inputs.termLoan ? inputs.repay : 0;
    cash[2][i] += (inputs.termLoan - i > 1) ? cashHelper * 12 : cashHelper * Math.ceil(12 * (inputs.termLoan - i));
    cash[1][i] += cashHelper;
    cash[3][i] = inputs.revenue * Math.pow(1 + inputs.revDynamic,i);
    cash[4][i] = (inputs.term - i > 1) ? cash[3][i] * 12 : cash[3][i] * Math.ceil(12 * (inputs.term - i));
    cash[5][i] = cash[4][i] - cash[2][i];
    cash[6][i] = cash[6][i-1] + cash[5][i];
    totals[0] += cash[2][i]; totals[1] += cash[4][i];
  }
  totals[2] = - inputs.equity - totals[0] + totals[1] + inputs.terminal;

  // transpose cash array
  helper.cash = cash[0].map(function(col,i){
    return cash.map(function(row){
      return row[i];
    })
  });

  /* ******** 4. CONSTRUCT RESULT OBJECT ******** */

  // first result container
  result.id = calcElems.propertyreturn.id;
  ['irr','profit','revenue','rentRevenue','sellRevenue','investment','initialInvestment','maintenance','loan'].forEach(function(val) {
    result._1[val] = _.extend(localElems[val], {"value": helper[val]});
  });

  // second result container
  result._2.title = 'Zahlungsübersicht';
  result._2.header = ['Jahr', 'Kosten', 'Einnahmen', 'Gewinn'];
  result._2.headersub = ['Mon.', 'Jahr', 'Mon.', 'Jahr', 'Jahr', 'kumuliert'];
  result._2.firstrow = ['Anfangsinvestition von ', ' EUR', helper.initialInvestment, -helper.initialInvestment];
  result._2.lastrow = ['Endwert von ', ' EUR', helper.sellRevenue, helper.sellRevenue + cash[6][cash[6].length-1]];
  result._2.body = helper.cash;
  result._2.totalsrow = ['&sum;','',totals[0],'',totals[1],totals[2],totals[2]];

  return result;
};

