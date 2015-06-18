var _ = require('underscore');
var helpers = require('./helpers');
var math = require('./math');
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

/* DEPOSITS-SAVINGS function that computes parameters for a savings plan
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

  /* ******** 1. INIT AND ASSIGN ******** */
  var helper = {}, inflowHelper = null;
  var cash = [], cashT;
  var q, a, principalCompounded;
  var result = {}; result._1 = {}; result._2 = {};
  var localElems = calcElems.depsaving.outputs;
  var expectedInputs = calcElems.depsaving.inputs;
  var _expectedInputs = _.clone(expectedInputs);
  var errorMap;
  var selectMap = ['terminal','principal','inflow','term','interest'];


  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  // drop elems that are to be computed form input and expectedinputs object
  delete inputs[selectMap[inputs.select]];
  delete _expectedInputs[selectMap[inputs.select]];

  // run validations
  errorMap = helpers.validate(inputs, _expectedInputs);
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


  /* ******** 3. DEFINE LOCAL HELPER FUNCTIONS ******** */
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



  /* ******** 4. COMPUTATIONS ******** */
  /* 4A. NON-PERIODICAL CALCULATIONS */
  // compound principal
  principalCompounded = K * Math.pow(1 + r / mz, n * mz);

  // 4A.1. TERMINAL VALUE
  if (inputs.select === 0) {

    // compute terminal value for saving period (not dynamic)
    if (d === 0) {
      console.log('Here we are');
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
        console.log('here we are');
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
    console.log("Here we are");

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


  /* ******** 5. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.depsaving.id;
  // first result container
  result._1.value =          {'description': localElems[selectMap[inputs.select]].description,  'value': helper.result,                    'unit': localElems[selectMap[inputs.select]].unit, 'digits': localElems[selectMap[inputs.select]].digits, 'tooltip': localElems[selectMap[inputs.select]].tooltip};
  // second result container
  result._2.title = 'Sparkontoentwicklung';
  result._2.header = ['Monat', 'Guthaben <br> Beginn', 'Einzahlung <br>  Monatsende', 'Zinszahlung <br> Monatsende', 'Guthaben <br> Ende'];
  result._2.body = cashT;


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