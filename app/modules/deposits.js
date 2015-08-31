var _ = require('underscore');
var validator = require('validator');
var helpers = require('./helpers');
var math = require('./math');
var f = require('../../lib/finance');
var misc = require('./misc');

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

  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  var result = {}; result._1 = {}; result._2 = {};
  var helper, helperAnnual, helperAnnualT;
  var errorMap;
  var selectMap = ['end','start','rate','period'];


  function compute(data){
    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    // drop elems that are to be computed form input and expectedinputs object
    delete inputs[selectMap[inputs.select]];
    data[0].inputs.splice(_.findIndex(data[0].inputs, {name: selectMap[inputs.select]}),1);
    //delete _expectedInputs[selectMap[inputs.select]];

    errorMap = helpers.validate(inputs, data[0].inputs);
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
    result.id = data[0].id;
    // first result container
    result._1.value = _.extend(_.findWhere(data[0].results_1,{name: selectMap[inputs.select]}), {'value': inputs.select == 2 ? helper * 100 : helper});
    //result._1.value = _.extend(localElems[selectMap[inputs.select]], {'value': inputs.select == 2 ? helper * 100 : helper});
    result._1.gain  = _.extend(_.findWhere(data[0].results_1,{name: 'gain'}),  {'value': inputs.end - inputs.start});
    //result._1.gain  = _.extend(localElems['gain'], {'value': inputs.end - inputs.start});


    //result._1.value =          {'description': localElems[selectMap[inputs.select]].description,  'value': inputs.select == 2 ? helper * 100 : helper,                    'unit': localElems[selectMap[inputs.select]].unit, 'digits': localElems[selectMap[inputs.select]].digits, 'tooltip': localElems[selectMap[inputs.select]].tooltip};
    //result._1.gain  =          {'description': localElems['gain'].description,                    'value': inputs.end - inputs.start, 'unit': localElems['gain'].unit                  , 'digits': localElems['gain'].digits,                   'tooltip': localElems['gain'].tooltip};
    // second result container
    result._2.title = 'Kapitalentwicklung';
    result._2.header = ['Jahr', 'Kapitalwert Beginn', 'Zins', 'Zins akkumuliert', 'Kapitalwert Ende'];
    result._2.body = helperAnnualT;

    return result;

  }

  return Calc.findByCalcname('depinterest')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });

};


/** DEPOSITS-SAVINGS function that computes parameters for a savings plan
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
exports.savings = function(inputs){

  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  var helper = {}, inflowHelper = null;
  var cash = [], cashT;
  var q, a, principalCompounded;
  var result = {}; result._1 = {}; result._2 = {};
  var errorMap;
  var selectMap = ['terminal','principal','inflow','term','interest'];


  function compute(data){


    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    // drop elems that are to be computed form input and expectedinputs object
    delete inputs[selectMap[inputs.select]];
    data[0].inputs.splice(_.findIndex(data[0].inputs, {name: selectMap[inputs.select]}),1);

    // run validations
    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0){
      return errorMap;
    }

    // assign to shortcuts for convenience (XXX check whether this can be moved down a bit to avoid the undef-option
    var mz = inputs.interestperiod;     // number interest periods within a year
    var mr = inputs.inflowfreq;         // number of cash payments within a year
    var n =  inputs.term;               // term in years
    var nf = inputs.termfix;            // fix termin in years
    var r =  inputs.interest / 100;     // interest
    var K = inputs.principal;           // principal
    var R = inputs.inflow;              // principal
    var d = inputs.dynamic / 100;       // dynamics
    var E = inputs.terminal;            // terminal value

    // compute helpers
    q = (1 + r / mz);
    a = (1 + inputs.dynamic);


    /** ******** 3. DEFINE LOCAL HELPER FUNCTIONS ******** */
    var dynamicPeriod_1 = function(term, payPoint,inflowCompute){
      var result = 0, multiplier = null;
      if (payPoint === 'pre'){
        multiplier = Math.pow(1 + r / mz, mz / mr);
      } else if (payPoint === 'post'){
        multiplier = 1;
      } else {return;}

      function iterator(l){
        return (Math.pow(q,mz * term - l * mz - mz / mr)/(1-Math.pow(q,-mz / mr)))*(1-Math.pow(q,-mz));
      }

      for (i = 0; i < term; i++){
        result += Math.pow(1 + d,i) * iterator(i);
      }
      if (inflowCompute){
        return result * multiplier;
      } else {
        return result * R * multiplier;
      }
    };

    var dynamicPeriod_2 = function(term, payPoint,inflowCompute){
      if (payPoint === 'pre'){
        payPoint = 1;
      } else if (payPoint === 'post'){
        payPoint = -1;
      } else {return;}

      var m = mr / mz; // number of payments within interest period
      var ersatzrate = inputs.inflow * (m + ((r / mz) / 2) * (m + payPoint));  // ersatzrate; P*phi
      var result = 0;

      function iterator(l){
        return (Math.pow(q,mz * term - l * mz - 1)/(1-Math.pow(q,-1)))*(1-Math.pow(q,-mz));
      }

      for (i=0; i < term; i++){
        result += Math.pow(1 + d,i) * iterator(i);
      }
      if(inflowCompute){
        return result;
      } else {
        return result * ersatzrate;
      }
    };



    /** ******** 4. COMPUTATIONS ******** */
    /* 4A. NON-PERIODICAL CALCULATIONS */
    // compound principal
    principalCompounded = K * Math.pow(1 + r / mz, n * mz);

    // 4A.1. TERMINAL VALUE
    if (inputs.select === 0) {

      // compute terminal value for saving period (not dynamic)
      if (d === 0) {
        helper.result = principalCompounded + R * (Math.pow(1 + r / mz, n * mz) - 1) * ((mr >= mz) * (mr / mz + (r / mz) / 2 * (mr / mz + (inputs.inflowtype === 1) * (-1) + (inputs.inflowtype === 2))) / (r / mz) + (mr < mz) * ((inputs.inflowtype === 1) * 1 + (inputs.inflowtype === 2) * Math.pow(1 + r / mz, mz / mr)) / (Math.pow(1 + r / mz, mz / mr) - 1));

        //result.terminal = principalCompounded + inflow * (Math.pow(1+interest/mz,n*mz) - 1) * ((mr>= mz)*(mr/mz + (interest/mz)/2*(mr/mz+(inflowType===1)*(-1)+(inflowType===2)))/(interest/mz) + (mr<mz)*((inflowType===1)*1+(inflowType===2)*Math.pow(1+interest/mz,mz/mr))/(Math.pow(1+interest/mz,mz/mr) - 1));
        // find out last full period
        // TODO: mention in explanations: wenn vorschüssig und periode ist nicht voll wird von voller (nicht anteiliger) Zahlung am Beginn der Periode ausgegangen; eventuell sit dies auch geklärt durch die entsprechende Tabelle

        // compute terminal value for saving period (nachschüssig, dynamic)
      } else if (inputs.inflowtype === 1 && d !== 0) {

        // TODO: deal with denominator zero corner case
        if (mz === 1 || mr === 1) {
          helper.result = principalCompounded + R * (mr + ((mr - 1) / 2) * r) * (Math.pow(1 + r / mz, n * mz) - Math.pow(1 + d, n)) / (Math.pow(1 + r / mz, mz) - (1 + d));
        } else if (mr >= mz) {
          helper.result = principalCompounded + dynamicPeriod_2(n, 'post');
        } else {
          helper.result = principalCompounded + dynamicPeriod_1(n, 'post');
        }
        // compute terminal value for saving period (vorschüssig, dynamic)
      } else if (inputs.inflowtype === 2 && d !== 0) {
        if (mz === 1) {
          helper.result = principalCompounded + R * (mr + ((mr + 1) / 2) * r) * (Math.pow(1 + r / mz, n * mz) - Math.pow(1 + d, n)) / (Math.pow(1 + r / mz, mz) - (1 + d));
        } else if (mr === 1) {
          helper.result = principalCompounded + R * Math.pow(1 + r / mz, mz) * (Math.pow(1 + r / mz, n * mz) - Math.pow(1 + d, n)) / (Math.pow(1 + r / mz, mz) - (1 + d));
        } else if (mr >= mz) {
          helper.result = principalCompounded + dynamicPeriod_2(n, 'pre');
        } else {
          helper.result = principalCompounded + dynamicPeriod_1(n, 'pre');
        }
      } else {
        helper.result = null;
      }

      // compound from end of saving period until end of "Ansparzeitraum"
      helper.result = helper.result * Math.pow(1 + r / mz , nf * mz);


    // 4A.2. PRINCIPAL
    } else if (inputs.select === 1){
      // discount terminal
      E = E / Math.pow( 1 + r / mz, nf * mz);
      // compute principal value for saving period (nachschüssig,not dynamic)
      if (d === 0){
        helper.result = E - R * (Math.pow(1 + r / mz, n * mz) - 1) * ((mr >= mz) * (mr / mz + (r / mz) / 2 * (mr / mz + (inputs.inflowtype === 1) * (-1) + (inputs.inflowtype === 2))) / (r / mz) + (mr < mz) * ((inputs.inflowtype === 1) * 1 + (inputs.inflowtype === 2) * Math.pow(1 + r / mz, mz / mr)) / (Math.pow(1 + r / mz, mz / mr) - 1));
      // compute principal value for saving period (nachschüssig, dynamic)
      } else if(inputs.inflowtype === 1 && d !== 0) {
        // TODO deal with denominator zero corner case
        if (mz === 1 || mr === 1) {
          helper.result = E - R * (mr + ((mr - 1) / 2) * r) * (Math.pow(1 + r / mz, n * mz) - Math.pow(1 + d, n)) / (Math.pow(1 + r / mz, mz) - (1 + d));
        } else if (mr >= mz) {
          helper.result = E - dynamicPeriod_2(n, 'post');
        } else {
          helper.result = E - dynamicPeriod_1(n, 'post');
        }
      }
      // compute principal value for saving period (vorschüssig, dynamic)
      else if(inputs.inflowtype === 2 && d !== 0) {
        if (mz === 1){
          helper.result = E - R * (mr + ((mr +1)/2)*r) * (Math.pow(1+r/mz,n*mz)-Math.pow(1+d,n)) / (Math.pow(1+r/mz,mz)-(1+d));
        } else if (mr === 1){
          helper.result = E - R * Math.pow(1 + r / mz, mz) * (Math.pow(1 + r / mz, n * mz) - Math.pow(1+d,n)) / (Math.pow(1 + r / mz, mz) - (1+d));
        } else if (mr >= mz ){
          helper.result = E - dynamicPeriod_2(n, 'pre');
        } else {
          helper.result = E - dynamicPeriod_1(n, 'pre');
        }
      } else {
        helper.result = null;
      }

      helper.result = (helper.result/Math.pow(1+r/mz,n * mz));
      // 4A.3. INFLOW
    } else if (inputs.select === 2) {
      // discount terminal
      E = E / Math.pow( 1 + r / mz, nf * mz);
      if (d === 0){
        helper.result = (E - principalCompounded)/(Math.pow(1+r/mz,n * mz) - 1) * ((mr>= mz)*(mr/mz + (r/mz)/2*(mr/mz+(inputs.inflowtype===1)*(-1)+(inputs.inflowtype===2)))/(r/mz) + (mr<mz)*((inputs.inflowtype===1)*1+(inputs.inflowtype===2)*Math.pow(1+r/mz,mz/mr))/(Math.pow(1+r/mz,mz/mr) - 1));
      // compute inflow value for saving period (nachschüssig, dynamic)
      } else if(inputs.inflowtype === 1 && d !== 0) {
        // TODO deal with denominator zero corner case
        if (mz === 1 || mr === 1){
          helper.result = (E-principalCompounded)/((mr + ((mr -1)/2)*r) * (Math.pow(1 + r / mz,n * mz) - Math.pow(1 + d,n)) / (Math.pow(1 + r / mz,mz) - (1 + d)));
        } else if (mr >= mz ){
          helper.result = (E-principalCompounded)/(dynamicPeriod_2(n, 'post',true)*(mr/mz + ((r/mz)/2)*(mr/mz-1)));
        } else {
          helper.result = (E-principalCompounded)/(dynamicPeriod_1(n, 'post',true));
        }
        // compute inflow value for saving period (vorschüssig, dynamic)
      } else if(inputs.inflowtype === 2 && d !== 0) {
        if (mz === 1){
          //result.terminal = principalCompounded + inflow * (inflowFreq + ((inflowFreq +1)/2)*interest) * (Math.pow(1+interest/interestPeriod,term*interestPeriod)-Math.pow(1+dynamic,term)) / (Math.pow(1+interest/interestPeriod,interestPeriod)-(1+dynamic));
          helper.result = (E - principalCompounded)/((mr + ((mr +1)/2)*r) * (Math.pow(1 + r / mz, n * mz)-Math.pow(1 + d, n)) / (Math.pow(1 + r/mz,mz)-(1+d)));
        } else if (mr === 1){
          //result.terminal = principalCompounded + inflow * Math.pow(1 + interest / interestPeriod, interestPeriod) * (Math.pow(1 + interest / interestPeriod, term * interestPeriod) - Math.pow(1+dynamic,term)) / (Math.pow(1 + interest / interestPeriod, interestPeriod) - (1+dynamic));
          helper.result = (E - principalCompounded)/(Math.pow(1 + r / mz, mz) * (Math.pow(1 + r / mz, n * mz) - Math.pow(1 + d,n)) / (Math.pow(1 + r / mz, mz) - (1 + d)));
        } else if (mr >= mz ){
          //result.terminal = principalCompounded + dynamicPeriod_2(term,'pre');
          helper.result = (E - principalCompounded)/(dynamicPeriod_2(n, 'pre',true)*(mr/mz + ((r/mz)/2)*(mr/mz+1)));
        } else {
          //result.terminal = principalCompounded + dynamicPeriod_1(term,'pre');
          helper.result = (E - principalCompounded)/(dynamicPeriod_1(n, 'pre',true));
        }
      } else {
        result.result = null;
      }
      // 4A.4. TERM
    } else if (inputs.select === 3){
      // discount terminal
      E = E / Math.pow( 1 + r / mz, nf * mz);

      if (d === 0){

        (function(){ /// XXX remove IFFE (also in the snippets below)- does not seem necessary
          function findRootOf(n){
            return E - K * Math.pow(1 + r / mz,n * mz) - R * (Math.pow(1+r / mz,n * mz) - 1) * ((mr >= mz) * (mr / mz + (r / mz)/2 * (mr / mz+(inputs.inflowtype === 1) * (-1)+(inputs.inflowtype === 2)))/(r / mz) + (mr < mz)*((inputs.inflowtype === 1) * 1+(inputs.inflowtype === 2) * Math.pow(1 + r/mz,mz/mr))/(Math.pow(1+r/mz,mz/mr) - 1));
          }
          helper.result = math.roots(findRootOf,30,1500);

        })();

        // compute term for saving period (nachschüssig, dynamic)
      } else if(inputs.inflowtype === 1 && d !== 0) {
        // TODO deal with denominator zero corner case
        if (mz === 1 || mr === 1){
          //result.terminal = principalCompounded + inflow * (inflowFreq + ((inflowFreq -1)/2)*interest) * (Math.pow(1+interest/interestPeriod,term*interestPeriod)-Math.pow(1+dynamic,term)) / (Math.pow(1+interest/interestPeriod,interestPeriod)-(1+dynamic));
          (function(){
            function findRootOf(m){
              // todo: issues with principalCompounded, as it depends on n
              return E - principalCompounded - R * (mr + ((mr -1)/2) * r) * (Math.pow(1 + r / mz,m * mz)-Math.pow(1 + d,m)) / (Math.pow(1 + r / mz,mz)-(1 + d));
             // return terminal - principalCompounded - inflow * (inflowFreq + ((inflowFreq -1)/2)*interest) * (Math.pow(1+interest/interestPeriod,n*interestPeriod)-Math.pow(1+dynamic,n)) / (Math.pow(1+interest/interestPeriod,interestPeriod)-(1+dynamic));
            }
            //helper.result = math.roots(findRootOf,30,1500);
          })();
        } else if (mr >= mz ){
          //result.terminal = principalCompounded + dynamicPeriod_2(term,'post');
          // TODO: continue;
        } else {
          // result.terminal = principalCompounded + dynamicPeriod_1(term,'post');

        }
        // compute term for saving period (vorschüssig, dynamic)
      }
    // 4A.5. INTEREST
    } else if (inputs.select === 4){

      if (d === 0){
        (function(){
          function findRootOf(i){
            return E/Math.pow(1 + i / mz,nf * mz) - K * Math.pow(1 + i / mz, n * mz) - R * (Math.pow(1 + i / mz , n * mz) - 1) * ((mr>= mz) * (mr / mz + (i / mz) / 2 *(mr / mz+(inputs.inflowtype===1) * (-1) + (inputs.inflowtype===2))) / ( i / mz) + (mr < mz) * ((inputs.inflowtype===1) * 1+(inputs.inflowtype===2) * Math.pow(1 + i / mz, mz / mr))/(Math.pow(1 + i / mz,mz / mr) - 1));
          }
          helper.result = math.roots(findRootOf,0.1,1500)*100;
        })();

      } else {
        // TODO add code for dynamics

      }


    }


    /* 4B. NON-PERIODICAL CALCULATIONS */
    var interestCalc = function(k){
      var interestPayment = 0, ersatzRate;
      if (mr === 1 || mz === 1){
        ersatzRate = inflowHelper * (mr+(r/2)*(mr-1)) - inflowHelper * mr;
        interestPayment = cash[1][k-(12/mz-1)] * (r/mz) + ersatzRate;
      }
      return interestPayment;
    };

    // construct cash flow series TODO: implement for nachschüssige Zahlungen
    inflowHelper = R;
    cash[0] = []; cash[1] = []; cash[2] = []; cash[3] = []; cash[4] = []; cash[5] = []; cash[6] = []; cash[7] = []; cash[8] = [];
    cash[0][0] = 1;
    cash[1][0] = K;       // b.o.p account balance
    cash[2][0] = cash[0][0] % (12/mr) === 0 ? inflowHelper : 0;   // e.o.p account saving inflow
    cash[3][0] = cash[0][0] % (12/mz) === 0 ? interestCalc(0) : 0;   // e.o.p interest inflow TODO: correct
    cash[4][0] = cash[1][0] + cash[2][0] + cash[3][0];              // e.o.p account balance

    for (i=1; i < (nf + n) * 12; i++){
      cash[0][i] = i + 1;
      cash[1][i] = cash[4][i-1];       // b.o.p account balance
      cash[2][i] = cash[0][i] % (12/mr) === 0 ? inflowHelper : 0;   // e.o.p account saving inflow
      cash[3][i] = cash[0][i] % (12/mz) === 0 ? interestCalc(i) : 0;   // e.o.p interest inflow TODO: correct
      cash[4][i] = cash[1][i] + cash[2][i] + cash[3][i];              // e.o.p account balance
      if (i === n * 12-1){
        inflowHelper = 0;
      }
    }

    // transpose cash
    cashT = cash[0].map(function(col,i){
      return cash.map(function(row){
        return row[i];
      })
    });


    /** ******** 5. CONSTRUCT RESULT OBJECT ******** */
    result.id = data[0].id;

    // first result container
    result._1.value = _.extend(_.findWhere(data[0].results_1,{name: selectMap[inputs.select]}), {"value": helper.result});



    // second result container
    result._2.title = 'Sparkontoentwicklung';
    result._2.header = ['Monat', 'Guthaben <br> Beginn', 'Einzahlung <br>  Monatsende', 'Zinszahlung <br> Monatsende', 'Guthaben <br> Ende'];
    result._2.body = cashT;

    return result;

  }


  return Calc.findByCalcname('depsaving')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });

};




/** DEPOSITS-TIMEDEPOSIT function that computes parameters for time deposits
 * ARGUMENTS XXX todo: documenation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.timedeposit = function(inputs) {

  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  helpers.messages.clear();
  helpers.errors.clear();
  var result = {}, helper = {};
  result._1 = {};
  result._chart1 = {};
  var errorMap;
  var selectMap = [undefined,undefined,'interestgain','principal','interest','term'];
  var i;

  function compute(data){


    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    // drop elems that are to be computed
    if(inputs.calcselect === "2"){
      delete inputs['interestgain'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'interestgain'}),1);
      //delete _expectedInputs['interestgain'];
    } else if(inputs.calcselect === "3") {
      delete inputs['principal'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'principal'}),1);
      //delete _expectedInputs['principal'];
    } else if(inputs.calcselect === "4") {
      delete inputs['interest'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'interest'}),1);
      //delete _expectedInputs['interest'];
    } else if(inputs.calcselect === "5") {
      delete inputs['term'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'term'}),1);
      //delete _expectedInputs['term'];
    } else {  // sthg wrong
      return;
    }


    if(inputs.taxes === 'false'){
      delete inputs['taxrate'];
      delete inputs['taxfree'];
      delete inputs['taxtime'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxrate'}),1);
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxfree'}),1);
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxtime'}),1);
      //delete _expectedInputs['taxrate'];
      //delete _expectedInputs['taxfree'];
      //delete _expectedInputs['taxtime'];
    }

    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0){
      return errorMap;
    }

    inputs.interest = inputs.interest / 100;
    inputs.taxrate  = inputs.taxrate / 100;


    if(inputs.term && validator.isFloat(inputs.term) && !validator.isInt(inputs.term)){
      inputs.term = Math.ceil(inputs.term);
      helpers.messages.set("Hinweis: Die Laufzeit wurde nicht in ganzen Monaten angegeben. Für die Berechnung wurde die Laufzeit auf den nächsten ganzen Monat gesetzt. Der Berechnung liegt also ein Laufzeit von " + inputs.term + " Monaten zugrunde.",2);
    }

    /* ******** 3. DEFINE LOCAL HELPER FUNCTIONS ******** */
    function gain(r){
      return inputs.interestgain - inputs.principal * (Math.pow(1 + r, Math.floor(inputs.term / 12)) * (1 + (inputs.term % 12) * r / 12) - 1);
    }

    function term(t){
      return inputs.interestgain - inputs.principal * (Math.pow(1 + inputs.interest, Math.floor(t / 12)) * (1 + (t % 12) * inputs.interest / 12) - 1);
    }

    function termTaxesNoComp(t){
      return inputs.interestgain + Math.max(0, inputs.principal * inputs.interest - inputs.taxfree) * inputs.taxrate * Math.floor(t/12) + Math.max(inputs.principal * inputs.interest * (t % 12) / 12 - inputs.taxfree, 0) * inputs.taxrate - inputs.principal * inputs.interest * t / 12;
    }


    /* ******** 3. COMPUTATIONS ******** */

    /*
     * ******** 3A. CASE SIMPLE INTEREST ********
     */
    if(!inputs.selection){

      /*
       * ******** 3A1. CASE SIMPLE INTEREST AND NO TAX ********
       */
      if(!inputs.taxes){
        if(inputs.calcselect === 2) { // interestgain
          helper.result = inputs.principal * (inputs.interest * inputs.term / 12);
          helper.terminalvalue = inputs.principal + helper.result;
        }
        else if(inputs.calcselect === 3) {   // principal
          helper.result = inputs.interestgain / (inputs.interest * inputs.term / 12);
          helper.terminalvalue = helper.result + inputs.interestgain;
        }
        else if(inputs.calcselect === 4) {   // interest
          helper.result = (inputs.interestgain / inputs.principal) * (12 / inputs.term) * 100;
          helper.terminalvalue = inputs.principal + inputs.interestgain;
        }
        else if(inputs.calcselect === 5) {   // term
          helper.result = (inputs.interestgain * 12) / (inputs.principal * inputs.interest);
          helper.terminalvalue = inputs.principal + inputs.interestgain;
        }

      /*
      * ******** 3A2. CASE SIMPLE INTEREST AND TERMINAL TAX ********
      */
      } else if(inputs.taxes && inputs.taxtime){
        if(inputs.calcselect === 2) {   // interestgain
          helper.interestgainwotax = inputs.principal * (inputs.interest * inputs.term / 12);
          helper.taxes = - Math.max(helper.interestgainwotax - inputs.taxfree,0) * inputs.taxrate;
          helper.result = helper.interestgainwotax + helper.taxes;
          helper.terminalvalue = inputs.principal + helper.result;
        } else if(inputs.calcselect === 3) {   // principal
          helper.bool = (inputs.interestgain > inputs.taxfree);
          helper.interestgainwotax = (inputs.interestgain - helper.bool * inputs.taxfree * inputs.taxrate) / (1 - helper.bool * inputs.taxrate);
          helper.taxes = - (helper.interestgainwotax - inputs.interestgain);
          helper.result = helper.interestgainwotax / (inputs.interest * inputs.term / 12);
          helper.terminalvalue = helper.result + inputs.interestgain;
        } else if(inputs.calcselect === 4) {   // interest
          helper.bool = (inputs.interestgain > inputs.taxfree);
          helper.interestgainwotax = (inputs.interestgain - helper.bool * inputs.taxfree * inputs.taxrate) / (1 - helper.bool * inputs.taxrate);
          helper.taxes = - (helper.interestgainwotax - inputs.interestgain);
          helper.result = (helper.interestgainwotax / inputs.principal) * (12 / inputs.term) * 100;
          helper.terminalvalue = inputs.principal + inputs.interestgain;
        } else if(inputs.calcselect === 5) {   // term
          helper.bool = (inputs.interestgain > inputs.taxfree);
          helper.interestgainwotax = (inputs.interestgain - helper.bool * inputs.taxfree * inputs.taxrate) / (1 - helper.bool * inputs.taxrate);
          helper.taxes = - (helper.interestgainwotax - inputs.interestgain);
          helper.result = (helper.interestgainwotax * 12) / (inputs.principal * inputs.interest);
          helper.terminalvalue = inputs.principal + inputs.interestgain;
        } else {  // sthg wrong
          return null;
        }

      /*
       * ******** 3A3. CASE SIMPLE INTEREST AND PERIODICAL TAX ********
       */
      } else if(inputs.taxes && !inputs.taxtime){
        if(inputs.calcselect === 2) {   // interestgain
          helper.interestgainwotax = inputs.principal * (inputs.interest * inputs.term / 12);
          helper.taxes = - Math.floor(inputs.term / 12) * Math.max(inputs.principal * inputs.interest - inputs.taxfree, 0) * inputs.taxrate;
          helper.taxes -= Math.max(inputs.principal * (inputs.interest * (inputs.term % 12) / 12) - inputs.taxfree,0) * inputs.taxrate;
          helper.result = helper.interestgainwotax + helper.taxes;
          helper.terminalvalue = inputs.principal + helper.result;
        } else if(inputs.calcselect === 3) {   // principal
          // compute principal assuming no taxes are to be paid
          helper.result = inputs.interestgain / (inputs.interest * inputs.term / 12);

          // check whether assumption of no taxes was incorrect and assume taxes are only to be paid for full year
          if(helper.result * inputs.interest - inputs.taxfree > 0){
            helper.result = (inputs.interestgain - inputs.taxfree * inputs.taxrate * Math.floor(inputs.term / 12));
            helper.result /= (-inputs.interest * inputs.taxrate * Math.floor(inputs.term / 12) + inputs.interest * inputs.term / 12);
          }

          // check whether assumption of taxes only for full year was incorrect and assume taxes are always to be paid
          if(helper.result * inputs.interest * (inputs.term % 12) / 12 - inputs.taxfree > 0){
            helper.result = (inputs.interestgain - inputs.taxfree * inputs.taxrate * Math.floor(inputs.term / 12) - inputs.taxfree * inputs.taxrate);
            helper.result /= (-inputs.interest * inputs.taxrate * Math.floor(inputs.term / 12) - inputs.interest * ((inputs.term % 12) / 12) * inputs.taxrate + inputs.interest * inputs.term / 12);
          }

          helper.taxes = - Math.max(0, helper.result * inputs.interest - inputs.taxfree) * inputs.taxrate * Math.floor(inputs.term / 12) - Math.max(helper.result * inputs.interest * (inputs.term % 12) / 12 - inputs.taxfree,0) * inputs.taxrate;
          helper.interestgainwotax = inputs.interestgain - helper.taxes;
          helper.terminalvalue = helper.result + inputs.interestgain;

        } else if(inputs.calcselect === 4) {   // interest
          // compute interest assuming no taxes are to be paid
          helper.result = (inputs.interestgain / inputs.principal) * (12 / inputs.term);

          // check whether assumption of no taxes was incorrect and assume taxes are only to be paid for full year
          if(inputs.principal * helper.result - inputs.taxfree > 0){
            helper.result = (inputs.interestgain - inputs.taxfree * inputs.taxrate * Math.floor(inputs.term / 12));
            helper.result /= (-inputs.principal * inputs.taxrate * Math.floor(inputs.term / 12) + inputs.principal * inputs.term / 12);
          }

          // check whether assumption of taxes only for full year was incorrect and assume taxes are always to be paid
          if(inputs.principal * helper.result * (inputs.term % 12) / 12 - inputs.taxfree > 0){
            helper.result = (inputs.interestgain - inputs.taxfree * inputs.taxrate * Math.floor(inputs.term / 12) - inputs.taxfree * inputs.taxrate);
            helper.result /= (-inputs.principal * inputs.taxrate * Math.floor(inputs.term / 12) - inputs.principal * ((inputs.term % 12) / 12) * inputs.taxrate + inputs.principal * inputs.term / 12);
          }

          helper.taxes = - Math.max(0, inputs.principal * helper.result - inputs.taxfree) * inputs.taxrate * Math.floor(inputs.term / 12) - Math.max(inputs.principal * helper.result * (inputs.term % 12) / 12 - inputs.taxfree,0) * inputs.taxrate;
          helper.interestgainwotax = inputs.interestgain - helper.taxes;
          helper.result *= 100;
          helper.terminalvalue = inputs.principal + inputs.interestgain;

        } else if(inputs.calcselect === 5) {   // term
          // case where no taxes are to be paid
          if(inputs.principal * inputs.interest - inputs.taxfree <= 0){
            helper.result = inputs.interestgain * 12 / (inputs.principal * inputs.interest);
          } else {
            helper.result = math.roots(termTaxesNoComp,12,1500);
            if(!validator.isFloat(helper.result)){  // sanitize result and return if sthg wring
              helpers.errors.set("Leider konnte die Laufzeit für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass die Laufzeit außergewöhnlich kurz oder lang ist.",undefined , true);
              return helpers.errors.errorMap;
            }

          }

          helper.taxes = - Math.max(0, inputs.principal * inputs.interest - inputs.taxfree) * inputs.taxrate * Math.floor(helper.result / 12) - Math.max(inputs.principal * inputs.interest * (helper.result % 12) / 12 - inputs.taxfree,0) * inputs.taxrate;
          helper.interestgainwotax = inputs.interestgain - helper.taxes;
          helper.terminalvalue = inputs.principal + inputs.interestgain;

        }

      }

      /*
      * ******** 3B. CASE COMPOUNDED INTEREST ********
      */
    } else {
      /*
       * ******** 3B1. CASE COMPOUNDED INTEREST AND NO TAX ********
       */
      if(!inputs.taxes){
        if(inputs.calcselect === 2) { // interestgain
          helper.result = inputs.principal * (Math.pow(1 + inputs.interest,Math.floor(inputs.term/12)) * (1 + inputs.interest * (inputs.term % 12) / 12) - 1);
          helper.terminalvalue = inputs.principal + helper.result;
        } else if (inputs.calcselect === 3) {   // principal
          helper.result = inputs.interestgain / (Math.pow(1 + inputs.interest, Math.floor(inputs.term / 12)) * (1 + inputs.interest * (inputs.term % 12) / 12) - 1);
          helper.terminalvalue = helper.result + inputs.interestgain;
        } else if(inputs.calcselect === 4) {   // interest
          helper.result = math.roots(function(i){
            return inputs.interestgain - inputs.principal * ((Math.pow(1 + i, Math.floor(inputs.term / 12))) * (1 + i * (inputs.term % 12) / 12) - 1);
          },0.1,1500);
          if(!validator.isFloat(helper.result)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte der Zinssatz für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass der Zinssatz außergewöhnlich hoch oder niedrig ist.",undefined , true);
            return helpers.errors.errorMap;
          }
          helper.terminalvalue = inputs.principal + inputs.interestgain;
          helper.result *= 100;
        } else if(inputs.calcselect === 5) {   // term
          helper.result = math.roots(function(t){
            return inputs.interestgain - inputs.principal * ((Math.pow(1 + inputs.interest, Math.floor(t / 12))) * (1 + inputs.interest * (t % 12) / 12) - 1);
          },5,1500);
          if(!validator.isFloat(helper.result)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte die Laufzeit für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass die Laufzeit außergewöhnlich kurz oder lang ist.",undefined , true);
            return helpers.errors.errorMap;
          }
          helper.terminalvalue = inputs.principal + inputs.interestgain;
        }


      /*
       * ******** 3A2. CASE COMPOUNDED INTEREST AND TERMINAL TAX ********
       */
      } else if(inputs.taxes && inputs.taxtime){

        if(inputs.calcselect === 2) {   // interestgain
          helper.interestgainwotax = inputs.principal * (Math.pow(1 + inputs.interest,Math.floor(inputs.term/12)) * (1 + inputs.interest * (inputs.term % 12) / 12) - 1);
          helper.taxes = - Math.max(helper.interestgainwotax - inputs.taxfree,0) * inputs.taxrate;
          helper.result = helper.interestgainwotax + helper.taxes;
          helper.terminalvalue = inputs.principal + helper.result;
        } else if(inputs.calcselect === 3) {   // principal
          helper.bool = (inputs.interestgain > inputs.taxfree);
          helper.interestgainwotax = (inputs.interestgain - helper.bool * inputs.taxfree * inputs.taxrate) / (1 - helper.bool * inputs.taxrate);
          helper.taxes = - (helper.interestgainwotax - inputs.interestgain);
          helper.result = helper.interestgainwotax / (Math.pow(1 + inputs.interest, Math.floor(inputs.term / 12)) * (1 + inputs.interest * (inputs.term % 12) / 12) - 1);
          helper.terminalvalue = helper.result + inputs.interestgain;
        } else if(inputs.calcselect === 4) {   // interest
          helper.bool = (inputs.interestgain > inputs.taxfree);
          helper.interestgainwotax = (inputs.interestgain - helper.bool * inputs.taxfree * inputs.taxrate) / (1 - helper.bool * inputs.taxrate);
          helper.taxes = - (helper.interestgainwotax - inputs.interestgain);
          helper.result = math.roots(function(i){
            return helper.interestgainwotax - inputs.principal * ((Math.pow(1 + i, Math.floor(inputs.term / 12))) * (1 + i * (inputs.term % 12) / 12) - 1);
          },0.1,1500);
          if(!validator.isFloat(helper.result)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte der Zinssatz für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass der Zinssatz außergewöhnlich hoch oder niedrig ist.",undefined , true);
            return helpers.errors.errorMap;
          }
          helper.terminalvalue = inputs.principal + inputs.interestgain;
          helper.result *= 100;
        } else if(inputs.calcselect === 5) {   // term
          helper.bool = (inputs.interestgain > inputs.taxfree);
          helper.interestgainwotax = (inputs.interestgain - helper.bool * inputs.taxfree * inputs.taxrate) / (1 - helper.bool * inputs.taxrate);
          helper.taxes = - (helper.interestgainwotax - inputs.interestgain);
          helper.result = math.roots(function(t){
            return helper.interestgainwotax - inputs.principal * ((Math.pow(1 + inputs.interest, Math.floor(t / 12))) * (1 + inputs.interest * (t % 12) / 12) - 1);
          },5,1500);
          if(!validator.isFloat(helper.result)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte die Laufzeit für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass die Laufzeit außergewöhnlich kurz oder lang ist.",undefined , true);
            return helpers.errors.errorMap;
          }
          helper.terminalvalue = inputs.principal + inputs.interestgain;
        } else {  // sthg wrong
          return null;
        }

      /*
       * ******** 3A3. CASE COMPOUNDED INTEREST AND PERIODICAL TAX ********
       */
      } else if(inputs.taxes && !inputs.taxtime){
        if(inputs.calcselect === 2) {   // interestgain
          // compute total interestgain by looping over individual annual values
          helper.taxes = 0; helper.result = 0;
          helper.capital = inputs.principal;
          for (i = 1; i <= Math.floor(inputs.term/12); i++){
            helper.temp = helper.capital;
            helper.capital *= (1 + inputs.interest);
            helper.periodictax = Math.max(0, helper.capital - helper.temp - inputs.taxfree) * inputs.taxrate;
            helper.result += helper.capital - helper.temp - helper.periodictax;
            helper.capital -= helper.periodictax;
            helper.taxes -= helper.periodictax;
          }
          // add semi-annual part
          helper.temp = helper.capital;
          helper.capital *= (1 + inputs.interest * (inputs.term % 12) / 12);
          helper.periodictax = Math.max(0, helper.capital - helper.temp - inputs.taxfree) * inputs.taxrate;
          helper.result += helper.capital - helper.temp - helper.periodictax;
          helper.capital -= helper.periodictax;
          helper.taxes -= helper.periodictax;
          helper.interestgainwotax = helper.result - helper.taxes;
          helper.terminalvalue = inputs.principal + helper.result;

        } else if(inputs.calcselect === 3) {   // principal
          helper.result = math.roots(function(p){
            helper.taxes = 0; helper.result = 0;
            helper.capital = p;
            for (i = 1; i <= Math.floor(inputs.term/12); i++){
              helper.temp = helper.capital;
              helper.capital *= (1 + inputs.interest);
              helper.periodictax = Math.max(0, helper.capital - helper.temp - inputs.taxfree) * inputs.taxrate;
              helper.result += helper.capital - helper.temp - helper.periodictax;
              helper.capital -= helper.periodictax;
              helper.taxes -= helper.periodictax;
            }
            // add semi-annual part
            helper.temp = helper.capital;
            helper.capital *= (1 + inputs.interest * (inputs.term % 12) / 12);
            helper.periodictax = Math.max(0, helper.capital - helper.temp - inputs.taxfree) * inputs.taxrate;
            helper.result += helper.capital - helper.temp - helper.periodictax;
            helper.capital -= helper.periodictax;
            helper.taxes -= helper.periodictax;
            helper.interestgainwotax = helper.result - helper.taxes;
            return helper.result - inputs.interestgain;
          },5,1500);
          helper.terminalvalue = inputs.interestgain + helper.result;
          if(!validator.isFloat(helper.result)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte die notwendige Anlagesumme für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass die Anlagesummer außergewöhnlich niedrig oder hoch ist.",undefined , true);
            return helpers.errors.errorMap;
          }

        } else if(inputs.calcselect === 4) {   // interest
          helper.result = math.roots(function(interest){
            helper.taxes = 0; helper.result = 0;
            helper.capital = inputs.principal;
            for (i = 1; i <= Math.floor(inputs.term/12); i++){
              helper.temp = helper.capital;
              helper.capital *= (1 + interest);
              helper.periodictax = Math.max(0, helper.capital - helper.temp - inputs.taxfree) * inputs.taxrate;
              helper.result += helper.capital - helper.temp - helper.periodictax;
              helper.capital -= helper.periodictax;
              helper.taxes -= helper.periodictax;
            }
            // add semi-annual part
            helper.temp = helper.capital;
            helper.capital *= (1 + interest * (inputs.term % 12) / 12);
            helper.periodictax = Math.max(0, helper.capital - helper.temp - inputs.taxfree) * inputs.taxrate;
            helper.result += helper.capital - helper.temp - helper.periodictax;
            helper.capital -= helper.periodictax;
            helper.taxes -= helper.periodictax;
            helper.interestgainwotax = helper.result - helper.taxes;
            return helper.result - inputs.interestgain;
          },0.01,1500);
          if(!validator.isFloat(helper.result)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte der Zinssatz für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass der Zinssatz außergewöhnlich hoch oder niedrig ist.",undefined , true);
            return helpers.errors.errorMap;
          }
          helper.terminalvalue = inputs.principal + inputs.interestgain;
          helper.result *= 100;

        } else if(inputs.calcselect === 5) {   // term
          helper.result = math.roots(function(term){
            helper.taxes = 0; helper.result = 0;
            helper.capital = inputs.principal;
            for (i = 1; i <= Math.floor(term/12); i++){
              helper.temp = helper.capital;
              helper.capital *= (1 + inputs.interest);
              helper.periodictax = Math.max(0, helper.capital - helper.temp - inputs.taxfree) * inputs.taxrate;
              helper.result += helper.capital - helper.temp - helper.periodictax;
              helper.capital -= helper.periodictax;
              helper.taxes -= helper.periodictax;
            }
            // add semi-annual part
            helper.temp = helper.capital;
            helper.capital *= (1 + inputs.interest * (term % 12) / 12);
            helper.periodictax = Math.max(0, helper.capital - helper.temp - inputs.taxfree) * inputs.taxrate;
            helper.result += helper.capital - helper.temp - helper.periodictax;
            helper.capital -= helper.periodictax;
            helper.taxes -= helper.periodictax;
            helper.interestgainwotax = helper.result - helper.taxes;
            return helper.result - inputs.interestgain;
          },0.01,1500);
          if(!validator.isFloat(helper.result)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte die Laufzeit für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass die Laufzeit außergewöhnlich kurz oder lang ist.",undefined , true);
            return helpers.errors.errorMap;
          }
          helper.terminalvalue = inputs.principal + inputs.interestgain;

        }
      }
    }

    /* ******** 4. CONSTRUCT RESULT DATA OBJECT ******** */
    result.id = data[0].id;

    // first result container
    result._1.value = _.extend(_.findWhere(data[0].results_1,{name: selectMap[inputs.calcselect]}), {"value": helper.result});
    if(inputs.taxes){
      result._1.interestgainwotax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainwotax'}), {"value": helper.interestgainwotax});
      result._1.taxes = _.extend(_.findWhere(data[0].results_1,{name: 'taxes'}), {"value": helper.taxes});
    }
    result._1.terminalValue = _.extend(_.findWhere(data[0].results_1,{name: 'terminalvalue'}), {"value": helper.terminalvalue});

    // attach messages
    result.messages = helpers.messages.messageMap;


    // construct chart 1
    result._chart1.data = {
      //labels: ['Kaufpreis Immobilie','Grunderwerbssteuer'],
      series: [inputs.principal || helper.result, inputs.interestgain || helper.result]

    };
    result._chart1.id = 'chart1';
    result._chart1.title = 'Zusammensetzung Endwert';
    result._chart1.legend = ['Anlagesumme', 'Zinsertrag'];
    result._chart1.options = {showLabel: false, donut: false, labelOffset: 0};
    result._chart1.type = 'Pie';


    return result;
  }

  return Calc.findByCalcname('timedeposit')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });

};






/** DEPOSITS-SAVINGSCHEME function that computes parameters savings schemes ("Zuwachssparen")
 * ARGUMENTS XXX todo: documenation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.savingscheme = function(inputs) {


  /* ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  helpers.messages.clear();
  helpers.errors.clear();
  var result = {}, helper = {};
  result._1 = {};  result._2 = {};
  result._chart1 = {};  result._chart2 = {};
  var cf = [];
  var dyn = []; dyn[0] = []; dyn[1] = []; dyn[2] = []; dyn[3] = []; dyn[4] = []; dyn[5] = [];  dyn[6] = [];  dyn[7] = [];  dyn[8] = [];  dyn[9] = [];
  var dynT;
  var interest = [];
  var errorMap;
  var i;


  function compute(data) {

    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    /** drop elems that are to be computed */
    if (inputs.calcselect === "2") {
      delete inputs['terminal'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'terminal'}), 1);
    } else if (inputs.calcselect === "3") {
      delete inputs['principal'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'principal'}), 1);
    }

    inputs.taxrate = inputs.taxrate / 100;


    if (inputs.taxes === 'false') {
      delete inputs['taxrate'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxrate'}), 1);
      delete inputs['taxfree'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxfree'}), 1);
      delete inputs['taxtime'];
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'taxtime'}), 1);
    }


    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0) {
      return errorMap;
    }

    helper.averageinterest = 0;
    for (i = 0; i < inputs.term; i++) {
      interest.push(inputs['interest'.concat(i)] / 100);
      helper.averageinterest += inputs['interest'.concat(i)] / 100;
    }
    helper.averageinterest /= inputs.term;


    /* ******** 3. HELPER FUNCTION ******** */
    function computePrincipal(principal) {
      for (i = 1; i <= inputs.term; i++) {
        dyn[1][i - 1] = (i === 1) ? principal : dyn[4][i - 2];               // initial capital
        dyn[2][i - 1] = (inputs.interestselection) ? dyn[1][i - 1] * interest[i - 1] : interest[i - 1] * principal;       // flow interest
        (inputs.taxes && inputs.taxtime === false) ? dyn[5][i - 1] = -Math.max(0, dyn[2][i - 1] - inputs.taxfree) * inputs.taxrate : dyn[5][i - 1] = 0;   // taxes
        dyn[3][i - 1] = (i === 1) ? dyn[2][i - 1] + dyn[5][i - 1] : dyn[3][i - 2] + dyn[2][i - 1] + dyn[5][i - 1];      // accumulated interest after taxes
        dyn[4][i - 1] = principal + dyn[3][i - 1];                         // terminal capital
      }
      helper.terminal = dyn[4][i - 2];
      helper.interest = _.reduce(dyn[2], helpers.add, 0);

      if (inputs.taxes && inputs.taxtime === false) {
        helper.taxtotal = _.reduce(dyn[5], helpers.add, 0);
      } else if (inputs.taxes && inputs.taxtime === true) {
        helper.taxtotal = -Math.max(0, helper.interest - inputs.taxfree) * inputs.taxrate;
        helper.terminal += helper.taxtotal;
      }
      return inputs.terminal - helper.terminal;
    }


    /* ******** 4. COMPUTATIONS ******** */
    if (inputs.calcselect === 3) {   // compute principle if only terminal is supplied
      inputs.principal = math.roots(computePrincipal, 1000, 1500);
      if (!validator.isFloat(inputs.principal)) {  // sanitize result and return if sthg wring
        helpers.errors.set("Leider konnte die Anlagesumme für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass die Anlagesumme außergewöhnlich niedrig oder hoch ist.", undefined, true);
        return helpers.errors.errorMap;
      }
    }

    for (i = 1; i <= inputs.term; i++) {
      dyn[0][i - 1] = i;        // period
      dyn[1][i - 1] = (i === 1) ? inputs.principal : dyn[4][i - 2];               // initial capital
      dyn[2][i - 1] = (inputs.interestselection) ? dyn[1][i - 1] * interest[i - 1] : interest[i - 1] * inputs.principal;       // flow interest
      (inputs.taxes && inputs.taxtime === false) ? dyn[5][i - 1] = -Math.max(0, dyn[2][i - 1] - inputs.taxfree) * inputs.taxrate : dyn[5][i - 1] = 0;   // taxes
      dyn[6][i - 1] = dyn[2][i - 1] + dyn[5][i - 1];                                                                         // flow interest after tax
      (inputs.interestselection) ? cf.push([i, 0]) : cf.push([i, dyn[6][i - 1]]);                                          // cash flow array
      dyn[3][i - 1] = (i === 1) ? dyn[2][i - 1] + dyn[5][i - 1] : dyn[3][i - 2] + dyn[2][i - 1] + dyn[5][i - 1];      // accumulated interest after taxes
      dyn[4][i - 1] = inputs.principal + dyn[3][i - 1];                         // terminal capital
    }

    // transpose dyn
    dynT = math.transpose(dyn);


    /*
     * COMPUTE AGGREGATE VALUES
     */
    helper.terminal = dyn[4][i - 2];
    helper.interest = _.reduce(dyn[2], helpers.add, 0);
    helper.linearinterest = (helper.interest / inputs.term) / inputs.principal;

    if (inputs.taxes && inputs.taxtime === false) {
      helper.taxtotal = _.reduce(dyn[5], helpers.add, 0);
      helper.interestwtax = _.reduce(dyn[6], helpers.add, 0);
      helper.linearinterest = (helper.interestwtax / inputs.term) / inputs.principal;
    } else if (inputs.taxes && inputs.taxtime === true) {
      helper.taxtotal = -Math.max(0, helper.interest - inputs.taxfree) * inputs.taxrate;
      helper.interestwtax = helper.interest + helper.taxtotal;
      helper.terminal += helper.taxtotal;
      helper.linearinterest = (helper.interestwtax / inputs.term) / inputs.principal;
    }

    if (inputs.interestselection) { // add initial/final value to last cash flow
      cf[i - 2][1] = dyn[4][i - 2];
    } else {
      cf[i - 2][1] += inputs.principal;
      if (inputs.taxes && inputs.taxtime === true) {
        cf[i - 2][1] += helper.taxtotal;
      }
    }

    // use simple calculation for irr if there is compounding, as there is a single cash flow only; else, use rootfinder
    if (inputs.interestselection) {
      helper.effectiveinterest = Math.pow(helper.terminal / inputs.principal, 1 / inputs.term) - 1;
    } else {
      helper.effectiveinterest = math.roots(function (i) {
        return inputs.principal - f.basic.pv(i, cf)
      }, 0.01, 1500);
      if (!validator.isFloat(helper.effectiveinterest)) {  // sanitize result and return if sthg wring
        helpers.messages.set("Leider konnte der Effektivzins für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass der Effektivzins außergewöhnlich hoch oder niedrig ist.", 2);
      }
    }

    // attach final rows
    dynT.push(['Summen', inputs.principal, helper.interest, helper.interest, helper.terminal, helper.taxtotal, helper.interestwtax, undefined, undefined, true]);


    /* ******** 5. CONSTRUCT RESULT DATA OBJECT ******** */;
    result.id = data[0].id;

    /*
     5.A FIRST RESULT CONTAINER
     */
    if (inputs.calcselect === 2) {
      //result._1.value = _.extend(_.findWhere(data[0].results_1,{name: selectMap[inputs.select]}), {"value": helper.result});
      result._1.terminal = _.extend(_.findWhere(data[0].results_1,{name: 'terminalmain'}), {"value": helper.terminal});
      //result._1.terminal = _.extend(localElems['terminalmain'], {"value": helper.terminal});
      result._1.principal = _.extend(_.findWhere(data[0].results_1,{name: 'principal'}), {"value": helper.principal});
      //result._1.principal = _.extend(localElems['principal'], {"value": inputs.principal || helper.principal});
      result._1.interest = _.extend(_.findWhere(data[0].results_1,{name: 'interest'}), {"value": helper.interest});
      //result._1.interest = _.extend(localElems['interest'], {"value": helper.interest});
    } else {
      result._1.principal = _.extend(_.findWhere(data[0].results_1,{name: 'principalmain'}), {"value": inputs.principal || helper.principal});
      //result._1.principal = _.extend(localElems['principalmain'], {"value": inputs.principal || helper.principal});
      result._1.interest = _.extend(_.findWhere(data[0].results_1,{name: 'interest'}), {"value": helper.interest});
      //result._1.interest = _.extend(localElems['interest'], {"value": helper.interest});
      result._1.terminal = _.extend(_.findWhere(data[0].results_1,{name: 'terminal'}), {"value": helper.terminal});
      //result._1.terminal = _.extend(localElems['terminal'], {"value": helper.terminal});
    }
    if (inputs.taxes) {
      result._1.taxes = _.extend(_.findWhere(data[0].results_1,{name: 'taxes'}), {"value": helper.taxtotal});
      //result._1.taxes = _.extend(localElems['taxes'], {"value": helper.taxtotal})
    }
    result._1.averageinterest   = _.extend(_.findWhere(data[0].results_1,{name: 'averageinterest'}), {"value": helper.averageinterest * 100});
    //result._1.averageinterest = _.extend(localElems['averageinterest'], {"value": helper.averageinterest * 100});
    result._1.linearinterest    = _.extend(_.findWhere(data[0].results_1,{name: 'linearinterest'}), {"value": helper.linearinterest * 100});
    //result._1.linearinterest  = _.extend(localElems['linearinterest'], {"value": helper.linearinterest * 100});
    result._1.effectiveinterest = _.extend(_.findWhere(data[0].results_1,{name: 'effectiveinterest'}), {"value": helper.effectiveinterest * 100});
    //result._1.effectiveinterest= _.extend(localElems['effectiveinterest'], {"value": helper.effectiveinterest * 100});


    /*
     5.B SECOND RESULT CONTAINER
     */
    result._2.title = 'Entwicklung Sparguthaben';
    result._2.header = ['Jahr', 'Guthaben Jahresanfang', 'Zinsertrag', 'Summe Zinsertrag', 'Guthaben Jahresende', 'Steuerlast', 'Zinsertrag nach Steuer'];
    result._2.body = dynT;
    result._2.tax = inputs.taxes;

    /*
     5.C FIRST CHART
     */
    var labels1 = dyn[0];
    var series1 = [dyn[1], dyn[6]];
    result._chart1.id = 'chart1';
    result._chart1.title = 'Entwicklung des Sparguthabens';
    result._chart1.legend = ['Guthaben Start', 'Zinsertrag nach Steuer'];
    result._chart1.label = {x: 'Jahr', y: "Guthaben Ende"};
    result._chart1.type = 'Bar';
    result._chart1.data = {labels: labels1, series: series1};
    if (inputs.term >= 15) {  // use slim bars if more than 20 periods
      result._chart1.options = {
        stackBars: true,
        axisY: {offset: 60},
        seriesBarDistance: 6,
        classNames: {bar: 'ct-bar-slim'}
      };
    } else if (inputs.period >= 6) {
      result._chart1.options = {
        stackBars: true,
        axisY: {offset: 60},
        seriesBarDistance: 12,
        classNames: {bar: 'ct-bar'}
      };
    } else {
      result._chart1.options = {
        stackBars: true,
        axisY: {offset: 60},
        seriesBarDistance: 18,
        classNames: {bar: 'ct-bar-thick'}
      };
    }

    /*
     5.D SECOND CHART
     */
    result._chart2.data = {
      //labels: ['Kaufpreis Immobilie','Grunderwerbssteuer'],
      series: [inputs.principal || helper.principal, helper.interest]
    };
    result._chart2.id = 'chart2';
    result._chart2.title = 'Zusammensetzung Endwert';
    result._chart2.legend = ['Anlagesumme', 'Zinsertrag'];
    result._chart2.options = {showLabel: false, donut: false, labelOffset: 0};
    result._chart2.type = 'Pie';


    // attach messages
    result.messages = helpers.messages.messageMap;

    return result;
  }

  return Calc.findByCalcname('savingscheme')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });


};




/** DEPOSITS-INTERESTPENALTY function that computes parameters for interest penalty ("Vorschusszinsen")
 * ARGUMENTS XXX todo: documenation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.interestpenalty = function(inputs) {

  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  helpers.messages.clear();
  helpers.errors.clear();
  var result = {}, helper = {};
  result._1 = {};
  var errorMap;

  function compute(data){
    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0) {
      return errorMap;
    }

    inputs.interest = inputs.interest / 100;
    inputs.factor = inputs.factor / 100;

    /* ******** 3. COMPUTATIONS ******** */
    helper.interestprincipal = Math.max(0, inputs.principal - inputs.allowance);
    helper.interest = inputs.factor * inputs.interest;
    helper.interestpenalty = helper.interestprincipal * helper.interest * inputs.term / inputs.interestdays;


    /* ******** 5. CONSTRUCT RESULT DATA OBJECT ******** */
    result.id = data[0].id;


    /*
     5.A FIRST RESULT CONTAINER
     */

    result._1.interestpenalty   = _.extend(_.findWhere(data[0].results_1,{name: 'interestpenalty'}), {"value": helper.interestpenalty});
    //result._1.interestpenalty   = _.extend(localElems['interestpenalty'],    {"value": helper.interestpenalty});
    result._1.interestprincipal   = _.extend(_.findWhere(data[0].results_1,{name: 'interestprincipal'}), {"value": helper.interestprincipal});
    //result._1.interestprincipal = _.extend(localElems['interestprincipal'],  {"value": helper.interestprincipal});
    result._1.interest   = _.extend(_.findWhere(data[0].results_1,{name: 'interest'}), {"value": helper.interest * 100});
    //result._1.interest          = _.extend(localElems['interest'],           {"value": helper.interest * 100});

    return result;
  }

  return Calc.findByCalcname('interestpenalty')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });

};


/** DEPOSITS-OVERNIGHT function that computes parameters for overnight deposits ("Tagesgeld")
 * ARGUMENTS XXX todo: documenation

 * ACTIONS
 *   none
 * RETURNS XXX

 */
exports.overnight = function(inputs) {

  /** ******** 1. INIT AND ASSIGN ******** */
  var Calc = require('mongoose').model('Calc');
  helpers.messages.clear();
  helpers.errors.clear();
  var result = {};
  result._1 = {};
  result._2 = {};
  result._chart1 = {};
  var helper = {};
  var errorMap;
  var interestSteps = [];
  var selectMap = [undefined, 'interestgain', 'principal', 'interest', 'interestdays'];
  var interestMap = [];
  var i;


  function compute(data){

    /** ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
    /** drop elements that are to be computed from input and expectedinputs object */
    delete inputs[selectMap[inputs.calcselect]];
    data[0].inputs.splice(_.findIndex(data[0].inputs, {name: selectMap[inputs.calcselect]}), 1);
    //delete _expectedInputs[selectMap[inputs.calcselect]];

    if(inputs.periodselect === 'false'){
      delete inputs.begindate;
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'begindate'}), 1);
      //delete _expectedInputs.begindate;
      delete inputs.enddate;
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'enddate'}), 1);
      //delete _expectedInputs.enddate;
    }


    if(inputs.interesttype === 'true'){
      delete inputs.interest;
      data[0].inputs.splice(_.findIndex(data[0].inputs, {name: 'interest'}), 1);
      //delete _expectedInputs.interest;
    }

    /** run validation method */
    errorMap = helpers.validate(inputs, data[0].inputs);
    if (errorMap.length !== 0) {
      return errorMap;
    }


    /** extract denominator from interestmethod */
    if (inputs.daycount === 'a30E360' || inputs.daycount === 'a30360' || inputs.daycount === 'act360') {
      helper.denom = 360;
    } else if (inputs.daycount === 'act365') {
      helper.denom = 365;
    } else if (inputs.daycount === 'actact') {
      helper.denom = 365.25;
    } else {
      helpers.errors.set("Beim auslesen der Zinsmethode ist ein unerwarteter Fehler aufgetreten. Bitte versuchen Sie es noch einmal.", undefined, true);
      return helpers.errors.errorMap;
    }


    /** compute interestdays and interestfactor if period given as date range */
    if (inputs.periodselect) {
      /** do custom validations */
      if (inputs.enddate === "") {
        helpers.errors.set("Das Enddatum muss ausgefüllt sein.", undefined, true);
        return helpers.errors.errorMap;
      } else if (inputs.begindate === "") {
        helpers.errors.set("Das Anfangsdatum muss ausgefüllt sein.", undefined, true);
        return helpers.errors.errorMap;
      } else if (inputs.enddate < inputs.begindate) {
        helpers.errors.set("Das Enddatum kann nicht vor dem Anfangsdatum liegen.", undefined, true);
        return helpers.errors.errorMap;
      }

      /** compute interestdays and assign them to inputs */
      range = {"begindate": inputs.begindate, "enddate": inputs.enddate, "skipvalidation": true};
      helper.container = misc.daycount(range)._1;
      inputs.interestdays = helper.container['' + inputs.daycount + 'interestdays'].value;
      helper.factor = helper.container['' + inputs.daycount + 'factor'].value;
      // helper.factorF = helper.container['' + inputs.daycount + 'factorF'].value;

      /** compute interestfactor if interestdays are given */
    } else {
      helper.factor = inputs.interestdays / helper.denom;
    }

    /** convert percentage values to decimals */
    inputs.interest  = inputs.interest / 100;
    inputs.taxrate   = inputs.taxrate / 100;


    /** ******** 3. HELPER FUNCTIONS ******** */

    /** function that returns interestgain with step interest */
    function stepInterest (interestSteps, principal, factor){
      var interestgain = 0, nextVal;
      interestSteps.forEach(function (val, ind, arr) {
        ind < (arr.length - 1) ? nextVal = arr[ind + 1][0] : nextVal = Infinity;
        principal > nextVal ? interestgain += (nextVal - val[0]) * val[1] * factor : interestgain += Math.max(0, principal - val[0]) * val[1] * factor;
      });
      return interestgain;
    }

    /** wrapper function for rootfinder that accepts principal (x) as only free var (stepinterest) */
    function fun(x){
      return stepInterest(interestSteps, x, helper.factor) - helper.interestgain;
    }

    /** wrapper function for rootfinder that accepts principal (x) as only free var */
    function fun2(x){
      return f.basic.tvInterestdaysSubperiodsLinear(x, inputs.interest, helper.denom, inputs.interestdays, interestMap[inputs.interestperiod], inputs.taxes, inputs.taxrate, inputs.taxfree).terminal - x - inputs.interestgain;
    }

    /** wrapper function for rootfinder that accepts the interest rate (x) as only free var */
    function fun3(x){
      return f.basic.tvInterestdaysSubperiodsLinear(inputs.principal, x, helper.denom, inputs.interestdays, interestMap[inputs.interestperiod], inputs.taxes, inputs.taxrate, inputs.taxfree).terminal - inputs.principal - inputs.interestgain;
    }

    /** wrapper function for rootfinder that accepts factor (x) as only free variable */
    function fun4(x){
      return stepInterest(interestSteps, inputs.principal, x) - helper.interestgain;
    }

    /** wrapper function for rootfinder that accepts interestdays (x) as only free variable */
    function fun5(x){
      return f.basic.tvInterestdaysSubperiodsLinear(inputs.principal, inputs.interest, helper.denom, x, interestMap[inputs.interestperiod], inputs.taxes, inputs.taxrate, inputs.taxfree).terminal - inputs.principal - inputs.interestgain;
    }


    /** ******** 4. COMPUTATIONS ******** */

    /**
     * 4.A PREPARATIONS
     */

    /** construct step interest array if necessary */
    if(inputs.interesttype){
      helper.length = inputs.specialinterestpositions;
      for (i = 0; i < helper.length; i++){
        helper.step = _.find(inputs, function(val, ind){return ind === ('specialinterestthreshold' + i);});
        helper.int  = _.find(inputs, function(val, ind){return ind === ('specialinterest' + i);});
        if(isFinite(helper.step) && isFinite(helper.int)){
          interestSteps.push([helper.step, helper.int / 100]);
        }
      }
      interestSteps = interestSteps.sort(function(a,b){ return a[0] > b[0]; });
      if(interestSteps[0][0] !== 0){  /** warn that interest is set to zero for first step */
      helpers.messages.set("Hinweis: Bei den Eingaben zur guthabenabhängigen Verzinsung wurde kein Zinssatz für Guthaben ab 0,00 EUR eingebenen. Der Zinssatz für die erste Staffel wurde daher auf null gesetzt. Überprüfen Sie, ob dies korrekt ist und geben Sie gegebenenfalls einen Zinssatz für die 1. Guthabenstaffel ein.",2);
        interestSteps.unshift([0, 0]);
      }
    }


    /**
     * 4.B COMPUTE INTERESTGAIN
     */
    if(inputs.calcselect === 1){

      if(inputs.interesttype){
        /** compute interestgain with step interest */
        if (inputs.interestperiod === 0) {
          inputs.interestgain = inputs.interestgain || stepInterest(interestSteps, inputs.principal, helper.factor);
          helper.averageinterest = (inputs.interestgain / (inputs.principal * helper.factor)) * 100;

          if (inputs.taxes) {
            helper.taxes = -Math.max(0, inputs.interestgain - inputs.taxfree) * inputs.taxrate;
            helper.interestgainAfterTax = inputs.interestgain + helper.taxes;
          } else {
            helper.interestgainAfterTax = inputs.interestgain;
          }
        } else {
          helpers.errors.set("Leider können bei guthabenabhängiger Verzinsung keine Zinseszinsen berücksichtigt werden. Bitte wählen Sie 'Auszahlung / kein Zinseszins' im Feld 'Zinsperiode'",undefined , true);
          return helpers.errors.errorMap;
        }
      } else {
        /** compute interestgain w/o step interest */
        interestMap = [undefined, helper.denom, 12, 4, 2, 1];
        if (inputs.interestperiod === 0) {
          inputs.interestgain = inputs.interestgain || inputs.principal * inputs.interest * helper.factor;
          if(inputs.taxes){
            helper.taxes = - Math.max(0, inputs.interestgain - inputs.taxfree) * inputs.taxrate;
            helper.interestgainAfterTax = inputs.interestgain + helper.taxes;
          } else {
            helper.interestgainAfterTax = inputs.interestgain;
          }
        } else {
          helper.result = f.basic.tvInterestdaysSubperiodsLinear(inputs.principal, inputs.interest, helper.denom, inputs.interestdays, interestMap[inputs.interestperiod], inputs.taxes, inputs.taxrate, inputs.taxfree);
          helper.interestgainAfterTax = inputs.interestgain || helper.result.terminal - inputs.principal;
          inputs.interestgain = inputs.interestgain || helper.result.terminal - inputs.principal - helper.result.tax;
          helper.taxes = helper.result.tax;
        }
      }

    /**
     * 4.C COMPUTE PRINCIPAL/INITIAL CAPITAL
     */
    } else if(inputs.calcselect === 2){

      if(inputs.interesttype){
        /** compute principal with step interest */
        if (inputs.interestperiod === 0) {

          /** in case of taxes, compute interestgain before taxes */
          if (inputs.taxes) {
            helper.interestgain = (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate) < inputs.taxfree ? inputs.interestgain :  (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate);
            helper.taxes = -Math.max(0, helper.interestgain - inputs.taxfree) * inputs.taxrate;
          } else {
            helper.interestgain = inputs.interestgain;
          }

          helper.temp = math.roots(fun,12,1500);
          if(!validator.isFloat(helper.temp)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte das Anfangskapital für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass das Anfangskapital für die eingegebenen Parameter außergewöhnlich niedrig oder hoch ist. Falls Sie eine guthabenabhängige Verzinsung eingegeben haben, müssen alle Zinssätze (von Guthaben ab 0 EUR) positiv sein, damit das Anfangskapital berechnet werden kann.",undefined , true);
            return helpers.errors.errorMap;
          } else {
            inputs.principal = inputs.principal || helper.temp;
          }

          helper.averageinterest = (helper.interestgain / (inputs.principal * helper.factor)) * 100;

        } else {
          helpers.errors.set("Leider können bei guthabenabhängiger Verzinsung keine Zinseszinsen berücksichtigt werden. Bitte wählen Sie 'Auszahlung / kein Zinseszins' im Feld 'Zinsperiode'",undefined , true);
          return helpers.errors.errorMap;
        }
      } else {

        /** make sure interest rate is not zero, as calculation would be impossible */
        if(inputs.interest === 0){
          helpers.errors.set("Für die Berechnung des Anfangskapitals darf der Zinssatz nicht null sein. Bitte geben Sie einen positiven Zinssatz ein.", undefined, true);
          return helpers.errors.errorMap;
        }

        /** compute principal w/o step interest */
        interestMap = [undefined, helper.denom, 12, 4, 2, 1];
        if (inputs.interestperiod === 0) {  /** case no compounding */
          if(inputs.taxes){
            helper.interestgain = (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate) < inputs.taxfree ? inputs.interestgain :  (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate);
            helper.taxes = -Math.max(0, helper.interestgain - inputs.taxfree) * inputs.taxrate;
          } else {
            helper.interestgain = inputs.interestgain;
          }
          inputs.principal = inputs.principal || helper.interestgain / (inputs.interest * helper.factor);

        } else {  /** case compounding */

          helper.temp = math.roots(fun2,12,1500);

          if(!validator.isFloat(helper.temp)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte das Anfangskapital für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass das Anfangskapital für die eingegebenen Parameter außergewöhnlich niedrig oder hoch ist.",undefined , true);
            return helpers.errors.errorMap;
          } else {
            inputs.principal = inputs.principal || helper.temp;
          }
          if(inputs.taxes){
            helper.taxes = f.basic.tvInterestdaysSubperiodsLinear(inputs.principal, inputs.interest, helper.denom, inputs.interestdays, interestMap[inputs.interestperiod], inputs.taxes, inputs.taxrate, inputs.taxfree).tax;
            helper.interestgain = inputs.interestgain - helper.taxes;
          }
        }
      }


    /**
     * 4.D COMPUTE INTEREST RATE
     */
    } else if (inputs.calcselect === 3){

      /** interest rate with step interest - this is impossible, hence the need to throw an error */
      if(inputs.interesttype) {
        helpers.errors.set("Für die guthabenabhängige Verzinsung kann der Zinssatz nicht eindeutig berechnet werden, da es mehrere Zinssätze gibt. Bitte wählen Sie einen anderen Parameter im Feld 'Was soll berechnet werden?' bzw. wählen Sie 'NEIN' im Feld 'guthabenabhängige Verzinsung'.", undefined, true);
        return helpers.errors.errorMap;

      /** compute interest rate w/o step interest */
      } else {
        interestMap = [undefined, helper.denom, 12, 4, 2, 1];
        if (inputs.interestperiod === 0) {  /** case no compounding */
          if(inputs.taxes){
            helper.interestgain = (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate) < inputs.taxfree ? inputs.interestgain :  (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate);
            helper.interest = helper.interestgain / (inputs.principal * helper.factor);
            helper.taxes = -Math.max(0, helper.interestgain - inputs.taxfree) * inputs.taxrate;
          } else {
            helper.interest = inputs.interestgain / (inputs.principal * helper.factor);
          }
        } else {  /** case compounding */

          helper.temp = math.roots(fun3,0.02,1500);

          if(!validator.isFloat(helper.temp)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte der Zinssatz für die angegebenen Parameter nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass der Zinssatz außergewöhnlich niedrig (negativ) oder hoch ist.",undefined , true);
            return helpers.errors.errorMap;
          } else {
            helper.interest = helper.temp;
          }
          if(inputs.taxes){
            helper.taxes = f.basic.tvInterestdaysSubperiodsLinear(inputs.principal, helper.interest, helper.denom, inputs.interestdays, interestMap[inputs.interestperiod], inputs.taxes, inputs.taxrate, inputs.taxfree).tax;
            helper.interestgain = inputs.interestgain - helper.taxes;
          }
        }
      }


    /**
     * 4.E COMPUTE INTEREST DAYS / TERM
     */
    } else if (inputs.calcselect === 4){

      /** interest days with step interest */
      if(inputs.interesttype){

        /** in case of taxes, compute interestgain before taxes */
        if (inputs.taxes) {
          helper.interestgain = (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate) < inputs.taxfree ? inputs.interestgain :  (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate);
          helper.taxes = -Math.max(0, helper.interestgain - inputs.taxfree) * inputs.taxrate;
        } else {
          helper.interestgain = inputs.interestgain;
        }

        /** compute factor */
        helper.temp = math.roots(fun4,10,1500);

        if(!validator.isFloat(helper.temp)){  // sanitize result and return if sthg wring
          helpers.errors.set("Leider konnte die Laufzeit in Zinstagen nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass die Laufzeit außergewöhnlich kurz oder lang ist.",undefined , true);
          return helpers.errors.errorMap;
        } else {
          helper.factor = helper.temp;
          helper.interestdays = helper.factor * helper.denom;
        }

        helper.averageinterest = (helper.interestgain / (inputs.principal * helper.factor)) * 100;

      /** compute interest days w/o step interest */
      } else {
        interestMap = [undefined, helper.denom, 12, 4, 2, 1];
        if (inputs.interestperiod === 0) {  /** case no compounding */
          if(inputs.taxes){
            helper.interestgain = (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate) < inputs.taxfree ? inputs.interestgain :  (inputs.interestgain - inputs.taxfree * inputs.taxrate) / (1 - inputs.taxrate);
            helper.taxes = -Math.max(0, helper.interestgain - inputs.taxfree) * inputs.taxrate;
          } else {
            helper.interestgain = inputs.interestgain;
          }
          helper.factor = helper.interestgain / (inputs.principal * inputs.interest);
          helper.interestdays = helper.factor * helper.denom;
          helper.averageinterest = (inputs.interestgain / (inputs.principal * helper.factor)) * 100;

        } else {  /** case compounding */

          helper.temp = math.roots(fun5,20,1500);

          if(!validator.isFloat(helper.temp)){  // sanitize result and return if sthg wring
            helpers.errors.set("Leider konnte die Laufzeit in Zinstagen nicht verlässlich berechnet werden. Meist ist der Grund dafür, dass die Laufzeit außergewöhnlich kurz oder lang ist.",undefined , true);
            return helpers.errors.errorMap;
          } else {
            helper.interestdays = helper.temp;
            helper.factor = helper.interestdays / helper.denom;
          }

          if(inputs.taxes){
            helper.taxes = f.basic.tvInterestdaysSubperiodsLinear(inputs.principal, inputs.interest, helper.denom, helper.interestdays, interestMap[inputs.interestperiod], inputs.taxes, inputs.taxrate, inputs.taxfree).tax;
            helper.interestgain = inputs.interestgain - helper.taxes;
          }
        }
      }
    }



    /** ******** 5. CONSTRUCT RESULT OBJECT ******** */
    result.id = data[0].id;

    /**
     * 5.A FIRST RESULT CONTAINER
     */
    if(inputs.calcselect === 1) {
      result._1.terminal = _.extend(_.findWhere(data[0].results_1,{name: 'terminal'}), {"value": inputs.principal + helper.interestgainAfterTax});
      //result._1.terminal = _.extend(localElems['terminal'], {"value": inputs.principal + helper.interestgainAfterTax});
      if (inputs.taxes) {
        result._1.interestgainAfterTax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainaftertax'}), {"value": helper.interestgainAfterTax});
        //result._1.interestgainAfterTax = _.extend(localElems['interestgainaftertax'], {"value": helper.interestgainAfterTax});
        result._1.interestgainBeforeTax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainbeforetax'}), {"value": inputs.interestgain});
        //result._1.interestgainBeforeTax = _.extend(localElems['interestgainbeforetax'], {"value": inputs.interestgain});
        result._1.taxes = _.extend(_.findWhere(data[0].results_1,{name: 'taxes'}), {"value": helper.taxes});
        //result._1.taxes = _.extend(localElems['taxes'], {"value": helper.taxes});
      } else {
        result._1.value = _.extend(_.findWhere(data[0].results_1,{name: selectMap[inputs.calcselect]}), {"value": inputs[selectMap[inputs.calcselect]]});
        //result._1.value = _.extend(localElems[selectMap[inputs.calcselect]], {"value": inputs[selectMap[inputs.calcselect]]});
      }
      result._1.interestfactor = _.extend(_.findWhere(data[0].results_1,{name: 'interestfactor'}), {"value": helper.factor});
      //result._1.interestfactor = _.extend(localElems['interestfactor'], {"value": helper.factor});
      (inputs.periodselect) ? result._1.interestdays = _.extend(_.findWhere(data[0].results_1,{name: 'interestdays'}), {"value": inputs.interestdays}) : null;
      //(inputs.periodselect) ? result._1.interestdays = _.extend(localElems['interestdays'], {"value": inputs.interestdays}) : null;
      (inputs.interesttype) ? result._1.averageinterest = _.extend(_.findWhere(data[0].results_1,{name: 'averageinterest'}), {"value": helper.averageinterest}) : null;
      //(inputs.interesttype) ? result._1.averageinterest = _.extend(localElems['averageinterest'], {"value": helper.averageinterest}) : null;

    } else if (inputs.calcselect === 2){
      result._1.principal = _.extend(_.findWhere(data[0].results_1,{name: 'principal'}), {"value": inputs.principal});
      //result._1.principal = _.extend(localElems['principal'], {"value": inputs.principal});
      result._1.terminal = _.extend(_.findWhere(data[0].results_1,{name: 'terminal'}),  {"value": inputs.principal + inputs.interestgain});
      //result._1.terminal  = _.extend(localElems['terminal'],  {"value": inputs.principal + inputs.interestgain});
      if (inputs.taxes) {
        result._1.interestgainAfterTax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainaftertax'}),  {"value": inputs.interestgain});
        //result._1.interestgainAfterTax = _.extend(localElems['interestgainaftertax'], {"value": inputs.interestgain});
        result._1.interestgainBeforeTax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainbeforetax'}), {"value": helper.interestgain});
        //result._1.interestgainBeforeTax = _.extend(localElems['interestgainbeforetax'], {"value": helper.interestgain});
        result._1.taxes = _.extend(_.findWhere(data[0].results_1,{name: 'taxes'}), {"value": helper.taxes});
        //result._1.taxes = _.extend(localElems['taxes'], {"value": helper.taxes});
      } else {
        result._1.interestgain = _.extend(_.findWhere(data[0].results_1,{name: 'interestgain'}), {"value": inputs.interestgain});
        //result._1.interestgain = _.extend(localElems['interestgain'], {"value": inputs.interestgain});
      }
      result._1.interestfactor = _.extend(_.findWhere(data[0].results_1,{name: 'interestfactor'}), {"value": helper.factor});
      //result._1.interestfactor = _.extend(localElems['interestfactor'], {"value": helper.factor});
      (inputs.interesttype) ? result._1.averageinterest = _.extend(_.findWhere(data[0].results_1,{name: 'averageinterest'}), {"value": helper.averageinterest}) : null;
      //(inputs.interesttype) ? result._1.averageinterest = _.extend(localElems['averageinterest'], {"value": helper.averageinterest}) : null;

    } else if (inputs.calcselect === 3){
      result._1.interest = _.extend(_.findWhere(data[0].results_1,{name: 'interest'}), {"value": helper.interest * 100});
      //result._1.interest       = _.extend(localElems['interest'], {"value": helper.interest * 100});
      result._1.terminal = _.extend(_.findWhere(data[0].results_1,{name: 'terminal'}), {"value": inputs.principal + inputs.interestgain});
      //result._1.terminal       = _.extend(localElems['terminal'], {"value": inputs.principal + inputs.interestgain});
      if(inputs.taxes){
        result._1.interestgainAfterTax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainaftertax'}),  {"value": inputs.interestgain});
        //result._1.interestgainAfterTax  = _.extend(localElems['interestgainaftertax'], {"value": inputs.interestgain});
        result._1.interestgainBeforeTax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainbeforetax'}), {"value": helper.interestgain});
        //result._1.interestgainBeforeTax = _.extend(localElems['interestgainbeforetax'], {"value": helper.interestgain});
        result._1.taxes = _.extend(_.findWhere(data[0].results_1,{name: 'taxes'}), {"value": helper.taxes});
        //result._1.taxes                 = _.extend(localElems['taxes'], {"value": helper.taxes});
      } else {
        result._1.interestgain = _.extend(_.findWhere(data[0].results_1,{name: 'interestgain'}), {"value": inputs.interestgain});
        //result._1.interestgain = _.extend(localElems['interestgain'], {"value": inputs.interestgain});
      }
      result._1.interestfactor = _.extend(_.findWhere(data[0].results_1,{name: 'interestfactor'}), {"value": helper.factor});
      //result._1.interestfactor = _.extend(localElems['interestfactor'], {"value": helper.factor});

    } else if (inputs.calcselect === 4){
      result._1.interestdays = _.extend(_.findWhere(data[0].results_1,{name: 'interestdaysfirst'}), {"value": helper.interestdays});
      //result._1.interestdays   = _.extend(localElems['interestdaysfirst'], {"value": helper.interestdays});
      result._1.terminal = _.extend(_.findWhere(data[0].results_1,{name: 'terminal'}), {"value": inputs.principal + inputs.interestgain});
      //result._1.terminal       = _.extend(localElems['terminal'], {"value": inputs.principal + inputs.interestgain});
      if(inputs.taxes){
        result._1.interestgainAfterTax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainaftertax'}),  {"value": inputs.interestgain});
        //result._1.interestgainAfterTax  = _.extend(localElems['interestgainaftertax'],  {"value": inputs.interestgain});
        result._1.interestgainBeforeTax = _.extend(_.findWhere(data[0].results_1,{name: 'interestgainbeforetax'}), {"value": helper.interestgain});
        //result._1.interestgainBeforeTax = _.extend(localElems['interestgainbeforetax'], {"value": helper.interestgain});
        result._1.taxes = _.extend(_.findWhere(data[0].results_1,{name: 'taxes'}), {"value": helper.taxes});
        //result._1.taxes                 = _.extend(localElems['taxes'], {"value": helper.taxes});
      }
      result._1.interestfactor = _.extend(_.findWhere(data[0].results_1,{name: 'interestfactor'}), {"value": helper.factor});
      //result._1.interestfactor = _.extend(localElems['interestfactor'], {"value": helper.factor});
      (inputs.interesttype) ? result._1.averageinterest = _.extend(_.findWhere(data[0].results_1,{name: 'averageinterest'}), {"value": helper.averageinterest}) : null;
      //(inputs.interesttype) ? result._1.averageinterest = _.extend(localElems['averageinterest'], {"value": helper.averageinterest}) : null;
    }

    /** add final messages */
    if(!inputs.periodselect && inputs.daycount === 'actact'){
      helpers.messages.set("Hinweis: Für die korrekte Anwendung der taggenauen Zinsmethode act / act muss der Zeitraum als Datum angegeben werden. Um dennoch Ergebnisse berechnen zu können wurde das Basisjahr auf die durchschnittliche Anzahl von Tagen in einem Jahr gesetzt (365,25).",2);
    }

    /** attach messages */
    result.messages = helpers.messages.messageMap;

    /** construct chart 1 */
    result._chart1.data = {
      series: [inputs.principal, helper.interestgainAfterTax || inputs.interestgain]

    };


    result._chart1.id = 'chart1';
    result._chart1.title = 'Zusammensetzung Endkapital';
    result._chart1.legend = ['Anfangskapital', 'Zinsertrag (nach Steuer)'];
    result._chart1.options = {showLabel: false, donut: false, labelOffset: 0};
    result._chart1.type = 'Pie';



    return result;
  }


  return Calc.findByCalcname('overnight')
      .then(compute)
      .onReject(function(){
        console.log("Database read error");
        helpers.errors.set("Leider ist bei der Berechnung ein Fehler aufgetreten.",undefined , true);
        return helpers.errors.errorMap;
      });

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