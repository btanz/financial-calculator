// * MODULE COLLECTING PROPERTY/REAL ESTATE FUNCTIONS
var helpers = require('./helpers');
var _ = require('underscore');
var calcElems = require('../../data/static/calcElems.json');
var math = require('./math');
var finance = require('./finance');
var f = require('../../lib/finance');




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

  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  helpers.messages.clear();
  helpers.errors.clear();
  var revenuePV, goal, irr, helper = {};
  var cash = [], totals = [], cashHelper;
  var result = {}; result._1 = {}; result._2 = {}; result._chart1 = {};
  var errorMap;
  var effTerm;


  function compute(data){

    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0){
      return errorMap;
    }

    inputs.costDynamic = inputs.costDynamic / 100;
    inputs.revDynamic = inputs.revDynamic / 100;
    helper.adjustedTerm = f.basic.adjustTermToHigherFullPeriod(inputs.term, 12);
    helper.adjustedTermLoan = f.basic.adjustTermToHigherFullPeriod(inputs.termLoan, 12);
    if(helper.adjustedTermLoan !== inputs.termLoan) {helpers.messages.set("Hinweis: Die angegebene Darlehenslaufzeit von " + inputs.termLoan + " ist kein Vielfaches des Zahlungsintervalls (monatlich). Die Darlehenslaufzeit wurde entsprechend auf den nächsten vollen Monat angepasst. Der angepasste Wert beträgt " + Math.round(helper.adjustedTermLoan * 100) / 100 + " Jahre (" + helper.adjustedTermLoan * 12 + " Monate).",2)};
    if(helper.adjustedTerm !== inputs.term) {helpers.messages.set("Hinweis: Die angegebene Anlagedauer von " + inputs.term + " ist kein Vielfaches des Zahlungsintervalls (monatlich). Die Anlagedauer wurde entsprechend auf den nächsten vollen Monat angepasst. Der angepasste Wert beträgt " + Math.round(helper.adjustedTerm * 100) / 100 + " Jahre (" + helper.adjustedTerm * 12 + " Monate).",2)};


    /** ******** 3. COMPUTATIONS ******** */
    // *** 3.A Compute effective interest ***
    revenuePV = function(interest){
      if (interest === inputs.revDynamic) {  // deal with corner case
        return inputs.terminal + (Math.pow(1 + interest, helper.adjustedTerm) * (1 - Math.pow(1 + interest, -1))) / (1 - Math.pow(1 + interest, -1 / 12)) * inputs.revenue * helper.adjustedTerm;
      } else {
        return inputs.terminal + (Math.pow(1 + interest, helper.adjustedTerm) * (1 - Math.pow(1 + interest, -1))) / (1 - Math.pow(1 + interest, -1 / 12)) * inputs.revenue * (1 - Math.pow((1 + inputs.revDynamic) / (1 + interest), helper.adjustedTerm)) / (1 - (1 + inputs.revDynamic) / (1 + interest));
      }
    };


    // define goal function
    goal = function(interest){
      var inflow, outflow;
      // compute PV of revenue
      inflow = revenuePV(interest);
      // compute PV of maintenance costs
      if (interest === inputs.costDynamic) {  // deal with corner case
        inflow -= (Math.pow(1 + interest, helper.adjustedTerm) * (1 - Math.pow(1 + interest, -1))) / (1 - Math.pow(1 + interest, -1 / 12)) * inputs.maintenance * helper.adjustedTerm;
      } else {
        inflow -= (Math.pow(1 + interest, helper.adjustedTerm) * (1 - Math.pow(1 + interest, -1))) / (1 - Math.pow(1 + interest, -1 / 12)) * inputs.maintenance * (1 - Math.pow((1 + inputs.costDynamic) / (1 + interest), helper.adjustedTerm)) / (1 - (1 + inputs.costDynamic) / (1 + interest));
      }

      // compute PV of intial and periodical inflows
      outflow = inputs.equity * Math.pow(1 + interest, helper.adjustedTerm) + inputs.repay * Math.pow(1 + interest,helper.adjustedTerm) * (1-Math.pow(1+interest, -helper.adjustedTermLoan)) / (1-Math.pow(1+interest,-1/12));
      return inflow - outflow;
    };

    // find root of goal function
    irr = (math.roots(goal,0.5)) * 100;

    // sanitize result and print a message of IRR calculation went wrong
    if (!irr || (isNaN(irr))){
      helpers.messages.set("Hinweis: Leider konnte die Rendite (IRR) nicht zuverlässig berechnet werden. Meist ist dies der Fall, wenn die Rendite extrem hoch (> 50 % p.a.) oder extrem niedrig (< -99 % p.a.) ist.",2);
      helper.irrOmit = true;
    };

    // assign result to return object
    helper.irr = irr;

    // *** 3.B. Compute aggregate revenues and costs ***
    helper.sellRevenue = inputs.terminal;
    helper.loan =  (Math.ceil(inputs.termLoan * 12)) * inputs.repay;
    helper.initialInvestment = inputs.equity;


    // *** 3.C. Compute monthly and annual values  / all values b.o.p ***
    cash[0] = []; cash[1] = []; cash[2] = []; cash[3] = []; cash[4] = []; cash[5] = []; cash[6] = []; cash[7] = [];
    totals[7] = [];
    cash[0][0] = 1;
    cash[1][0] = inputs.maintenance;
    cash[7][0] = inputs.maintenance;
    //totals[7] = cash[7][0] * 12;
    totals[7] = (inputs.term - 1 >= 0) ? cash[7][0] * 12 : cash[7][0] * Math.ceil(12 * (inputs.term));
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

    effTerm = Math.max(inputs.term, inputs.termLoan);

    for (var i=1; i < effTerm; i++){
      cash[0][i] = i + 1;                                                                                     // periode
      cash[7][i] = i < inputs.term ? f.basic.round(cash[7][i-1] * (1 + inputs.costDynamic),2) : 0;
      cash[1][i] = cash[7][i];
      cash[2][i] = (inputs.term - i > 1) ? cash[1][i] * 12 : cash[1][i] * Math.ceil(12 * (inputs.term - i));
      cashHelper = i < inputs.termLoan ? inputs.repay : 0;                                                    // debt repayment
      cash[2][i] += (inputs.termLoan - i > 1) ? cashHelper * 12 : cashHelper * Math.ceil(12 * (inputs.termLoan - i));
      cash[1][i] += cashHelper;   // add debt repayment to costs
      cash[3][i] = i < inputs.term ? f.basic.round(cash[3][i-1] * (1 + inputs.revDynamic),2) : 0;
      cash[4][i] = (inputs.term - i > 1) ? cash[3][i] * 12 : cash[3][i] * Math.ceil(12 * (inputs.term - i));
      cash[5][i] = cash[4][i] - cash[2][i];
      cash[6][i] = cash[6][i-1] + cash[5][i];
      totals[0] += cash[2][i]; totals[1] += cash[4][i];
      totals[7] += (inputs.term - i > 1) ? cash[7][i] * 12 : cash[7][i] * Math.ceil(12 * (inputs.term - i));
    }
    totals[2] = - inputs.equity - totals[0] + totals[1] + inputs.terminal;

    // transpose cash array
    helper.cash = cash[0].map(function(col,i){
      return cash.map(function(row){
        return row[i];
      })
    });

    // reduce monthly values to totals
    helper.rentRevenue = _.reduce(cash[4], helpers.add, 0);
    helper.revenue = helper.rentRevenue + inputs.terminal;
    helper.maintenance = totals[7];
    helper.investment = inputs.equity + (Math.ceil(inputs.termLoan * 12)) * inputs.repay + helper.maintenance;
    helper.profit = helper.revenue - inputs.equity - (Math.ceil(inputs.termLoan * 12)) * inputs.repay - helper.maintenance;

    /** ******** 4. CONSTRUCT RESULT OBJECT ******** */

    // first result container
    result.id = data[0].id;
    ['irr','profit','revenue','rentRevenue','sellRevenue','investment','initialInvestment','maintenance','loan'].forEach(function(val) {
      if(val === 'irr' && helper.irrOmit){
      } else {
        result._1[val]   = _.extend(_.findWhere(data[0].results_1,{name: val}),  {'value': helper[val]});
        //result._1[val] = _.extend(localElems[val], {"value": helper[val]});
      }
    });

    // second result container
    result._2.title = 'Zahlungsübersicht';
    result._2.header = ['Jahr', 'Kosten', 'Einnahmen', 'Gewinn'];
    result._2.headersub = ['Mon.', 'Jahr', 'Mon.', 'Jahr', 'Jahr', 'kumuliert'];
    result._2.firstrow = ['Anfangsinvestition von ', ' EUR', helper.initialInvestment, -helper.initialInvestment];
    result._2.lastrow = [' Verkaufs-/Endwert von ', ' EUR', helper.sellRevenue, helper.sellRevenue + cash[6][cash[6].length-1]];
    result._2.body = helper.cash;
    result._2.totalsrow = ['Summe','',totals[0],'',totals[1],totals[2],totals[2]];

    // attach messages
    result.messages = helpers.messages.messageMap;

    // attach chart
    result._chart1.id = 'chart1';
    result._chart1.title = 'Einnahmen und Ausgaben';
    result._chart1.label = {x: '', y: ''};
    result._chart1.type = 'Bar';
    result._chart1.data = {labels: ['Gesamte Einnahmen', 'Gesamte Ausgaben'],
      series: [
        [helper.sellRevenue + helper.rentRevenue, helper.maintenance + helper.loan + helper.initialInvestment]
      ]};
    result._chart1.options = {stackBars: true, seriesBarDistance: 0, classNames:{bar: 'ct-bar-verythick'}, axisY: {offset: 60}};

    return result;

  }

  return Calc.findByCalcname('propertyreturn')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });


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
  result._chart1 = {};
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

  /*
   5.A FIRST RESULT CONTAINER
   */
  result._1.value = _.extend(localElems[selectMap[inputs.select]], {"value": helper});

  /*
   5.B SECOND RESULT CONTAINER
   */
  result._2.title = 'Übersicht Mietentwicklung';
  result._2.header = ['Jahr', 'Monatsmiete', 'Jahresmiete', 'Summe bisher gezahlte Miete'];
  result._2.body = dynT;
  result._2.bodylast = dynLast;

  /*
   5.C FIRST CHART
   */
  var labels1 = dyn[0];
  var series1 = [dyn[2]];
  result._chart1.id = 'chart1';
  result._chart1.title = 'Mietentwicklung';
  result._chart1.label = {x: 'Jahr', y: "Jahresmiete"};
  result._chart1.type = 'Bar';

  if (inputs.term >=75) {  // remove chart if output is way to big
    delete(result._chart1);
  } else if (inputs.term >=40) {  // use slim bars and show only every fourth
    labels1 = labels1.filter(function(val,ind){ return ind % 4 === (Math.floor(inputs.term)-1) % 4});
    series1 = [dyn[2].filter(function(val,ind){ return ind % 4 === (Math.floor(inputs.term)-1) % 4})];
    result._chart1.data = {labels: labels1, series: series1};
    result._chart1.options = {stackBars: false, axisY: {offset: 60}, seriesBarDistance: 6, classNames:{bar: 'ct-bar-slim'}};
  } else if (inputs.term >=25) {  // use slim bars and show only every second
    labels1 = labels1.filter(function(val,ind){ return ind % 2 !== inputs.term % 2});
    series1 = [dyn[2].filter(function(val,ind){ return ind % 2 !== inputs.term % 2})];
    result._chart1.data = {labels: labels1, series: series1};
    result._chart1.options = {stackBars: false, axisY: {offset: 60}, seriesBarDistance: 6, classNames:{bar: 'ct-bar-slim'}};
  } else if (inputs.term >=15){  // use slim bars if more than 20 periods
    result._chart1.data = {labels: labels1, series: series1};
    result._chart1.options = {stackBars: false, axisY: {offset: 60}, seriesBarDistance: 6, classNames:{bar: 'ct-bar-slim'}};
  } else if (inputs.period >=6) {
    result._chart1.data = {labels: labels1, series: series1};
    result._chart1.options = {stackBars: false, axisY: {offset: 60}, seriesBarDistance: 12, classNames:{bar: 'ct-bar'}};
  } else {
    result._chart1.data = {labels: labels1, series: series1};
    result._chart1.options = {stackBars: false, axisY: {offset: 60}, seriesBarDistance: 18, classNames:{bar: 'ct-bar-thick'}};
  }



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
  result._chart1.id = 'chart1';
  result._chart1.title = 'Chart';
  //result._chart1.legend = ['First', 'Second', 'Third']; todo: add legend
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

  /** ******** 1. INIT AND ASSIGN ******** */
  helpers.messages.clear();  helpers.errors.clear();
  var result = {}; result._1 = {}; result._2 = {}; result._chart1 = {}; result._chart2 = {};
  var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = []; dyn[5] = []; dyn[6] = []; dyn[7] = []; dyn[8] = []; dyn[9] = []; var dynT;
  var dynloan = []; dynloan[0] = []; dynloan[1] = []; dynloan[2] = []; dynloan[3] = []; dynloan[4] = []; dynloan[5] = []; dynloan[6] = []; dynloan[7] = []; dynloan[8] = []; dynloan[9] = []; var dynloanT;
  var helper = {}; var q, replacementrate;
  var localElems = calcElems.homesave.results_1;
  var expectedInputs = calcElems.homesave.inputs;
  var errorMap;
  var termsaveFullMth, partialMth, i, j, interestaccum = 0;
  var cfSave = [], cfLoan = [];


  /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  errorMap = helpers.validate(inputs, expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }

  inputs.interestsave /= 100;
  inputs.interestdebt /= 100;

  /** ******** 3. HELPER FUNCTIONS ******** */
  // function that returns the month into the full year for any month; example: intoyear(18) = 6, intoyear(12) = 12
  helper.intoyear = function(month){
    return (month % 12 === 0) * 12 + month % 12;
  };


  /** ******** 4. COMPUTATIONS SAVINGS PERIOD ******** */

  // HELPER VARS
  q = 1 + inputs.interestsave;
  r = inputs.interestdebt / 12;
  replacementrate = inputs.saving * (12 + (11/2)*(q-1));
  termsaveFullMth = Math.ceil(inputs.termsave/(1/12))/12;
  termsaveFullY = Math.floor(termsaveFullMth);

  /** in case savingperiod has been adjusted, inform user */
  if(termsaveFullMth !== inputs.termsave){
    helpers.messages.set("Hinweis: Die angegebene Anspardauer von " + f.basic.round(inputs.termsave,2) + " Jahren ist kein Vielfaches des Einzahlungsintervalls (monatlich). Die Anspardauer wurde entsprechend auf die nächste volle Zahlungsperiode angepasst. Der angepasste Wert beträgt " + f.basic.round(termsaveFullMth,2) + " Jahre (" + f.basic.round(termsaveFullMth * 12,2) + " Monate).",2);
  }


  // DYNAMIC COMPUTATIONS
  interestaccum = 0;  // accumulator for semiperiodical interest PAngV
  var jumper = 0, terminal = [];
  terminal[2] = 0; terminal[3] = 0;
  helper.wohnungsbau = 0;
  for(i = 1, y = termsaveFullMth * 12 + termsaveFullY; i <= y; i++){
    if (dyn[6][i-2]){   // if last iteration was full year such that annual vals should be computed
      dyn[0][i-1] = Math.ceil((i) / 13);
      dyn[1][i-1] = dyn[1][i - helper.intoyear(dyn[0][i-2]) - 1];
      dyn[2][i-1] = inputs.saving * helper.intoyear(dyn[0][i-2]);
      dyn[3][i-1] = dyn[3][i-2];
      dyn[4][i-1] = 0;
      dyn[5][i-1] = dyn[5][i-2];
      dyn[6][i-1] = false;
      dyn[7][i-1] = true;       // special element view indicator (elements such as full year, sums, ect)
      dyn[8][i-1] = ". Jahr";  // unit to be shown in the output table behind time index
      dyn[9][i-1] = true;       // true iff element represents full year value
      jumper = 1;
    } else {
      dyn[7][i-1] = false;  // full year view indicator
      (i === 1) ? dyn[0][i-1] = 1 : dyn[0][i-1] = dyn[0][i-2-jumper] + 1;                                                      // month
      (i === 1) ? dyn[1][i-1] = 0 - inputs.initialfee + inputs.initialpay : dyn[1][i-1] = dyn[5][i-2-jumper];                  // balance bop
      dyn[2][i-1] = inputs.saving;                                              // savings
      /** push savings time and amount value to cfSave */
      cfSave.push([dyn[0][i-1] ,dyn[2][i-1]]);
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
  helper.wohnungsbauent = inputs.income <= (1 + Number(inputs.marriage)) * 25600 ? true : false;   // entitled to 'Wohnungsbauprämie?'
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

  // "Ansparquote"
  helper.savingratio = (helper.finalsavingswohnungsbau / inputs.principal) * 100;

  // number of loan payments
  helper.totalloanpays = helper.termloan * 12;

  /** COMPUTE IRR FOR SAVINGSPERIOD */
  /** add initial special pay */
  cfSave[0][1] += inputs.initialpay;
  /** subtract end value of savings */
  cfSave[cfSave.length - 1][1] -= helper.finalsavingswohnungsbau;
  /** compute irr */
  helper.irrSave = f.basic.irr(0 ,cfSave, 12);
  helper.irrSave = typeof helper.irrSave !== 'undefined' ? helper.irrSave : null;



  /** ******** 5. COMPUTATIONS LOAN PERIOD ******** */
  jumper = 0;
  var initSaldo = 0, repayHelper = 0; interestHelper = 0;
  terminalLoan = [];
  terminalLoan[2] = 0;
  terminalLoan[3] = 0;

  for(i = 1, y = Math.floor(helper.totalloanpays) + 1; i <= y; i++){

    if (dynloan[6][i-2]) {   // if last iteration was full year such that annual vals should be computed
      dynloan[0][i-1] = Math.ceil(dynloan[0][i-2] / 12);
      dynloan[1][i-1] = dynloan[1][i - Math.min(helper.intoyear(dynloan[0][i-2]), i-1) - 1];
      dynloan[2][i-1] = repayHelper; repayHelper = 0;
      dynloan[3][i-1] = interestHelper; interestHelper = 0;
      dynloan[4][i-1] = 0;  // not used
      dynloan[5][i-1] = dynloan[5][i-2];
      dynloan[6][i-1] = false;
      dynloan[7][i-1] = true;       // special element view indicator (elements such as full year, sums, ect)
      dynloan[8][i-1] = ". Jahr";   // unit to be shown in the output table behind time index
      dynloan[9][i-1] = true;       // true iff element represents full year value
      jumper = 1;
    } else {
      (i === 1) ? dynloan[0][i-1] = 1 + terminal[0] : dynloan[0][i-1] = dynloan[0][i-2-jumper] + 1;
      (i === 1) ? dynloan[1][i-1] = terminal[5] + helper.wohnungsbau - helper.totalloanpay : dynloan[1][i-1] = dynloan[5][i-2-jumper];
      dynloan[3][i-1] = dynloan[1][i-1] * (inputs.interestdebt / 12);  // interest
      interestHelper += dynloan[3][i-1];
      terminalLoan[3] += dynloan[3][i-1];
      dynloan[2][i-1] = Math.min(inputs.repay, -(dynloan[1][i-1] + dynloan[3][i-1]));
      /** push repayment time and amount value to cfLoan */
      cfLoan.push([dynloan[0][i-1] - terminal[0] ,dynloan[2][i-1]]);
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


  /** COMPUTE IRR FOR LOANPERIOD */
  helper.irrLoan = f.basic.irr(helper.totalloan ,cfLoan, 12);
  helper.irrLoan = typeof helper.irrLoan !== 'undefined' ? helper.irrLoan : null;

  /** ******** 6. CONSTRUCT RESULT DATA OBJECT ******** */
  result.id = calcElems.homesave.id;
  /**
   * 6.A FIRST RESULT CONTAINER
   */

  //result._1.finalsavings = _.extend(localElems['finalsavings'],  {"value": helper.finalsavings});
  result._1.finalsavingswohnungsbau = _.extend(localElems['finalsavingswohnungsbau'], {"value": helper.finalsavingswohnungsbau});
  result._1.totalpays               = _.extend(localElems['totalpays'],               {"value": helper.totalpays});
  result._1.totalinterest           = _.extend(localElems['totalinterest'],           {"value": helper.totalinterest});
  result._1.wohnungsbau             = _.extend(localElems['wohnungsbau'],             {"value": helper.wohnungsbau});
  if(inputs.initialpay != 0){ result._1.initialpay               = _.extend(localElems['initialpay'],             {"value": inputs.initialpay}); };
  if(inputs.initialfee != 0){ result._1.initialfee               = _.extend(localElems['initialfee'],             {"value": -inputs.initialfee}); };
  result._1.numberpays              = _.extend(localElems['numberpays'],              {"value": helper.numberpays});
  result._1.savingratio             = _.extend(localElems['savingratio'],             {"value": helper.savingratio});
  //if(helper.irrSave !== null){result._1.irrSave = _.extend(localElems['irrsave'],     {"value": helper.irrSave * 100}); };
  if(helper.irrSave !== null && isFinite(helper.irrSave)){result._1.irrSave = _.extend(localElems['irrsave'],     {"value": helper.irrSave * 100}); };
  result._1.totalloanpay            = _.extend(localElems['totalloanpay'],            {"value": helper.totalloanpay});
  result._1.totalloanwinterest      = _.extend(localElems['totalloanwinterest'],      {"value": helper.totalloanwinterest});
  result._1.totalloan               = _.extend(localElems['totalloan'],               {"value": helper.totalloan});
  result._1.interestloan            = _.extend(localElems['interestloan'],            {"value": helper.interestloan});
  result._1.totalloanpays           = _.extend(localElems['totalloanpays'],           {"value": helper.totalloanpays});
  result._1.termloan                = _.extend(localElems['termloan'],                {"value": helper.termloan});
  if(helper.irrLoan !== null && isFinite(helper.irrLoan)){result._1.irrLoan = _.extend(localElems['irrloan'],     {"value": helper.irrLoan * 100}); };

  /**
   * 6.B SECOND RESULT CONTAINER
   */
  // a) saving period
  result._2.title = 'Entwicklung Bausparguthaben';
  result._2.header1 = ['Monat', 'Guthaben Monatsanfang', 'Sparbeitrag', 'Zinsen','Prämien','Guthaben Monatsende'];
  result._2.body = dynT;
  // b) repayment period
  result._2.header2 = ['Monat', 'Saldo Monatsanfang', 'Rückzahlungsrate', 'Zinsen','Prämien','Saldo Monatsende'];
  result._2.body2 = dynloanT;

  /**
   * 6.C FIRST CHART
   */
  var labels1 = [];
  var series1 = []; series1[0] = []; series1[1] = []; series1[2] = [];
  dynT.forEach(function(element, index){
    if(element[9] === true){
    labels1.push(element[0]); series1[0].push(element[1]); series1[1].push(element[2]); series1[2].push(element[3]);
    }
  });

  result._chart1.id = 'chart1';
  result._chart1.title = 'Kapitalentwicklung Ansparphase';
  result._chart1.legend = ['Guthaben Start', 'Sparbeitrag', 'Zins'];
  result._chart1.label = {x: 'Jahr', y: "Endguthaben"};
  result._chart1.type = 'Bar';
  result._chart1.data = {labels: labels1, series: series1};
  result._chart1.options = {stackBars: true, seriesBarDistance: 10};

  /**
   * 6.D SECOND CHART
   */
  var labels2 = [];
  var series2 = []; series2[0] = []; series2[1] = [];
  dynloanT.forEach(function(element, index){
    if(element[9] === true){
      labels2.push(element[0]); series2[0].push(-element[5]); series2[1].push(element[2] + element[3]);
    }
  });

  result._chart2.id = 'chart2';
  result._chart2.title = 'Kapitalentwicklung Rückzahlungsphase';
  result._chart2.legend = ['Restschuld Jahresende', 'Tilgung'];
  result._chart2.label = {x: 'Jahr', y: 'Restschuld Jahresanfang'}
  result._chart2.type = 'Bar';
  result._chart2.data = {labels: labels2, series: series2};
  result._chart2.options = {stackBars: true, seriesBarDistance: 10};



  /** ******** 7. CONSTRUCT RESULT MESSAGES / MESSAGE OBJECT ******** */
  if (helper.totalloan <= 0.004999){  // case where no loan is necessary
    helpers.messages.set("Hinweis: Das Bausparguthaben am Ende der Ansparphase übersteigt die (ggf. um den Auszahlungsprozentsatz adjustierte) Bausparsumme. Daher  wird kein Darlehen gewährt und ein Darlehen ist auch nicht notwendig.",2);
    result._1.totalloanwinterest      = _.extend(localElems['totalloanwinterest'],      {"value": 0});
    delete result._1.totalloan; delete result._1.interestloan; delete result._1.totalloanpays; delete result._1.termloan;
    delete result._2.header2; delete result._2.body2;
  }

  if (helper.savingratio <= 40) {  // case where saving ratio is lt 40 %
    helpers.messages.set("Hinweis: Die Ansparquote liegt unter 40 % und ist damit sehr niedrig. Prüfen Sie, ob das eingegebene Szenario vertragskonform ist. Um die Ansparquote zu erhöhen, können sie zum Beispiel die Bausparsumme vermindern, den Sparbeitrag erhöhen oder die Anspardauer erhöhen.",2);
  }

  if (inputs.interestsave > inputs.interestdebt){
    helpers.messages.set("Hinweis: Der Guthabenzinssatz von " + f.basic.round(inputs.interestsave * 100, 2) + " % liegt über dem Darlehenszinssatz von " + f.basic.round(inputs.interestdebt * 100, 2) + " %. Dies kommt nur in Ausnahmefällen vor, daher überprüfen Sie bitte ob die Zinssätze korrekt sind.",2);
  }

  if (helper.totalloan * (inputs.interestdebt / 12) >= inputs.repay ){
    helpers.errors.set("Realistische Ergebnisse konnten nicht berechnet werden, da die monatliche Zinslast von " + Math.round(helper.totalloan * (inputs.interestdebt / 12) * 100)/100 + " für das Darlehen in diesem Szenario nicht kleiner ist als die Rückzahlungsrate von " + inputs.repay + ". Das Darlehen kann also nicht getilgt werden. Verringern Sie die Bausparsumme bzw. erhöhen Sie den Sparbeitrag, die Rückzahlungsrate oder die Anspardauer.",undefined , true);
    return helpers.errors.errorMap;
  }

  // attach messages
  result.messages = helpers.messages.messageMap;

  return result;
};



/** PROPERTY-BUYRENT function that compares buying vs renting
 * ARGUMENTS XXX todo

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.buyrent = function(inputs) {

  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  var result = {};
  result._1 = {};
  result._2 = {};
  result._3 = {};
  result._chart1 = {};
  var localElems = calcElems.propertybuyrent.results_1;
  var expectedInputs = calcElems.propertybuyrent.inputs;
  var errorMap;
  var temp1, temp2, temp3, temp11, temp12, temp13;
  var helper = {}, i;
  var dyn = [];
  dyn[0] = [];
  dyn[1] = [];
  dyn[2] = [];
  dyn[3] = [];
  dyn[4] = [];
  dyn[5] = [];
  var dynT;
  var dynBuy = [];
  dynBuy[0] = [];
  dynBuy[1] = [];
  dynBuy[2] = [];
  dynBuy[3] = [];
  dynBuy[4] = [];
  dynBuy[5] = [];
  dynBuy[6] = [];
  dynBuy[7] = [];
  dynBuy[8] = [];
  dynBuy[9] = [];
  dynBuy[10] = [];
  dynBuy[11] = [];
  dynBuy[12] = [];
  dynBuy[13] = [];
  dynBuy[14] = [];
  var dynBuyT;

  function compute(data) {
    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0) {
      return errorMap;
    }

    inputs.equityinterest = inputs.equityinterest / 100;
    inputs.debtinterest = inputs.debtinterest / 100;
    inputs.rentdynamic = inputs.rentdynamic / 100;
    inputs.incomedynamic = inputs.incomedynamic / 100;
    inputs.valuedynamic = inputs.valuedynamic / 100;
    inputs.costdynamic = inputs.costdynamic / 100;


    /** ******** 3. COMPUTATIONS ******** */
    /*
     3.A STATIC COMPUTATIONS
     */
    //helper.rentFinalCost = inputs.period * 12 * inputs.rent;
    helper.rentFinalCost = (inputs.dynamics && inputs.rentdynamic !== 0) ? (inputs.rent * 12) * (1 - Math.pow(1 + inputs.rentdynamic, inputs.period)) / (-inputs.rentdynamic) : inputs.rent * 12 * inputs.period;
    helper.rentFinalIncome = (inputs.dynamics && inputs.incomedynamic !== 0) ? (inputs.income * 12) * (1 - Math.pow(1 + inputs.incomedynamic, inputs.period)) / (-inputs.incomedynamic) : inputs.income * 12 * inputs.period;
    //helper.rentAvailableForSaving = (inputs.income - inputs.rent) * inputs.period * 12;
    helper.rentAnnualReplacement = (inputs.income - inputs.rent) * (12 + (13 / 2) * inputs.equityinterest);
    helper.rentAvailableForSavingValue = (inputs.equityinterest === 0) ? helper.rentAnnualReplacement : helper.rentAnnualReplacement * (Math.pow(1 + inputs.equityinterest, inputs.period) - 1) / inputs.equityinterest;


    /*
     3.B DYNAMIC COMPUTATIONS RENT
     */

    for (i = 1; i <= inputs.period; i++) {
      dyn[0][i - 1] = i;                                        // period
      dyn[1][i - 1] = (i === 1) ? inputs.equity : dyn[4][i - 2];   // wealth start
      dyn[2][i - 1] = (inputs.income * 12) * Math.pow(1 + inputs.dynamics * inputs.incomedynamic, i - 1) - (inputs.rent * 12) * Math.pow(1 + inputs.dynamics * inputs.rentdynamic, i - 1);       // surplus income
      temp11 = dyn[1][i - 1];
      temp12 = 0;
      temp13 = 0;
      for (var k = 1; k <= 12; k++) {  // compute 'subannual' interest; this is necessary because wealth may become negative in a month between to years if the rent payments increase more than available income
        temp12 = (inputs.equityinterest / 12) * (temp11 + (inputs.income) * Math.pow(1 + inputs.dynamics * inputs.incomedynamic, i - 1) - (inputs.rent) * Math.pow(1 + inputs.dynamics * inputs.rentdynamic, i - 1));
        temp13 += temp12 >= 0 ? temp12 : 0;
        temp11 += (inputs.income) * Math.pow(1 + inputs.dynamics * inputs.incomedynamic, i - 1) - (inputs.rent) * Math.pow(1 + inputs.dynamics * inputs.rentdynamic, i - 1);
      }
      dyn[3][i - 1] = temp13;
      dyn[4][i - 1] = dyn[1][i - 1] + dyn[2][i - 1] + dyn[3][i - 1];   // wealth end
    }


    // transpose dyn
    dynT = dyn[0].map(function (col, i) {
      return dyn.map(function (row) {
        return row[i];
      })
    });

    // attach final rows
    dynT.push(['&Sigma;', inputs.equity, _.reduce(dyn[2], helpers.add, 0), _.reduce(dyn[3], helpers.add, 0), dyn[4][inputs.period - 1], true]);

    helper.rentFinalInterest = _.reduce(dyn[3], helpers.add, 0);
    helper.rentFinalWealth = inputs.equity + helper.rentFinalIncome + helper.rentFinalInterest - helper.rentFinalCost;
    helper.buyLoan = inputs.price + inputs.priceaddon - inputs.equity;
    helper.buyAnnualLoanPayment = inputs.debtpay * 12;


    /*
     3.C DYNAMIC COMPUTATIONS BUY
     */
    for (i = 1; i <= inputs.period; i++) {
      dynBuy[0][i - 1] = i;                                        // period
      dynBuy[1][i - 1] = (i === 1) ? 0 : dynBuy[11][i - 2];                                                              // money wealth bop
      dynBuy[2][i - 1] = (i === 1) ? inputs.equity - inputs.priceaddon : dynBuy[12][i - 2];                             // total wealth bop
      dynBuy[3][i - 1] = (i === 1) ? helper.buyLoan : dynBuy[6][i - 2];                                                  // residual begin
      dynBuy[4][i - 1] = finance.annualInterestLinear(dynBuy[3][i - 1], 12, inputs.debtinterest, inputs.debtpay);       // annual loan interest
      dynBuy[5][i - 1] = finance.annualAmortizationLinear(dynBuy[3][i - 1], 12, inputs.debtinterest, inputs.debtpay);   // annual loan amortization
      dynBuy[6][i - 1] = finance.annualResidualLinear(dynBuy[3][i - 1], 12, inputs.debtinterest, inputs.debtpay);       // residual end
      dynBuy[7][i - 1] = dynBuy[4][i - 1] + dynBuy[5][i - 1];                                                             // loan payment
      dynBuy[8][i - 1] = (inputs.income * 12) * Math.pow(1 + inputs.dynamics * inputs.incomedynamic, i - 1) - (inputs.maintenance * 12) * Math.pow(1 + inputs.dynamics * inputs.costdynamic, i - 1) - dynBuy[7][i - 1];                                  // annual surplus income
      //dynBuy[9][i-1] = dynBuy[1][i-1] * inputs.equityinterest + ((inputs.income - inputs.maintenance) * (13/2) - ((dynBuy[7][i-1]/12) * 11 / 2)) * inputs.equityinterest;    // interest
      temp1 = 0;
      temp2 = 0;
      temp3 = dynBuy[7][i - 1];
      for (var j = 1; j <= 12; j++) {  // compute 'subannual' interest; this is necessary because the loan payments may end in a month between two years
        temp1 += inputs.income * Math.pow(1 + inputs.dynamics * inputs.incomedynamic, i - 1) - inputs.maintenance * Math.pow(1 + inputs.dynamics * inputs.costdynamic, i - 1);
        temp2 += temp1 >= 0 ? temp1 * (inputs.equityinterest / 12) : 0;
        if (temp3 >= inputs.debtpay) {
          temp1 -= inputs.debtpay;
          temp3 -= inputs.debtpay;
        } else if (temp3 < inputs.debtpay && temp3 > 0) {
          temp1 -= temp3;
          temp3 -= temp3;
        } else {
          temp1 -= 0;
        }
      }
      //dynBuy[9][i-1] = (dynBuy[8][i-1] >= 0) ? dynBuy[1][i-1] * inputs.equityinterest + temp2 : temp2;
      //dynBuy[9][i-1] = dynBuy[1][i-1] * inputs.equityinterest + temp2;
      dynBuy[9][i - 1] = ((dynBuy[8][i - 1] + dynBuy[7][i - 1]) >= 0) ? dynBuy[1][i - 1] * inputs.equityinterest + temp2 : temp2;
      dynBuy[10][i - 1] = inputs.price * (inputs.dynamics) * (Math.pow(1 + inputs.valuedynamic, i) - Math.pow(1 + inputs.valuedynamic, i - 1));  //
      dynBuy[11][i - 1] = dynBuy[1][i - 1] + dynBuy[8][i - 1] + dynBuy[9][i - 1];   // money wealth end
      // other vals for table display
      dynBuy[12][i - 1] = dynBuy[2][i - 1] + dynBuy[5][i - 1] + dynBuy[8][i - 1] + dynBuy[9][i - 1] + dynBuy[10][i - 1];   // total wealth eop

    }


    // transpose dynBuy
    dynBuyT = dynBuy[0].map(function (col, i) {
      return dynBuy.map(function (row) {
        return row[i];
      })
    });

    helper.termloan = Math.log(( inputs.debtpay / ((inputs.debtinterest / 12) * helper.buyLoan)) / ((inputs.debtpay / ((inputs.debtinterest / 12) * helper.buyLoan)) - 1)) / (12 * Math.log(1 + (inputs.debtinterest / 12)));
    helper.buyprice = (inputs.price + inputs.priceaddon);
    helper.buyInterestSave = _.reduce(dynBuy[9], helpers.add, 0);

    helper.buyInterestLoan = _.reduce(dynBuy[4], helpers.add, 0);
    helper.buyIncomeSurplus = _.reduce(dynBuy[8], helpers.add, 0);
    helper.buyPropertyIncrease = _.reduce(dynBuy[10], helpers.add, 0);
    //helper.buyMaintenance = inputs.maintenance * 12 * inputs.period;
    helper.buyMaintenance = (inputs.dynamics && inputs.costdynamic !== 0) ? inputs.maintenance * 12 * (1 - Math.pow(1 + inputs.costdynamic, inputs.period)) / (-inputs.costdynamic) : inputs.maintenance * 12 * inputs.period;
    helper.buyRepay = _.reduce(dynBuy[5], helpers.add, 0);
    helper.buyResidual = -helper.buyLoan + helper.buyRepay;
    helper.buyFinalWealth = inputs.equity - helper.buyprice + helper.buyLoan + helper.rentFinalIncome + helper.buyInterestSave - helper.buyInterestLoan + helper.buyPropertyIncrease - helper.buyMaintenance - helper.buyRepay + helper.buyResidual + inputs.price;

    // attach final rows
    dynBuyT.push(['&Sigma;', helper.buyLoan, inputs.equity - inputs.priceaddon, helper.buyInterestLoan, helper.buyRepay, helper.buyRepay, , _.reduce(dynBuy[8], helpers.add, 0), helper.buyIncomeSurplus, helper.buyInterestSave, helper.buyPropertyIncrease, dynBuy[11][inputs.period - 1], dynBuy[12][inputs.period - 1], dynBuy[12][inputs.period - 1], true]);

    /** ******** 4. CONSTRUCT RESULT DATA OBJECT ******** */
    result.id = data[0].id;
    /*
     6.A FIRST RESULT CONTAINER
     */
    if (helper.buyFinalWealth > helper.rentFinalWealth) {
      result.resultheadline = 'Der <strong>Kauf</strong> einer Immobilie ist über den gewählten Analysezeitraum von ' + inputs.period + ' Jahren die finanziell bessere Alternative. Nach ' + inputs.period + ' Jahren entsteht ein <strong>Vermögensvorteil von ' + Math.round((helper.buyFinalWealth - helper.rentFinalWealth) * 100) / 100 + ' EUR.</strong>';
    } else {
      result.resultheadline = 'Die <strong>Anmietung</strong> ist über den gewählten Analysezeitraum von ' + inputs.period + ' Jahren die finanziell bessere Alternative. Nach ' + inputs.period + ' Jahren entsteht ein <strong>Vermögensvorteil von ' + Math.round((helper.buyFinalWealth - helper.rentFinalWealth) * 100) / 100 + ' EUR.</strong>';
    }


    //result._1.finalsavings = _.extend(localElems['finalsavings'],  {"value": helper.finalsavings});

    result._1.rentFinalWealth = _.extend(_.findWhere(data[0].results_1,{name: 'rentfinalwealth'}), {"value": helper.rentFinalWealth});
    //result._1.rentFinalWealth   = _.extend(localElems['rentfinalwealth'], {"value": helper.rentFinalWealth});
    result._1.rentEquity      = _.extend(_.findWhere(data[0].results_1,{name: 'rentequity'}),  {"value": inputs.equity});
    //result._1.rentEquity        = _.extend(localElems['rentequity'], {"value": inputs.equity});
    result._1.rentFinalIncome      = _.extend(_.findWhere(data[0].results_1,{name: 'rentfinalincome'}),  {"value": helper.rentFinalIncome});
    //result._1.rentFinalIncome   = _.extend(localElems['rentfinalincome'], {"value": helper.rentFinalIncome});
    result._1.rentFinalCost      = _.extend(_.findWhere(data[0].results_1,{name: 'rentfinalcost'}),  {"value": -helper.rentFinalCost});
    //result._1.rentFinalCost     = _.extend(localElems['rentfinalcost'], {"value": -helper.rentFinalCost});
    result._1.rentFinalInterest = _.extend(_.findWhere(data[0].results_1,{name: 'rentfinalinterest'}),  {"value": helper.rentFinalInterest});
    //result._1.rentFinalInterest = _.extend(localElems['rentfinalinterest'], {"value": helper.rentFinalInterest});
    result._1.buyFinalWealth = _.extend(_.findWhere(data[0].results_1,{name: 'buyfinalwealth'}),  {"value": helper.buyFinalWealth});
    //result._1.buyFinalWealth    = _.extend(localElems['buyfinalwealth'], {"value": helper.buyFinalWealth});
    result._1.buyEquity = _.extend(_.findWhere(data[0].results_1,{name: 'buyequity'}),  {"value": inputs.equity});
    //result._1.buyEquity         = _.extend(localElems['buyequity'], {"value": inputs.equity});
    result._1.buyPrice = _.extend(_.findWhere(data[0].results_1,{name: 'buyprice'}),  {"value": -helper.buyprice});
    //result._1.buyPrice          = _.extend(localElems['buyprice'], {"value": -helper.buyprice});
    result._1.buyLoan  = _.extend(_.findWhere(data[0].results_1,{name: 'buyloan'}),  {"value": helper.buyLoan});
    //result._1.buyLoan           = _.extend(localElems['buyloan'], {"value": helper.buyLoan});
    result._1.buyFinalIncome  = _.extend(_.findWhere(data[0].results_1,{name: 'buyfinalincome'}),  {"value": helper.rentFinalIncome});
    //result._1.buyFinalIncome    = _.extend(localElems['buyfinalincome'], {"value": helper.rentFinalIncome});
    result._1.buyInterestSave  = _.extend(_.findWhere(data[0].results_1,{name: 'buyinterestsave'}),  {"value": helper.buyInterestSave});
    //result._1.buyInterestSave   = _.extend(localElems['buyinterestsave'], {"value": helper.buyInterestSave});
    result._1.buyInterestLoan  = _.extend(_.findWhere(data[0].results_1,{name: 'buyinterestloan'}),  {"value": -helper.buyInterestLoan});
    //result._1.buyInterestLoan   = _.extend(localElems['buyinterestloan'], {"value": -helper.buyInterestLoan});
    result._1.buyMaintenance  = _.extend(_.findWhere(data[0].results_1,{name: 'buymaintenance'}),  {"value": -helper.buyMaintenance});
    //result._1.buyMaintenance    = _.extend(localElems['buymaintenance'], {"value": -helper.buyMaintenance});
    result._1.buyRepay  = _.extend(_.findWhere(data[0].results_1,{name: 'buyrepay'}),  {"value": -helper.buyRepay});
    //result._1.buyRepay          = _.extend(localElems['buyrepay'], {"value": -helper.buyRepay});
    result._1.buyResidual  = _.extend(_.findWhere(data[0].results_1,{name: 'buyresidual'}),  {"value": helper.buyResidual});
    //result._1.buyResidual       = _.extend(localElems['buyresidual'], {"value": helper.buyResidual});
    result._1.buyPropValue  = _.extend(_.findWhere(data[0].results_1,{name: 'buypropvalue'}),  {"value": inputs.price + helper.buyPropertyIncrease});
    //result._1.buyPropValue      = _.extend(localElems['buypropvalue'], {"value": inputs.price + helper.buyPropertyIncrease});

    /*
     6.B SECOND RESULT CONTAINER
     */
    // second result container
    result._2.title = 'Vermögensentwicklung Mieten';
    result._2.header = ['Jahr', 'Vermögen Anfang', 'Überschuss Einkommen', 'Zinsertrag', 'Vermögen Ende'];
    result._2.body = dynT;


    /*
     6.C THIRD RESULT CONTAINER
     */
    // second result container
    result._3.title = 'Vermögensentwicklung Kaufen';
    result._3.header = ['Jahr', 'Geldvermögen Anfang', 'Vermögen Anfang', 'Restschuld Anfang', 'Zins Darlehen', 'Tilgung Darlehen', 'Restschuld Ende', 'Zahlung Darlehen', 'Überschuss Einkommen', 'Zinsertrag', 'Wertanstieg Immobilie', 'Vermögen Ende', 'Vermögen Ende'];
    result._3.body = dynBuyT;

    /*
     6.D FIRST CHART
     */
    var labels1 = [];
    var series1 = [];
    series1[0] = [];
    series1[1] = [];

    dynT.forEach(function (element, index) {
      if (element[5] !== true) {
        labels1.push(element[0]);
        series1[0].push(element[4]);
      }
    });
    dynBuyT.forEach(function (element, index) {
      if (element[14] !== true) {
        series1[1].push(element[12]);
      }
    });

    result._chart1.id = 'chart1';
    result._chart1.title = 'Vermögen Mieten vs. Kaufen nach Jahren';
    result._chart1.legend = ['Mieten', 'Kaufen'];
    result._chart1.label = {x: 'Jahr', y: "Stand Vermögen"};
    result._chart1.type = 'Bar';
    result._chart1.data = {labels: labels1, series: series1};
    if (inputs.period >= 20) {  // use slim bars if more than 20 periods
      result._chart1.options = {
        stackBars: false,
        axisY: {offset: 60},
        seriesBarDistance: 6,
        classNames: {bar: 'ct-bar-slim'}
      };
    } else if (inputs.period >= 8) {
      result._chart1.options = {
        stackBars: false,
        axisY: {offset: 60},
        seriesBarDistance: 12,
        classNames: {bar: 'ct-bar'}
      };
    } else {
      result._chart1.options = {
        stackBars: false,
        axisY: {offset: 60},
        seriesBarDistance: 18,
        classNames: {bar: 'ct-bar-thick'}
      };
    }

  return result;

  }

  return Calc.findByCalcname('propertybuyrent')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });

};



/** PROPERTY-PROPERTYPRICE function that computes affordable property price thresholds
 * ARGUMENTS XXX todo: documenation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.propertyprice = function(inputs){

  /* ******** 1. INIT AND ASSIGN ******** */
  helpers.errors.clear();
  var result = {}; result._1 = {}; helper = {};
  var localElems = calcElems.propertyprice.results_1;
  var expectedInputs = calcElems.propertyprice.inputs;
  var _expectedInputs = _.clone(expectedInputs);
  var errorMap;
  var selectMap = [undefined,undefined,'term','initrepay'];

  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  // drop elems that are to be computed
  delete inputs[selectMap[inputs.selection]];
  delete _expectedInputs[selectMap[inputs.selection]];


  errorMap = helpers.validate(inputs, _expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }


  inputs.interest = inputs.interest / 100;
  inputs.notar = inputs.notar / 100;
  inputs.makler = inputs.makler / 100;
  inputs.proptax = inputs.proptax / 100;
  inputs.initrepay = inputs.initrepay / 100;



  /* ******** 3. COMPUTATIONS ******** */
  helper.rate = inputs.rent + inputs.income - inputs.maintenance;
  helper.q = 1 + inputs.interest / 12;

  if(inputs.selection === 2){  // initrepay selected
    helper.loan = (helper.rate * 12) / (inputs.interest + inputs.initrepay);
    helper.term = f.annuity.annuityTerm(helper.loan, helper.rate, inputs.interest, 12);
    helper.term = Math.round(helper.term * 100) / 100;
  } else if (inputs.selection === 3){  // term selected
    helper.qnt = Math.pow(helper.q, 12 * inputs.term);
    helper.loan = (inputs.interest === 0) ? helper.rate * inputs.term * 12 : helper.rate * (helper.qnt - 1) / (helper.qnt * (helper.q- 1));
    helper.initrepay = (12 * helper.rate - helper.loan * inputs.interest) / helper.loan;
  } else {  // sthg wrong
    return;
  }

  helper.term = helper.term || inputs.term;
  helper.initrepay = helper.initrepay || inputs.initrepay;

  helper.interest = helper.term * 12 * helper.rate - helper.loan;
  helper.totalpropcost = inputs.equity + helper.loan;
  helper.maxprice = helper.totalpropcost / (1 + inputs.notar + inputs.makler + inputs.proptax);
  helper.notar = helper.maxprice * inputs.notar;
  helper.makler = helper.maxprice * inputs.makler;
  helper.proptax = helper.maxprice * inputs.proptax;

  helper.totalcost = helper.totalpropcost + helper.interest;


  /* ******** 4. CONSTRUCT RESULT DATA OBJECT ******** */
  result.id = calcElems.propertyprice.id;
  /*
   6.A FIRST RESULT CONTAINER
   */
  result._1.maxprice      = _.extend(localElems['maxprice'],      {"value": helper.maxprice});
  result._1.notar         = _.extend(localElems['notar'],         {"value": helper.notar});
  result._1.makler        = _.extend(localElems['makler'],        {"value": helper.makler});
  result._1.proptax       = _.extend(localElems['proptax'],       {"value": helper.proptax});
  result._1.totalpropcost = _.extend(localElems['totalpropcost'], {"value": helper.totalpropcost});
  result._1.loan          = _.extend(localElems['loan'],          {"value": helper.loan});
  result._1.rate          = _.extend(localElems['rate'],          {"value": helper.rate});
  result._1.term          = _.extend(localElems['term'],          {"value": helper.term});
  result._1.initrepay     = _.extend(localElems['initrepay'],     {"value": helper.initrepay * 100});
  result._1.interest      = _.extend(localElems['interest'],      {"value": helper.interest});
  result._1.totalcost     = _.extend(localElems['totalcost'],     {"value": helper.totalcost});


  /* ******** 5. CONSTRUCT RESULT MESSAGES / MESSAGE OBJECT ******** */
  if (inputs.selection === 2 && inputs.initrepay <= 0){
    helpers.errors.set("Realistische Ergebnisse können nicht berechnet werden, da die anfängliche Tilgungsrate nicht größer als 0 ist. Daher wird der Kredit nicht getilgt. Geben sie eine positive Tilgungsrate ein oder alternativ die Darlehenslaufzeit vor.",undefined , true);
    return helpers.errors.errorMap;
  }

  return result;

};




/** PROPERTY-MORTGAGE function that computes parameters for mortgage loans
 * ARGUMENTS XXX todo: documentation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.mortgage = function(inputs){

  /** ******** 1. INIT AND ASSIGN ******** */
  helpers.messages.clear();
  helpers.errors.clear();
  var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = []; dyn[5] = []; var dynT;
  var result = {}; result._1 = {}; result._2 = {};
  var helper = {};
  var localElems = calcElems.mortgage.results_1;
  var expectedInputs = calcElems.mortgage.inputs;
  var _expectedInputs = _.clone(expectedInputs);
  var errorMap;
  var selectMap = [[undefined, 'repay', 'principal', 'interest', 'initialinterest'],[undefined, 'residual', 'term', 'annualrepay']];
  var messageMap = ['FEHLER','jährlich','halbjährlich','FEHLER','vierteljährlich','FEHLER','FEHLER','FEHLER','FEHLER','FEHLER','FEHLER','FEHLER','monatlich'];
  var i, specialpays;

  /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */

  /** read out term choices and remove choice inputs */
  helper.termperiods = inputs.termperiods;
  helper.repaymentfreetermperiods = inputs.repaymentfreetermperiods;
  delete inputs.termperiods;
  delete inputs.repaymentfreetermperiods;

  /** drop elements that are to be computed from input and expectedinputs object */
  delete inputs[selectMap[0][inputs.select1]];
  delete _expectedInputs[selectMap[0][inputs.select1]];
  delete inputs[selectMap[1][inputs.select2]];
  delete _expectedInputs[selectMap[1][inputs.select2]];

  /** run validation method */
  errorMap = helpers.validate(inputs, _expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }

  /** convert terms with subannual choices to month */
  helper.term = inputs.term / inputs.repayfreq;
  inputs.term              = inputs.term              * 12 / helper.termperiods;
  inputs.repaymentfreeterm = inputs.repaymentfreeterm * 12 / helper.repaymentfreetermperiods;

  /** convert terms that are not period multiples to period multiples and convert back to years*/
  inputs.term              = (Math.ceil( inputs.term              / (12 / inputs.repayfreq)) * (12 / inputs.repayfreq)) / 12;
  inputs.repaymentfreeterm = (Math.ceil( inputs.repaymentfreeterm )) / 12;

  if(helper.term * inputs.repayfreq !== inputs.term){
    helpers.messages.set("Hinweis: Die angegebene Laufzeit der Ratenzahlungen von " + f.basic.round(helper.term * inputs.repayfreq,2) + " ist kein Vielfaches des Zahlungsintervalls der Rate (" + messageMap[inputs.repayfreq] +"). Die Laufzeit wurde entsprechend auf die nächste volle Zahlungsperiode angepasst. Der angepasste Wert beträgt " + f.basic.round(inputs.term,2) + " Jahre (" + f.basic.round(inputs.term * 12,2) + " Monate).",2);
  }


  // todo: send message to user that only full period values are possible (?)


  /** convert percentage values to decimals */
  inputs.disagioamount = inputs.disagioamount / 100;
  inputs.interest = inputs.interest / 100;
  inputs.initalinterest = inputs.initialinterest / 100;
  inputs.followupinterest = inputs.followupinterest / 100;


  /** ******** 3. COMPUTATIONS ******** */


  /**
   * 3.A STATIC COMPUTATIONS
   */

  /** compute repayment rate if not given */
  inputs.repay = inputs.repay || f.annuity.annuityInitialInterest(inputs.principal, inputs.interest , inputs.repayfreq ,inputs.initalinterest);

  /** compute principal if not given */
  inputs.principal = inputs.principal || f.annuity.principalInitialInterest(inputs.repay, inputs.interest , inputs.repayfreq ,inputs.initalinterest);

  /** compute interest rate if not given */
  inputs.interest = inputs.interest || f.annuity.interestInitialInterest(inputs.principal, inputs.repay, inputs.repayfreq, inputs.initalinterest);

  /** compute initial interest if not given */
  inputs.initialinterest = inputs.initialinterest || f.annuity.initialInterest(inputs.principal, inputs.repay, inputs.interest, inputs.repayfreq);


  /**
   * 3.B DYNAMIC COMPUTATIONS
   */

  /** constract array with special repayments */
  specialpays = f.basic.annualpayments(inputs.term * 12 + 1, inputs.annualrepay);

  // todo: write message informing that repay time has been set ti ceil if not a full month
  for (i = 0; i < 30; i++){
    helper.ind = _.find(inputs, function(val, ind){return ind === ('specialrepaymonths' + i);});
    helper.val = _.find(inputs, function(val, ind){return ind === ('specialrepayamount' + i);});
    if(helper.ind && helper.val && helper.ind < specialpays.length){
      specialpays[Math.ceil(helper.ind)] += helper.val;
    } else if (helper.ind && helper.val && helper.ind >= specialpays.length){
      helpers.messages.set("Hinweis: Die Sondertilgung im Monat " + helper.ind + " kann leider nicht berücksichtigt werden, da sie außerhalb der Laufzeit der Rückzahlung liegt.",2);
    }
  }


  /** compute schedule with Term, Paymentfrequency, Annuity, Principal and Interest given; Residual open */
  dyn = f.annuity.schedule.call({
    mode: 1,
    annualvals: true,
    finalvals: true,
    disagio: inputs.disagio,
    disagioamount: inputs.disagioamount,
    fees: inputs.fees,
    feeamount: inputs.feeamount,
    feeupfront: (inputs.feetype === 3),
    principal: inputs.principal,
    term: inputs.term,
    repayfreq: inputs.repayfreq,
    repay: inputs.repay,
    repaymentfree: inputs.repaymentfree,
    repaymentfreeterm: inputs.repaymentfreeterm,
    repaymentfreetype : inputs.repaymentfreetype,
    specialrepay: specialpays,
    interest: inputs.interest
  });



  /** assign residual if not given */
  inputs.residual = inputs.residual || dyn.residual;

  helper.totalrepay     = dyn.totalrepay;
  helper.totalinterest  = dyn.totalinterest;
  helper.totalreduction = dyn.totalreduction;
  helper.totalrepaymentfreeinterest = dyn.totalrepaymentfreeinterest;
  helper.irr            = dyn.irr;


  /** re-convert */
  inputs.interest        *= 100;
  inputs.initialinterest *= 100;


  /** ******** 4. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.mortgage.id;

  /**
   * 4.A FIRST RESULT CONTAINER
   */
  result._1.value1         = _.extend(localElems[selectMap[0][inputs.select1]], {"value": inputs[selectMap[0][inputs.select1]]});
  result._1.value2         = _.extend(localElems[selectMap[1][inputs.select2]], {"value": inputs[selectMap[1][inputs.select2]]});
  result._1.totalrepay     = _.extend(localElems['totalrepay'],                 {"value": helper.totalrepay});
  result._1.totalreduction = _.extend(localElems['totalreduction'],             {"value": helper.totalreduction});
  result._1.totalinterest  = _.extend(localElems['totalinterest'],              {"value": helper.totalinterest});
  (inputs.repaymentfree && inputs.repaymentfreetype === 3) ? result._1.repaymentfreetotal = _.extend(localElems['repaymentfreetotal'],     {"value": helper.totalrepaymentfreeinterest}) : null;
  (inputs.disagio) ? result._1.disagio = _.extend(localElems['disagio'],      {"value": inputs.principal * inputs.disagioamount}) : null;
  (inputs.fees && inputs.feetype === 3) ? result._1.fees = _.extend(localElems['fees'],{"value": inputs.feeamount}) : null;
  result._1.irr            = _.extend(localElems['irr'],                        {"value": helper.irr * 100});


  /**
   * 4.B SECOND RESULT CONTAINER
   */
  result._2.title = 'Tilgungsplan';
  result._2.header = ['Monat', 'Restschuld <br> Beginn', 'Rate', 'Zins- & <br> Gebührenanteil', 'Tilgungsanteil', 'Restschuld <br> Ende'];
  result._2.body = dyn.schedule;


  /** ******** 5. ATTACH INFORMATION MESSAGES ******** */
  if (inputs.interest < 0  && inputs.select1 === 3) {  // case where interest is negativ
    helpers.messages.set("Hinweis: Der berechnete Zinssatz ist negativ. Dies kommt nur in Ausnahmefällen vor. Bitte prüfen Sie, ob alle Eingaben korrekt sind.",2);
  }
  if (inputs.initialinterest < 0  && inputs.select1 === 4) {  // case where initialinterest is negativ
    helpers.messages.set("Hinweis: Die berechnete anfängliche Tilgung ist negativ. Dies kommt nur in Ausnahmefällen vor. Bitte prüfen Sie, ob alle Eingaben korrekt sind.",2);
  }


  result.messages = helpers.messages.messageMap;


  // todo add a message that periods are adjusted to next full period

  return result;

};