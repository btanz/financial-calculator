var _ = require('underscore');
var validator = require('validator');
var helpers = require('./helpers');
var math = require('./math');
var misc = require('./misc');
var calcElems = require('../data/static/calcElems.json');
var f = require('../lib/finance');


exports.annuity = function(inputs){
  // todo: proper testing and debugging for this function


  /* ******** 1. INIT AND ASSIGN ******** */
  var helper = {}, helper1;
  var result = {}; result._1 = {}; result._2 = {};
  var localElems = calcElems.annuity.results_1;
  var expectedInputs = calcElems.annuity.inputs;
  var _expectedInputs = _.clone(expectedInputs);
  var errorMap;
  var selectMap = ['repay','residual','term','rate','principal'];
  var paymentfreeinterest = 0;
  var repaymentFreeNPVind = 0;
  var cash = [], cashAnnual = [], sum = [], cashT;
  var remaining;
  var i, j = 0, oddPeriodFlag = false, year;


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  // drop elems that are to be computed form input and expectedinputs object
  delete inputs[selectMap[inputs.select]];
  delete _expectedInputs[selectMap[inputs.select]];


  // run validations
  errorMap = helpers.validate(inputs, _expectedInputs);
  if (errorMap.length !== 0){
    console.log(errorMap);
    return errorMap;
  }

  // assign to local shortcuts for convenience
  var principal = inputs.principal;
  var npvprincipal = inputs.principal;  // principal for use effective interest rate calculation
  var initprincipal = inputs.principal;
  var feeamount = inputs.feeamount;
  var repaymentfreeterm = inputs.repaymentfreeterm;
  var r = inputs.rate / 100;
  var disagioamount = inputs.disagioamount;
  var term = inputs.term;
  var repay = inputs.repay;
  var residual = inputs.residual;
  var periods = inputs.repayfreq; // period setter; 12 for months; 4 for quarter; 1 for year

  // add fees to final rate
  if (inputs.fees){  // check whether fee input is set to true by user
    if(!validator.isFloat(feeamount)){  // check whether a valid fee amount input is set
      console.log('fee input error');
      return null;
    } else { // ready to compute...
      if(inputs.feetype === 2){ // add fees to principal
        principal = principal + feeamount;
      } else if(inputs.feetype === 3 ) { // add fees to NPVprincipal
        npvprincipal = npvprincipal - feeamount;
      }
    }
  } else { // set to default
    feeamount = 0;
  }

  // deal with 'tilgungsfreie Zeit' interests to be added to final rate
  if (inputs.repaymentfree) {  // check whether 'tilgungsfreie zeit' input is set to true by user
    if(!validator.isFloat(repaymentfreeterm)){  // check whether a valid time period input is provided
      console.log('interestfreeperiod input error');
      return null;
    } else {  // ready to compute
      if(inputs.repaymentfreetype === 2){ // add fees to principal
        paymentfreeinterest = principal * Math.pow(1 + r / periods, repaymentfreeterm * periods) - principal;
        principal = principal + paymentfreeinterest;
        // todo: resolve calc issue when interestfreeperiod is present and r is the goal of the calculation; then, r is not defined
      } else if (inputs.repaymentfreetype === 3) {
        repaymentFreeNPVind = 1;
      }
    }
  } else { // set to default
    paymentfreeinterest = 0;
    repaymentfreeterm = 0;
  }

  // deal with disagio
  if (inputs.disagio) {  // check whether disagio input is set to true by user
    if(!validator.isFloat(disagioamount)) {  // check whether a (in)valid disagio amount input is provided
      console.log('disagio input error');
      return null;
    } else {
      disagioamount = disagioamount / 100;
      npvprincipal = npvprincipal - initprincipal * disagioamount;
    }
  } else {
    disagioamount = 0;
  }


  /* ******** 3. DEFINE LOCAL HELPER FUNCTIONS ******** */
  function PV(r){
    var pv, q;
    q = 1 + r;
    // OLD WORKED pv = ((1-Math.pow(Math.pow(1/q,1/1),term*periods)))/(1-Math.pow(1/q,1/1)) * repay * Math.pow(Math.pow(1/q,1/1),1+repaymentfreePeriod*periods) + residual/Math.pow(q,((term + repaymentfreePeriod)*periods))- principal;
    //pv = ((1-Math.pow(Math.pow(1/q,1/1),term*periods)))/(1-Math.pow(1/q,1/1)) * repay * Math.pow(Math.pow(1/q,1/1),1+repaymentfreePeriod*periods) + residual/Math.pow(q,((term + repaymentfreePeriod)*periods))- principal+repaymentFreeNPVind * ((1-Math.pow(Math.pow(1/q,1/periods),periods*repaymentfreePeriod))/(1-Math.pow(1/q,1/periods)))*Math.pow(1/q,1/periods)*q/periods*(npvPrincipal+feeAmount+ initPrincipal * disagioAmount)
    pv = ((1-Math.pow(Math.pow(1 / q,1/1),term * periods)))/(1-Math.pow(1/q,1/1)) * repay * Math.pow(Math.pow(1/q,1/1), 1 + repaymentfreeterm * periods) + residual / Math.pow(q,((term + repaymentfreeterm) * periods))- principal + repaymentFreeNPVind * ((1-Math.pow(Math.pow(1/q,1/1),periods * repaymentfreeterm))/(1-Math.pow(1/q,1/1)))*Math.pow(1/q,1/1)*(q-1)/1*(npvprincipal+feeamount+ initprincipal * disagioamount)
    return pv;
  }

  function NPV(r){
    var npv, q;
    q = 1 + r;
    npv = ((1-Math.pow(Math.pow(1/q,1/periods),term * periods)))/(1-Math.pow(1/q,1/periods)) * repay * Math.pow(Math.pow(1/q,1/periods),1+repaymentfreeterm * periods) + residual/Math.pow(q,(term + repaymentfreeterm)) - npvprincipal + repaymentFreeNPVind * ((1-Math.pow(Math.pow(1/q,1/periods),periods * repaymentfreeterm))/(1-Math.pow(1/q,1/periods)))*Math.pow(1/q,1/periods)*r/periods*(npvprincipal+feeamount+ initprincipal * disagioamount);
    return npv;
  }

  /* ******** 4. COMPUTATIONS ******** */
  // 4A. NON-PERIODICAL CALCULATIONS
  // 4A.1. REPAYMENT
  if (inputs.select === 0){
    helper.result = ((residual - principal * Math.pow(1 + r/periods,term * periods)) * r / periods)/(1-Math.pow(1 + r / periods, term * periods));
    repay = helper.results;
  // 4A.2. RESIDUAL/RESTSCHULD
  } else if (inputs.select === 1) {
    helper.result = principal * Math.pow(1+r/periods,term*periods) + repay * (1-Math.pow(1+r/periods,term*periods))/(r/periods);
    residual = helper.residual;
  // 4A.3. TERM
  } else if (inputs.select === 2) {
    helper.result = Math.log((residual * r/periods - repay) / (principal * r/periods - repay)) / Math.log(1 + r / periods) / periods;
    term = helper.result;
  // 4A.4. RATE
  } else if (inputs.select === 3) {
    helper.result = math.roots(PV,0.01,1500);
    helper.result = helper.result * 100 * periods;
    r = helper.result / 100;
    // adjust "tilgungsfreie Zeit"
    if(inputs.repaymentfreetype === 2){
      principal = principal * Math.pow(1+r/periods,repaymentfreeterm * periods);
    }
  // 4A.5. PRINCIPAL
  } else if (inputs.select === 4) {
    helper.result = residual / Math.pow(1+r / periods, term * periods) - repay * (1-Math.pow(1+ r / periods, term * periods))/(r / periods * Math.pow(1 + r/periods, term * periods));
    principal = helper.result;
    helper1 = principal;

    if(inputs.repaymentfree && inputs.repaymentfreetype === 2) { // deduct interestfree period interest
      helper1 = helper1 / Math.pow(1 + r / periods,repaymentfreeterm * periods);
      paymentfreeinterest = principal - helper1;
    }
    if(inputs.fees && inputs.feetype === 2) { // deduct fees
      helper1 = helper1 - feeamount;
    }

    initprincipal = helper1;

    // set value for effective rate calculation
    npvprincipal = helper1;
    if(inputs.repaymentfree && inputs.repaymentfreetype === 3) { // deduct interestfree period interest
      //npvPrincipal = npvPrincipal / Math.pow(1 + interest / periods, repaymentfreePeriod * periods);
      //paymentfreeInterest = principal - npvPrincipal;
      repaymentFreeNPVind = 1;
    }
    if(inputs.disagio && validator.isFloat(disagioamount)) {
      npvprincipal = npvprincipal - npvprincipal * disagioamount;
    }
    if(inputs.fees && inputs.feetype === 3) { // deduct fees
      npvprincipal = npvprincipal - feeamount;
    }
  }

  // 4B. PERIODICAL CALCULATIONS
  // construct cash flow series
  cash[0] = []; cash[1] = []; cash[2] = []; cash[3] = []; cash[4] = []; cash[5] = []; cash[6] = []; cash[7] = []; cash[8] = [];
  cashAnnual[0] = []; cashAnnual[1] = []; cashAnnual[2] = []; cashAnnual[3] = []; cashAnnual[4] = []; cashAnnual[5] = [];
  cashAnnual[1][0] = 0; cashAnnual[2][0] = 0; cashAnnual[3][0] = 0; cashAnnual[4][0] = 0; cashAnnual[5][0] = 0;
  cash[0][0] = 12/periods;           // time period
  cash[1][0] = principal;   // residual b.o.p.
  cash[2][0] = repay;       // repayment e.o.p.
  cash[3][0] = cash[1][0] * (r/periods);  // interest share repayment
  cash[4][0] = repay - cash[3][0];  // repayment share repayment
  cash[5][0] = cash[1][0] - cash[2][0] + cash[3][0];  // residual e.o.p
  cash[6][0] = cash[2][0];  // sum of all repayments at given period ytd
  cash[7][0] = cash[3][0];  // sum of all interest shares at given period ytd
  cash[8][0] = cash[4][0];  // sum of all repayment shares at given period ytd
  sum[1] = cash[1][0]; sum[2] = cash[2][0]; sum[3] = cash[3][0]; sum[4] = cash[4][0]; sum[5] = cash[5][0];
  remaining = term * periods;

  // precompute annual values first year
  if(periods===1){
    cashAnnual[0][0] = 'Gesamt Jahr 1';
    cashAnnual[1][0] = cash[1][0];
    cashAnnual[2][0] = cash[6][0];
    cash[6][0] = 0; // reset
    cashAnnual[3][0] = cash[7][0];
    cash[7][0] = 0; // reset
    cashAnnual[4][0] = cash[8][0];
    cash[8][0] = 0; // reset
    cashAnnual[5][0] = cash[5][0];
  }
  // end precompute annual values first year
  for (i=1; i < term*periods; i++){
    remaining -= 1; j +=1;
    cash[0][i] = (i + 1)*12/periods;
    cash[1][i] = cash[5][i-1];
    cash[2][i] = repay;
    cash[3][i] = cash[1][i] * (r/periods);
    cash[4][i] = repay - cash[3][i];
    cash[5][i] = cash[1][i] - cash[2][i] + cash[3][i];
    cash[6][i] = cash[6][i-1] + cash[2][i];
    cash[7][i] = cash[7][i-1] + cash[3][i];
    cash[8][i] = cash[8][i-1] + cash[4][i];
    if(remaining < 1){ // this means we are in the last iteration with a fractional period (i.e. 4.4, 6.1 years)
      oddPeriodFlag = true;
      cash[0][i] = (term * 12).toFixed(2);
      cash[3][i] = cash[1][i] * (r/periods);
      cash[4][i] = cash[1][i] - residual;
      cash[2][i] = cash[3][i] + cash[4][i];
      cash[5][i] = cash[1][i] - cash[2][i] + cash[3][i];
      cash[6][i] = cash[6][i-1] + cash[2][i];
      cash[7][i] = cash[7][i-1] + cash[3][i];
      cash[8][i] = cash[8][i-1] + cash[4][i];
      /*
       cash[2][i] = repay * remaining;
       cash[3][i] = cash[1][i] * (interest/periods)*remaining + cash[2][i]*interest*interest*(Math.max(remaining-1,1-remaining)) + cash[2][i]*interest*interest*interest*(Math.max(remaining-1,1-remaining)) + cash[2][i]*interest*interest*interest*interest*(Math.max(remaining-1,1-remaining)) ;
       cash[4][i] = cash[2][i] - cash[3][i];
       cash[5][i] = cash[1][i] - cash[2][i] + cash[3][i];
       cash[6][i] = cash[6][i-1] + cash[2][i];
       cash[7][i] = cash[7][i-1] + cash[3][i];
       cash[8][i] = cash[8][i-1] + cash[4][i];*/
    }
    //sum[1] += cash[1][i];
    sum[2] += cash[2][i];
    sum[3] += cash[3][i];
    sum[4] += cash[4][i];
    sum[5] = cash[5][i];

    // compute annual values
    if(cash[0][i]%12 === 0){
      j=0; // rest counter for number of periods since last year
      year = cash[0][i]/12;
      cashAnnual[0][year-1] = 'Gesamt Jahr ' + year;
      cashAnnual[1][year-1] = cash[1][i-periods+1];
      cashAnnual[2][year-1] = cash[6][i];
      cash[6][i] = 0; // reset
      cashAnnual[3][year-1] = cash[7][i];
      cash[7][i] = 0; // reset
      cashAnnual[4][year-1] = cash[8][i];
      cash[8][i] = 0; // reset
      cashAnnual[5][year-1] = cash[5][i];
    } else if (i+1 === term*periods || remaining < 1){
      year = Math.ceil(cash[0][i]/12);
      cashAnnual[0][year-1] = 'Gesamt Jahr ' + year;
      cashAnnual[1][year-1] = cash[1][i-j+1];
      cashAnnual[2][year-1] = cash[6][i];
      cash[6][i] = 0; // reset
      cashAnnual[3][year-1] = cash[7][i];
      cash[7][i] = 0; // reset
      cashAnnual[4][year-1] = cash[8][i];
      cash[8][i] = 0; // reset
      cashAnnual[5][year-1] = cash[5][i];
    }
  }

  if(inputs.disagio){
    sum[2] += disagioamount * principal;
    sum[3] += disagioamount * principal;
  }

  if(inputs.fees && inputs.feetype === 3){
    sum[2] += feeamount;
    sum[3] += feeamount;
  }


  // compute effective interest rate
  helper.irr = math.roots(NPV,0.01,1500);
  helper.irr = helper.irr * 100;

  // transpose cash
  cashT = cash[0].map(function(col,i){
    return cash.map(function(row){
      return row[i];
    })
  });


  /* ******** 5. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.annuity.id;
  // first result container
  result._1.value = _.extend(localElems[selectMap[inputs.select]], {"value": helper.result});
  result._1.irr = _.extend(localElems.irr, {"value": helper.irr});

  // second result container
  result._2.title = 'Tilgungsplan';
  result._2.header = ['Monat', 'Restschuld <br> Beginn', 'Rate', 'Zinsanteil', 'Tilgungsanteil', 'Restschuld <br> Ende'];
  result._2.body = cashT;




  return result;
};



exports.dispo = function(inputs){

  /* ******** 1. INIT AND ASSIGN ******** */
  var result = {}; result._1 = {};
  var amount, interest, factor, daycount, range;
  var localElems = calcElems.dispo.results_1;
  var expectedInputs = calcElems.dispo.inputs;
  var errorMap;

  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */

  // run validations
  errorMap = helpers.validate(inputs, expectedInputs);
  if (errorMap.length !== 0){
    console.log(errorMap);
    return errorMap;
  }

  // custom validation
  if (inputs.periodchoice === "dates" && inputs.enddate === ""){
    return [{errorMessage: 'Das Enddatum muss ausgefüllt sein.', errorInput: '', errorPrint: true}];
  } else if (inputs.periodchoice === "dates" && inputs.startdate === ""){
    return [{errorMessage: 'Das Anfangsdatum muss ausgefüllt sein.', errorInput: '', errorPrint: true}];
  }else if(inputs.periodchoice === "dates" && inputs.enddate < inputs.startdate){
    return [{errorMessage: 'Das Enddatum kann nicht vor dem Anfangsdatum liegen.', errorInput: '', errorPrint: true}];
  }


  /* ******** 3. COMPUTATIONS ******** */
  factor = Math.min(inputs.principal, inputs.limit) * (inputs.dispointerest / 100) + Math.max(0,inputs.principal - inputs.limit) * (inputs.otherinterest / 100);

  if (inputs.periodchoice === "days"){
    switch(inputs.daycount){
      case "a30E360":
        amount = factor * inputs.days / 360;
        interest = (amount / inputs.principal) * (360 / inputs.days) * 100;
        break;
      case "a30360":
        amount = factor * inputs.days / 360;
        interest = (amount / inputs.principal) * (360 / inputs.days) * 100;
        break;
      case "act360":
        amount = factor * inputs.days / 360;
        interest = (amount / inputs.principal) * (360 / inputs.days) * 100;
        break;
      case "act365":
        amount = factor * inputs.days / 365;
        interest = (amount / inputs.principal) * (365 / inputs.days) * 100;
        break;
      case "actact":
        amount = factor * inputs.days / 365.25;
        interest = (amount / inputs.principal) * (365.25 / inputs.days) * 100;
        break;
    }
  } else if (inputs.periodchoice === "dates"){
    range = {"begindate": inputs.startdate, "enddate": inputs.enddate, "skipvalidation": true};

    daycount = misc.daycount(range);
    switch(inputs.daycount){
      case "a30E360":
        amount = factor * daycount._1.a30E360factor.value;
        interest = (amount / inputs.principal) * (360 / daycount._1.a30E360interestdays.value) * 100;
        break;
      case "a30360":
        amount = factor * daycount._1.a30360factor.value;
        interest = (amount / inputs.principal) * (360 / daycount._1.a30360interestdays.value) * 100;
        break;
      case "act360":
        amount = factor * daycount._1.act360factor.value;
        interest = (amount / inputs.principal) * (360 / daycount._1.act360interestdays.value) * 100;
        break;
      case "act365":
        amount = factor * daycount._1.act365factor.value;
        interest = (amount / inputs.principal) * (365 / daycount._1.act365interestdays.value) * 100;
        break;
      case "actact":
        amount = factor * daycount._1.actactfactor.value;
        interest = (amount / inputs.principal) * (1 / daycount._1.actactfactor.value) * 100;
        break;
    }
  }


  /* ******** 5. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.dispo.id;
  result._1.interestamount  = _.extend(localElems.interestamount,  {"value": amount});
  result._1.averageinterest = _.extend(localElems.averageinterest, {"value": interest});

  return result;


};





/** DEBT-REPAYSURROGATE function that checks whether it is more attractive to safe and pay back
 * a loan in full at the end of the term or pay back annuities
 * ARGUMENTS XXX todo: documenation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.repaysurrogat = function(inputs){

  /* ******** 1. INIT AND ASSIGN ******** */
  helpers.messages.clear();
  helpers.errors.clear();


  var result = {}; result._1 = {}; result._2 = {}; helper = {};
  var i;
  var localElems = calcElems.repaysurrogat.results_1;
  var expectedInputs = calcElems.repaysurrogat.inputs;
  var _expectedInputs = _.clone(expectedInputs);
  var errorMap;
  var selectMap = [undefined,undefined,'initrepay','term','repay'];
  var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = []; dyn[5] = []; dyn[6] = []; dyn[7] = []; dyn[8] = []; dyn[9] = [];
  var dynT, dynAnnual, dynAnnualT;


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  // drop elems that are to be computed
  if(inputs.selection === "2"){
    delete inputs['term']; delete _expectedInputs['term'];
    delete inputs['repay']; delete _expectedInputs['repay'];
  } else if(inputs.selection === "3") {
    delete inputs['initrepay']; delete _expectedInputs['initrepay'];
    delete inputs['repay']; delete _expectedInputs['repay'];
  } else if(inputs.selection === "4") {
    delete inputs['initrepay']; delete _expectedInputs['initrepay'];
    delete inputs['term']; delete _expectedInputs['term'];
  } else {  // sthg wrong
    return;
  }

  if(inputs.taxes === 'false'){
    delete inputs['taxrate'];
    delete inputs['taxfree'];
    delete inputs['taxtime'];
    delete _expectedInputs['taxrate'];
    delete _expectedInputs['taxfree'];
    delete _expectedInputs['taxtime'];
  }

  errorMap = helpers.validate(inputs, _expectedInputs);
  if (errorMap.length !== 0){
    return errorMap;
  }

  inputs.debtinterest = inputs.debtinterest / 100;
  inputs.initrepay = inputs.initrepay / 100;
  inputs.saveinterest = inputs.saveinterest / 100;
  inputs.taxrate = inputs.taxrate / 100;

  var taxend = (inputs.taxtime === 'true') ? true : false;


  /* ******** 3. COMPUTATIONS ******** */
  /*
   * 3.A STATIC CALCULATIONS
   */
  if (inputs.selection === 4){
    helper.term = f.annuity.annuityTerm(inputs.principal, inputs.repay, inputs.debtinterest, inputs.interval);
    if(isNaN(helper.term)){
      helpers.errors.set("Realistische Ergebnisse können nicht berechnet werden, da die Darlehenszahlungen zu gering sind, um das Darlehen zu tilgen. Erhöhen Sie die Darlehensrate und/oder das Zahlungsintervall bzw. verringern Sie den Darlehensbetrag.", undefined , true);
      return helpers.errors.errorMap;
    }
    helper.term = Math.round(helper.term * 100) / 100;
    helper.adjustedterm = f.basic.adjustTermToHigherFullPeriod(helper.term, inputs.interval);
    helper.annuity = inputs.repay;
    helper.totalcost = helper.adjustedterm * inputs.interval * helper.annuity;
    helper.debtinterest = inputs.principal * inputs.debtinterest * helper.adjustedterm;
    helper.repaysubstitute = helper.totalcost - helper.debtinterest;
    helper.repayrate = (inputs.interval * helper.annuity - inputs.principal * inputs.debtinterest) / inputs.principal;
  } else if (inputs.selection === 3){
    helper.adjustedterm = f.basic.adjustTermToLowerFullPeriod(helper.term, inputs.interval);
    helper.annuity = Math.round(100 * f.annuity.annuity(inputs.principal, inputs.debtinterest, inputs.interval, helper.adjustedterm)) / 100;
    helper.totalcost = helper.adjustedterm * inputs.interval * helper.annuity;
    helper.debtinterest = inputs.principal * inputs.debtinterest * helper.adjustedterm;
    helper.repaysubstitute = helper.totalcost - helper.debtinterest;
    helper.repayrate = (inputs.interval * helper.annuity - inputs.principal * inputs.debtinterest) / inputs.principal;
  } else if (inputs.selection === 2){
    helper.annuity = Math.round(100 * ((inputs.initrepay * inputs.principal + inputs.principal * inputs.debtinterest) / inputs.interval)) / 100;
    helper.term = f.annuity.annuityTerm(inputs.principal, helper.annuity, inputs.debtinterest, inputs.interval);
    if(isNaN(helper.term)){
      helpers.errors.set("Realistische Ergebnisse können nicht berechnet werden, da der Tilgungssatz zu gering ist, um das Darlehen zu tilgen. Bitte erhöhen Sie den Tilgungssatz.", undefined , true);
      return helpers.errors.errorMap;
    }
    helper.term = Math.round(helper.term * 100) / 100;
    helper.adjustedterm = f.basic.adjustTermToHigherFullPeriod(helper.term, inputs.interval);
    helper.totalcost = helper.adjustedterm * inputs.interval * helper.annuity;
    helper.debtinterest = inputs.principal * inputs.debtinterest * helper.adjustedterm;
    helper.repaysubstitute = helper.totalcost - helper.debtinterest;
    helper.repayrate = (inputs.interval * helper.annuity - inputs.principal * inputs.debtinterest) / inputs.principal;
  } else { //sthg wrong
    return
  }

  console.log(inputs);



  /*
   * 3.B DYNAMIC CALCULATIONS
   */
  var period = 1, year = 1;
  var escape = false;
  var accum = [0,0,0,0,0,0,0,0,0,0];
  for (i = 1; period <= helper.adjustedterm * inputs.interval; i++){
    if (escape){
      dyn[0][i-1] = year;
      dyn[1][i-1] = accum[1];
      dyn[2][i-1] = accum[2];
      dyn[3][i-1] = accum[3];
      dyn[4][i-1] = accum[4];
      if(taxend) {
        dyn[9][i-1] = dyn[9][i-2];
        dyn[5][i-1] = dyn[5][i-2] + dyn[4][i-1];
        dyn[6][i-1] = - inputs.principal + dyn[5][i-1];
      } else {
        dyn[9][i-1] = (dyn[4][i - 1] > inputs.taxfree) ? -(dyn[4][i - 1] - inputs.taxfree) * inputs.taxrate : 0;
        dyn[5][i-1] = dyn[5][i-2] + dyn[4][i-1] + dyn[9][i-1];
        dyn[6][i-1] = - inputs.principal + dyn[5][i-1];
      }
      dyn[7][i-1] = true;   // annual val indicator
      dyn[8][i-1] = ". Jahr";

      escape = false; year += 1;
      accum[0] = 0; accum[1] = 0; accum[2] = 0; accum[3] = 0; accum[4] = 0; accum[5] = 0;
    } else {
      dyn[0][i-1] = period * (12/inputs.interval);        // period
      dyn[1][i-1] = inputs.principal * (inputs.debtinterest / inputs.interval);   // interest payment
      dyn[2][i-1] = helper.annuity - dyn[1][i-1]   // repay surrogat
      dyn[3][i-1] = helper.annuity;
      //dyn[4][i-1] = (period-1) * dyn[2][i-1] * inputs.saveinterest / inputs.interval;      // interest received
      (i === 1) ? dyn[5][i-1] = dyn[2][i-1] : dyn[5][i-1] = dyn[5][i-2] + dyn[2][i-1];
      (i === 1) ? dyn[4][i-1] = 0 : dyn[4][i-1] = dyn[5][i-2] * inputs.saveinterest / inputs.interval;
      dyn[6][i-1] = -inputs.principal + dyn[5][i-1];

      // accumulate periodical vals
      accum[1] += dyn[1][i-1];
      accum[2] += dyn[2][i-1];
      accum[3] += dyn[3][i-1];
      accum[4] += dyn[4][i-1];
      accum[9] += dyn[4][i-1];
      if(taxend){
        dyn[9][i-1] = - Math.max(0,(accum[9]-inputs.taxfree) * inputs.taxrate);
      } else {
        dyn[9][i-1] = (accum[4] > inputs.taxfree) ? -Math.min( dyn[4][i-1],accum[4] - inputs.taxfree) * inputs.taxrate : 0;
      }

      if(period % inputs.interval === 0){
        escape = true;
      }
      period += 1;
    }
  }

  // attach final year
  dyn[0][i-1] = year;
  dyn[1][i-1] = accum[1];
  dyn[2][i-1] = accum[2];
  dyn[3][i-1] = accum[3];
  dyn[4][i-1] = accum[4];
  if(taxend) {
    dyn[9][i-1] = dyn[9][i-2];
    dyn[5][i-1] = dyn[5][i-2] + dyn[4][i-1];
    dyn[6][i-1] = - inputs.principal + dyn[5][i-1];
  } else {
    dyn[9][i-1] = (dyn[4][i - 1] > inputs.taxfree) ? -(dyn[4][i - 1] - inputs.taxfree) * inputs.taxrate : 0;
    dyn[5][i-1] = dyn[5][i-2] + dyn[4][i-1] + dyn[9][i-1];
    dyn[6][i-1] = - inputs.principal + dyn[5][i-1];
  }
  dyn[7][i-1] = true;   // annual val indicator
  dyn[8][i-1] = ". Jahr";

  // transpose dyn
  dynT = dyn[0].map(function(col,i){
    return dyn.map(function(row){
      return row[i];
    })
  });

  // compute array with annual vals
  dynAnnual = _.filter(dynT, function(subarray){ return subarray[7]===true});

  // transpose dynAnnual
  dynAnnualT = dynAnnual[0].map(function(col,i){
    return dynAnnual.map(function(row){
      return row[i];
    })
  });

  helper.interestgain = _.reduce(dynAnnualT[4], helpers.add, 0);
  if(taxend) {
    helper.terminalvalue = dyn[5][i-2] + accum[4];
    helper.taxdeduct = dyn[9][i-1];
  } else {
    helper.terminalvalue = dyn[5][i-2] + accum[4] + dyn[9][i-1];
    helper.taxdeduct = _.reduce(dynAnnualT[9], helpers.add, 0);
  }
  helper.pnl = -inputs.principal + dyn[5][i-2] + accum[4] + dyn[9][i-1];


  // attach final sums
  dynT.push(['Gesamt', _.reduce(dynAnnualT[1], helpers.add, 0), _.reduce(dynAnnualT[2], helpers.add, 0), _.reduce(dynAnnualT[3], helpers.add, 0), helper.interestgain, (taxend) ? helper.terminalvalue + helper.taxdeduct :  helper.terminalvalue , helper.pnl ,true, , helper.taxdeduct]);




  /* ******** 4. CONSTRUCT RESULT DATA OBJECT ******** */
  result.id = calcElems.repaysurrogat.id;
  /*
   6.A FIRST RESULT CONTAINER
   */
  if(helper.pnl > 0){
    result._1.pnlcategory  = _.extend(localElems['pnlcategory'],  {"value": "JA"});
    result._1.pnl          = _.extend(localElems['pnlpos'],       {"value": helper.pnl});
  } else {
    result._1.pnlcategory  = _.extend(localElems['pnlcategory'],  {"value": "NEIN"});
    result._1.pnl          = _.extend(localElems['pnlneg'],       {"value": helper.pnl});
  }
  result._1.totalcost      = _.extend(localElems['totalcost'],      {"value": helper.totalcost});
  result._1.debtinterest   = _.extend(localElems['debtinterest'],   {"value": helper.debtinterest});
  result._1.repaysubstitute= _.extend(localElems['repaysubstitute'],{"value": helper.repaysubstitute});
  result._1.annuity        = _.extend(localElems['annuity'],        {"value": helper.annuity});
  result._1.repayrate      = _.extend(localElems['repayrate'],      {"value": helper.repayrate * 100});
  result._1.term           = _.extend(localElems['term'],           {"value": helper.adjustedterm});
  result._1.terminalvalue  = _.extend(localElems['terminalvalue'],  {"value": helper.terminalvalue});
  result._1.interestgain   = _.extend(localElems['interestgain'],   {"value": helper.interestgain});
  if (inputs.taxes === 'true'){
    result._1.taxdeduct    = _.extend(localElems['taxdeduct'],      {"value": helper.taxdeduct});
    if(taxend){
      result._1.terminalwotax    = _.extend(localElems['terminalwotax'],      {"value": helper.terminalvalue + helper.taxdeduct});
    }
  }

  /*
   6.B SECOND RESULT CONTAINER
   */
  result._2.title = 'Wertentwicklung';

  result._2.header = ['Monat', 'Zins- <br> aufwand', 'Tilgungs- <br> surrogat', 'Gesamt- <br> rate','Zins- <br> ertrag','Anlage- <br> kapital','Saldo',,,'Steuer- <br> abzug'];
  result._2.body = dynT;
  if (inputs.taxes === 'true'){
    result._2.tax = true;
    if(taxend){
      result._2.taxend = true;
    } else {
      result._2.taxan = true;
    }
  } else {
    result._2.tax = false;
  }

  return result;

};



