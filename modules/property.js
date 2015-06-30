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




/* PROPERTY-RENT function that computes rent over given period
 * ARGUMENTS XXX todo

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.rent = function(inputs){

  /* ******** 1. INIT AND ASSIGN ******** */
  var rootFun, helper, h1, i;
  var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; var dynT; var dynLast = [];
  var result = {}; result._1 = {}; result._2 = {};
  var localElems = calcElems.rent.results_1;
  var expectedInputs = calcElems.rent.inputs;
  var _expectedInputs = _.clone(expectedInputs);
  var errorMap;
  var selectMap = ['renttotal','dynamic','term','rent'];


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  // drop elems that are to be computed form input and expectedinputs object
  delete inputs[selectMap[inputs.select]];
  delete _expectedInputs[selectMap[inputs.select]];

  // run validations
  errorMap = helpers.validate(inputs, _expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }

  inputs.dynamic = inputs.dynamic / 100;


  /* ******** 3. HELPER FUNCTIONS ******** */
  rootFun = function(d){
    if ((d >= -0.0000000001 && d<= 0.0000000001)){
      h1 =  inputs.renttotal - 12 * inputs.rent * inputs.term * (1 + Math.log(1 + d));
    } else {
      h1 = inputs.renttotal - 12 * inputs.rent * (1 - Math.pow(1 + d, inputs.term)) / (-d);
    }
    return h1;
  };

  /* ******** 4. COMPUTATIONS ******** */

  // single period computations
  switch(inputs.select){
    case 0:
      helper = inputs.dynamic === 0 ? 12 * inputs.rent * inputs.term : 12 * inputs.rent * (1 - Math.pow(1 + inputs.dynamic, inputs.term)) / (-inputs.dynamic);
      inputs[selectMap[0]] = helper;
      break;
    case 1:
      helper = math.roots(rootFun,0.1,1500);
      if(helper === null){
        return [{errorMessage: 'Leider kann die Mietsteigerung für diese Parameter nicht berechnet werden. Grund dafür ist meist, dass die Mietsteigerung extrem niedrig (kleiner -40% p. a.) oder extrem hoch (größer +40% p. a.) ist', errorInput: '', errorPrint: true}];
      } else {
        inputs[selectMap[1]] = helper;
        helper *= 100;
      }
      break;
    case 2:
      helper = inputs.dynamic === 0 ? inputs.renttotal / (12 * inputs.rent) : Math.log(1 - (inputs.renttotal / (12 * inputs.rent)) * (- inputs.dynamic)) / Math.log(inputs.dynamic + 1);
      inputs[selectMap[2]] = helper;
      break;
    case 3:
      helper = inputs.dynamic === 0 ? inputs.renttotal / (12 * inputs.term) : inputs.renttotal / (12 * (1 - Math.pow(1 + inputs.dynamic, inputs.term)) / (-inputs.dynamic));
      inputs[selectMap[3]] = helper;
      break;
  }

  // dynamic computations
  for(i = 1; i <= Math.floor(inputs.term); i++){
    dyn[0][i-1] = i;
    dyn[1][i-1] = inputs.rent * Math.pow(1 + inputs.dynamic,i-1);
    dyn[2][i-1] = dyn[1][i-1] * 12;
    i === 1 ? dyn[3][i-1] = dyn[2][i-1] : dyn[3][i-1] = dyn[2][i-1] + dyn[3][i-2];
  }

  // add partial years to end
  if (inputs.term - Math.floor(inputs.term) > 0.01){
    dynLast[0] = inputs.term;
    dynLast[1] = inputs.rent * Math.pow(1 + inputs.dynamic,inputs.term - 1);;
    inputs.term < 1 ? dynLast[2] = inputs.renttotal  : dynLast[2] = inputs.renttotal - dyn[3][i-2];
    dynLast[3] = inputs.renttotal;
  }


  // transpose dyn
  dynT = dyn[0].map(function(col,i){
    return dyn.map(function(row){
      return row[i];
    })
  });


  /* ******** 5. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.rent.id;
  // first result container
  result._1.value = _.extend(localElems[selectMap[inputs.select]], {"value": helper});

  // second result container
  result._2.title = 'Übersicht Mietentwicklung';
  result._2.header = ['Jahr', 'Monatsmiete', 'Jahresmiete', 'Summe bisher gezahlte Miete'];
  result._2.body = dynT;
  result._2.bodylast = dynLast;

  return result;

};



/* PROPERTY-TRANSFERTAX function that computes "Grunderwerbssteuer" over given period
 * ARGUMENTS XXX todo

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.transfertax = function(inputs){

  /* ******** 1. INIT AND ASSIGN ******** */
  var result = {}; result._1 = {}; result._chart1 = {};
  var tax, totalprice, free, rate;
  var localElems = calcElems.transfertax.results_1;
  var expectedInputs = calcElems.transfertax.inputs;
  var errorMap;

  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  errorMap = helpers.validate(inputs, expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }

  /* ******** 3. COMPUTATIONS ******** */
  switch(inputs.state) {
    case "BAD":
      rate = 0.05; break;
    case "BAY":
      rate = 0.035; break;
    case "BER":
      rate = 0.06; break;
    case "BRA":
      rate = 0.065; break;
    case "BRE":
      rate = 0.05; break;
    case "HAM":
      rate = 0.045; break;
    case "HES":
      rate = 0.06; break;
    case "MEC":
      rate = 0.05; break;
    case "NIE":
      rate = 0.05; break;
    case "NOR":
      rate = 0.065; break;
    case "RHE":
      rate = 0.05; break;
    case "SAR":
      rate = 0.065; break;
    case "SAC":
      rate = 0.035; break;
    case "SAA":
      rate = 0.05; break;
    case "SCH":
      rate = 0.065; break;
    case "THU":
      rate = 0.05; break;
    default:
      return [{errorMessage: 'Leider ist ein Fehler bei der Berechnung aufgetreten.', errorInput: '', errorPrint: true}];
  }

  if (inputs.price <= 2500){
    totalprice = inputs.price;
    tax = 0;
    free = "JA";
  } else {
    totalprice = inputs.price * (1 + rate);
    tax = inputs.price * rate;
    free = "NEIN";
  }

  /* ******** 5. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.transfertax.id;
  // first result container
  result._1.total = _.extend(localElems.total,    {"value": totalprice});
  result._1.tax   = _.extend(localElems.tax,      {"value": tax});
  result._1.free   = _.extend(localElems.taxfree, {"value": free});
  result._1.rate   = _.extend(localElems.rate,    {"value": rate * 100});

  // chart 1
  result._chart1.data = {
    //labels: ['Kaufpreis Immobilie','Grunderwerbssteuer'],
    series: [totalprice - tax, tax]

  };
  result._chart1.options = {showLabel: true, donut: false, labelOffset: 10};
  result._chart1.type = 'Pie';


  return result

};



/* PROPERTY-HOMESAVE function that computes figures for "Bausparvertrag"
 * ARGUMENTS XXX todo

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.homesave = function(inputs){

  /* ******** 1. INIT AND ASSIGN ******** */
  var result = {}; result._1 = {}; result._2 = {};
  var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = []; dyn[5] = []; dyn[6] = []; dyn[7] = []; var dynT;
  var dynloan = []; dynloan[0] = []; dynloan[1] = []; dynloan[2] = []; dynloan[3] = []; dynloan[4] = []; dynloan[5] = []; dynloan[6] = []; dynloan[7] = []; var dynloanT;
  var helper = {}; var q, replacementrate;
  var localElems = calcElems.homesave.results_1;
  var expectedInputs = calcElems.homesave.inputs;
  var errorMap;
  var termsaveFullMth, partialMth, i, j, interestaccum = 0;


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  errorMap = helpers.validate(inputs, expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }

  inputs.interestsave /= 100;
  inputs.interestdebt /= 100;

  /* ******** 3. HELPER FUNCTIONS ******** */
  // function that returns the month into the full year for any month; example: intoyear(18) = 6, intoyear(12) = 12
  helper.intoyear = function(month){
    return (month % 12 === 0) * 12 + month % 12;
  };


  /* ******** 4. COMPUTATIONS SAVINGS PERIOD ******** */

  // HELPER VARS
  q = 1 + inputs.interestsave;
  r = inputs.interestdebt / 12;
  replacementrate = inputs.saving * (12 + (11/2)*(q-1));
  termsaveFullMth = Math.floor(inputs.termsave/(1/12))/12;
  termsaveFullY = Math.floor(termsaveFullMth);


  // DYNAMIC COMPUTATIONS
  interestaccum = 0;  // accumulator for semiperiodical interest PAngV
  var jumper = 0, terminal = [];
  terminal[2] = 0; terminal[3] = 0;
  helper.wohnungsbau = 0;
  for(i = 1, y = termsaveFullMth * 12 + termsaveFullY; i <= y; i++){
    if (dyn[6][i-2]){   // if last iteration was full year such that annual vals should be computed
      dyn[6][i-1] = false;
      dyn[7][i-1] = true;  // full year view indicator
      dyn[0][i-1] = String(Math.ceil((i) / 13)) + '. Jahr';
      dyn[1][i-1] = dyn[1][i - helper.intoyear(dyn[0][i-2]) - 1];
      dyn[2][i-1] = inputs.saving * helper.intoyear(dyn[0][i-2]);
      dyn[3][i-1] = dyn[3][i-2];
      dyn[4][i-1] = 0;
      dyn[5][i-1] = dyn[5][i-2];
      jumper = 1;
    } else {
      dyn[7][i-1] = false;  // full year view indicator
      (i === 1) ? dyn[0][i-1] = 1 : dyn[0][i-1] = dyn[0][i-2-jumper] + 1;                                                      // month
      (i === 1) ? dyn[1][i-1] = 0 - inputs.initialfee + inputs.initialpay : dyn[1][i-1] = dyn[5][i-2-jumper];                  // balance bop
      dyn[2][i-1] = inputs.saving;                                              // savings
      interestaccum += dyn[1][i-1] * (inputs.interestsave / 12);
      if ((dyn[0][i-1] % 12 === 0) || (i === termsaveFullMth * 12 + termsaveFullY)){ // end of year or last period in term
        dyn[3][i-1] = interestaccum; interestaccum = 0;                         // interest
        dyn[6][i-1] = true;                                                     // full year indicator
        helper.wohnungsbautemp = (i <= 12) ? inputs.initialpay : 0;
        helper.wohnungsbau += Math.round(100 * Math.min(((helper.intoyear(dyn[0][i-1]) * inputs.saving + dyn[3][i-1] + helper.wohnungsbautemp) > 50 ? (helper.intoyear(dyn[0][i-1]) * inputs.saving + dyn[3][i-1] + helper.wohnungsbautemp) : 0) * 0.088, 45.056 * (1 + Number(inputs.marriage)))) / 100; // amount of Wohnungsbauprämie
        // do one more loop for annual aggregates if we are in the last period of saving term and this period is not a full year
        !(dyn[0][i-1] % 12 === 0) && (i === termsaveFullMth * 12 + termsaveFullY) ? y += 1 : y = y;
      } else {
        dyn[3][i-1] = 0;
        dyn[6][i-1] = false;
      }
      dyn[4][i-1] = 0;                                                       // other pays / wohnungsbaupr
      dyn[5][i-1] = dyn[1][i-1] + dyn[2][i-1] + dyn[3][i-1];                    // balance eop
      terminal[0] = dyn[0][i-1];
      terminal[2] += dyn[2][i-1];
      terminal[3] += dyn[3][i-1];
      jumper = 0;
    }
    terminal[5] = dyn[5][i-1];
  }

  // STATIC CALCS
  helper.finalsavings = terminal[5];  // final w/o Wohnungsbau
  helper.wohnungsbauent = inputs.income <= (1 + Number(inputs.marriage)) * 21600 ? true : false;   // entitled to 'Wohnungsbauprämie?'
  //helper.wohnungsbau = Number(inputs.bonus) * Number(helper.wohnungsbauent) * Math.min(helper.finalsavings * 0.088, termsaveFullY * 45.06 * (1 + Number(inputs.marriage)));  // amount of Wohnungsbauprämie for full year
  helper.wohnungsbau = Number(inputs.bonus) * Number(helper.wohnungsbauent) * helper.wohnungsbau;
  // total available savings w wohnungsbauprämie
  helper.finalsavingswohnungsbau = helper.finalsavings + helper.wohnungsbau;
  // total loan payment
  helper.totalloanpay = (inputs.paypercent / 100) * inputs.principal;


  // transpose dyn
  dynT = dyn[0].map(function(col,i){
    return dyn.map(function(row){
      return row[i];
    })
  });

  // attach final rows
  if(helper.wohnungsbau!= 0){
    dynT.push(['Wohnungsbauprämie', terminal[5],helper.wohnungsbau,,,terminal[5] + helper.wohnungsbau,,]);
  }

  dynT.push(['Summen', 0 - inputs.initialfee + inputs.initialpay,terminal[2] + helper.wohnungsbau,terminal[3],,terminal[5] + helper.wohnungsbau,,true]);
  dynT.push(['Zuteilung Darlehen', terminal[5] + helper.wohnungsbau, -helper.totalloanpay,,,terminal[5] + helper.wohnungsbau - helper.totalloanpay,,true]);

  // STATIC COMPUTATIONS

  // number of inflow payments
  helper.numberpays = termsaveFullMth * 12;

  // total available savings w/o wohnungsbauprämie // commented out, since no shortcut formula for replacement rate with period ending between years
  /*helper.accrue = inputs.interestsave === 0 ? inputs.saving * 12 * termsaveFullMth : replacementrate * (Math.pow(q,termsaveFullMth)-1)/(q-1);
  helper.finalsavings = helper.accrue + inputs.initialpay * Math.pow(q,termsaveFullMth)  - inputs.initialfee * Math.pow(q,termsaveFullMth);
  partialMth = (inputs.termsave - termsaveFullMth) * inputs.interestsave * helper.finalsavings; // accrue terminal amount for partial month
  helper.finalsavings += partialMth;*/

  // total payments
  helper.totalpays = helper.numberpays * inputs.saving;

  // total interest
  helper.totalinterest = helper.finalsavings - helper.totalpays + inputs.initialfee - inputs.initialpay;

  // total loan payment
  helper.totalloanpay = (inputs.paypercent / 100) * inputs.principal;

  // amount loan w/o interest
  helper.totalloan = helper.totalloanpay - helper.finalsavingswohnungsbau;

  // term loan
  helper.termloan = inputs.interestdebt === 0 ? helper.totalloan / (12 * inputs.repay) : Math.log(( inputs.repay / (r * helper.totalloan)) / ((inputs.repay / (r * helper.totalloan)) - 1)) / (12 * Math.log(1 + r));

  // interest loan
  //helper.interestloan = inputs.interestdebt === 0 ? 0 : helper.totalloan * ((Math.pow(1 + r, 12 * helper.termloan)) * (r * 12 * helper.termloan - 1) + 1) / ( Math.pow(1 + r, 12 * helper.termloan) -1);

  // amount loan w interest
  //helper.totalloanwinterest = helper.totalloan + helper.interestloan;

  // "Ansparquote"
  helper.savingratio = (helper.finalsavingswohnungsbau / inputs.principal) * 100;

  // number of loan payments
  helper.totalloanpays = helper.termloan * 12;

  /* ******** 5. COMPUTATIONS LOAN PERIOD ******** */
  jumper = 0;
  var initSaldo = 0, repayHelper = 0; interestHelper = 0;
  terminalLoan = [];
  terminalLoan[2] = 0;
  terminalLoan[3] = 0;

  for(i = 1, y = Math.floor(helper.totalloanpays) + 1; i <= y; i++){

    if (dynloan[6][i-2]) {   // if last iteration was full year such that annual vals should be computed
      dynloan[6][i-1] = false;
      dynloan[7][i-1] = true;  // full year view indicator
      dynloan[0][i-1] = Math.ceil(String(dynloan[0][i-2] / 12)) + '. Jahr';
      dynloan[1][i-1] = dynloan[1][i - Math.min(helper.intoyear(dynloan[0][i-2]), i-1) - 1];
      dynloan[2][i-1] = repayHelper; repayHelper = 0;
      dynloan[3][i-1] = interestHelper; interestHelper = 0;
      dynloan[4][i-1] = 0;  // not used
      dynloan[5][i-1] = dynloan[5][i-2];
      jumper = 1;
    } else {
      (i === 1) ? dynloan[0][i-1] = 1 + terminal[0] : dynloan[0][i-1] = dynloan[0][i-2-jumper] + 1;
      (i === 1) ? dynloan[1][i-1] = terminal[5] + helper.wohnungsbau - helper.totalloanpay : dynloan[1][i-1] = dynloan[5][i-2-jumper];
      dynloan[3][i-1] = dynloan[1][i-1] * (inputs.interestdebt / 12);  // interest
      interestHelper += dynloan[3][i-1];
      terminalLoan[3] += dynloan[3][i-1];
      dynloan[2][i-1] = Math.min(inputs.repay, -(dynloan[1][i-1] + dynloan[3][i-1]));
      terminalLoan[2] += dynloan[2][i-1];
      repayHelper += dynloan[2][i-1];
      //dynloan[4][i-1] = 5;  switched off
      dynloan[5][i-1] = dynloan[1][i-1] + dynloan[2][i-1] + dynloan[3][i-1];
      if(dynloan[0][i-1] % 12 === 0 || y === i){
        dynloan[6][i-1] = true;
        y += 1;
      } else {
        dynloan[6][i-1] = false;
      }
      jumper = 0;
    }
  }

  // transpose dynloan
  dynloanT = dynloan[0].map(function(col,i){
    return dynloan.map(function(row){
      return row[i];
    })
  });

  // attach final rows
  dynloanT.push(['Summen', terminal[5] + helper.wohnungsbau - helper.totalloanpay ,terminalLoan[2], terminalLoan[3],,terminal[5] + helper.wohnungsbau - helper.totalloanpay + terminalLoan[2] + terminalLoan[3] ,,true]);

  // interest loan
  //helper.interestloan = inputs.interestdebt === 0 ? 0 : helper.totalloan * ((Math.pow(1 + r, 12 * helper.termloan)) * (r * 12 * helper.termloan - 1) + 1) / ( Math.pow(1 + r, 12 * helper.termloan) -1);
  helper.interestloan = -terminalLoan[3];

  // amount loan w interest
  //helper.totalloanwinterest = helper.totalloan + helper.interestloan;
  helper.totalloanwinterest = helper.totalloan + helper.interestloan;


  /* ******** 6. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.homesave.id;
  // first result container

  //result._1.finalsavings = _.extend(localElems['finalsavings'],  {"value": helper.finalsavings});
  result._1.finalsavingswohnungsbau = _.extend(localElems['finalsavingswohnungsbau'], {"value": helper.finalsavingswohnungsbau});
  result._1.totalpays               = _.extend(localElems['totalpays'],               {"value": helper.totalpays});
  result._1.totalinterest           = _.extend(localElems['totalinterest'],           {"value": helper.totalinterest});
  result._1.wohnungsbau             = _.extend(localElems['wohnungsbau'],             {"value": helper.wohnungsbau});
  if(inputs.initialpay != 0){ result._1.initialpay               = _.extend(localElems['initialpay'],             {"value": inputs.initialpay}); };
  if(inputs.initialfee != 0){ result._1.initialfee               = _.extend(localElems['initialfee'],             {"value": -inputs.initialfee}); };
  result._1.numberpays              = _.extend(localElems['numberpays'],              {"value": helper.numberpays});
  result._1.savingratio             = _.extend(localElems['savingratio'],             {"value": helper.savingratio});
  result._1.totalloanpay            = _.extend(localElems['totalloanpay'],            {"value": helper.totalloanpay});
  result._1.totalloanwinterest      = _.extend(localElems['totalloanwinterest'],      {"value": helper.totalloanwinterest});
  result._1.totalloan               = _.extend(localElems['totalloan'],               {"value": helper.totalloan});
  result._1.interestloan            = _.extend(localElems['interestloan'],            {"value": helper.interestloan});
  result._1.totalloanpays           = _.extend(localElems['totalloanpays'],           {"value": helper.totalloanpays});
  result._1.termloan                = _.extend(localElems['termloan'],                {"value": helper.termloan});

  // second result container
  // a) saving period
  result._2.title = 'Entwicklung Bausparguthaben';
  result._2.header1 = ['Monat', 'Guthaben Monatsanfang', 'Sparbeitrag', 'Zinsen','Prämien','Guthaben Monatsende'];
  result._2.body = dynT;
  // b) repayment period
  result._2.header2 = ['Monat', 'Saldo Monatsanfang', 'Rückzahlungsrate', 'Zinsen','Prämien','Saldo Monatsende'];
  result._2.body2 = dynloanT;

  return result;
};