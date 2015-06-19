var _ = require('underscore');
var validator = require('validator');
var helpers = require('./helpers');
var math = require('./math');
var calcElems = require('../data/static/calcElems.json');


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