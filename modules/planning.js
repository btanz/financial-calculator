// * MODULE COLLECTING FINANCIAL PLANNING FUNCTIONS
var helpers = require('./helpers');
var calcElems = require('../data/static/calcElems.json');

var terminalValueHelper, presentValueHelper, terminalRentValueHelper, annuityValueHelper, annualValueHelper, reverseAnnualValueHelper;




/* PLANNING-RETIRE function that computes available retirement savings
 * ARGUMENTS
 *   object inputs
 *      inputs.age                        current age; NUMBER
 *      inputs.retireAge                  planned retirement age; NUMBER
 *      inputs.lifeExpectancy             lebenserwartung; NUMBER
 *      inputs.savings                    initial capital stock; NUMBER (currency)
 *      inputs.futureSavings              future annual retirement saving contribution; NUMBER (currency)
 *      inputs.rate                       interest rate; NUMBER (%)
 *      inputs.inflation                  inflation rate; NUMBER (%)
 * ACTIONS
 *   none
 * COMPUTES
 *   object helper
 *     helper.balance            the total value of all retirement savings at retirement age / null if computation failed; NUMBER
 *     helper.balanceInfl        the inflation-adjusted total value of all retirement savings at retirement age / null if computation failed; NUMBER
 *     helper.annuityMth        the available monthly payment from retirement age until life expectancy
 *     helper.annuityYear       the available annual payment from retirement age until life expectancy
 *     helper.annuintyYearRetire the available annual payment from retirement age until life expectancy inflation adjusted to retirement age
 *     helper.annuintyYearLifeend the available annual payment from retirement age until life expectancy inflation adjusted to life exp. age
 *     helper.annuintyMthRetire  the available monthly payment from retirement age until life expectancy inflation adjusted to retirement age
 *     helper.annuintyMthLifeend the available monthly payment from retirement age until life expectancy inflation adjusted to life exp. age
 *     helper.annualBalances     an array of arrays, containing
 *              [0] year
 *              [1] account balance in year
 *              [2] inflation adjusted account balances in year
 *  RETURNS
 *   // todo documentation
 *
 */

exports.retire = function(inputs){


  /* ******** 1. INIT AND ASSIGN ******** */
  var helper = {};
  var result = {}; result._1 = {}; result._2 = {};
  var reverseAnnual;
  var localElems = calcElems.retire.outputs;
  var expectedInputs = calcElems.retire.inputs;
  var errorMap;

  /* ******** 2. INPUT ERROR CHECKING AND PREPARATIONS ******** */
  errorMap = helpers.validate(inputs, expectedInputs);
  if (errorMap.length !== 0){
    console.log(errorMap);
    return errorMap;
  }

  // convert percent to decimals for interest and inflation
  inputs.rate = inputs.rate/100;
  inputs.inflation = inputs.inflation/100;



  /* ******** 3. COMPUTATIONS ******** */
  // compute capital balance at retirement age w/o inflation adjustment
  helper.balance = terminalValueHelper(inputs.savings,inputs.retireAge - inputs.age,inputs.rate) +
      terminalRentValueHelper(inputs.futureSavings, inputs.retireAge - inputs.age, inputs.rate);

  // compute capital balance at retirement age with inflation adjustment
  helper.balanceInfl = terminalValueHelper(inputs.savings, inputs.retireAge - inputs.age, inputs.rate, inputs.inflation) +
      terminalRentValueHelper(inputs.futureSavings, inputs.retireAge - inputs.age, inputs.rate, inputs.inflation);

  // compute monthly annuity received after retirement age
  helper.annuityMth = annuityValueHelper(helper.balance,(inputs.lifeExpectancy - inputs.retireAge) * 12, inputs.rate / 12);

  // compute annual annuity received after retirement age
  helper.annuityYear = annuityValueHelper(helper.balance,(inputs.lifeExpectancy - inputs.retireAge), inputs.rate);

  // compute after inflation annuities
  helper.annuityMthRetire = presentValueHelper(helper.annuityMth, inputs.retireAge - inputs.age, inputs.inflation);
  helper.annuityMthLifeend = presentValueHelper(helper.annuityMth, inputs.lifeExpectancy - inputs.age , inputs.inflation);

  helper.annuityYearRetire = presentValueHelper(helper.annuityYear, inputs.retireAge - inputs.age, inputs.inflation);
  helper.annuityYearLifeend = presentValueHelper(helper.annuityYear, inputs.lifeExpectancy - inputs.age, inputs.inflation);

  // compute annual capital balances until retirement
  helper.annualBalances = annualValueHelper(inputs.savings, inputs.futureSavings, inputs.rate, inputs.age, inputs.retireAge, inputs.inflation);

  // call the reverseAnnualValueHelper to calculate the annual capital balances for the period where capital
  // is withdrawn from the capital stock i.e. once the capital inflow period is over an the retirement
  // age is reached; append the values for this period to the annualBalances array
  reverseAnnual= reverseAnnualValueHelper(helper.balance, helper.annuityMth, inputs.rate, inputs.retireAge, inputs.lifeExpectancy, inputs.inflation, inputs.age);
  helper.annualBalances[0] = helper.annualBalances[0].concat(reverseAnnual[0]);
  helper.annualBalances[1] = helper.annualBalances[1].concat(reverseAnnual[1]);
  helper.annualBalances[2] = helper.annualBalances[2].concat(reverseAnnual[2]);

  // transpose annualBalances Array
  helper.annualBalancesTransp = helper.annualBalances[0].map(function(col,i){
    return helper.annualBalances.map(function(row){
      return row[i];
    })
  });

  /* ******** 4. CONSTRUCT RESULT OBJECT ******** */
  result.id = calcElems.retire.id;

  // first result container
  result._1.annuityMth =       {'description': 'Monatliches Einkommen ab dem ' + inputs.retireAge + '. Lebensjahr',                         'value': helper.annuityMth,                               'unit': 'EUR', 'digits': 2, 'tooltip': localElems.annuityMth.tooltip};
  result._1.annuityMthRetire = {'description': 'Am ' + inputs.retireAge + '. Lebensjahr entspricht dieses Einkommen inflationsangepasst einem heutigen Wert von ',  'value': helper.annuityMthRetire, 'unit': 'EUR', 'digits': 2, 'tooltip': localElems.annuityMthRetire.tooltip};
  result._1.annuintyMthLifeend ={'description': 'Am ' + inputs.lifeExpectancy + '. Lebensjahr entspricht dieses Einkommen inflationsangepasst einem heutigen Wert von ',  'value': helper.annuityMthLifeend,'unit': 'EUR', 'digits': 2, 'tooltip': localElems.annuityMthLifeend.tooltip};
  result._1.balance =          {'description': 'Gesamtwert der Ersparnisse am ' + inputs.retireAge + '. Lebensjahr',                        'value': helper.balance,                                  'unit': 'EUR', 'digits': 2, 'tooltip': localElems.balance.tooltip};
  result._1.balanceInfl =      {'description': 'Inflationsangepasster Gesamtwert der Ersparnisse am ' + inputs.retireAge + '. Lebensjahr',  'value': helper.balanceInfl,                              'unit': 'EUR', 'digits': 2, 'tooltip': localElems.balanceInfl.tooltip};

  // second result container
  result._2.title = 'Wert der Ersparnisse im Zeitverlauf';
  result._2.header = ['Alter', 'Wert der Ersparnisse <br> (Jahresbeginn)','Wert der Ersparnisse <br> (Jahresbeginn, inflationsangepasst)'];
  result._2.body = helper.annualBalancesTransp;

  return result;

};






/* ***********************************************************************************************/
/* ************************ BEGIN PLANNING MODULE HELPERS (NOT EXPOSED) **************************/
/* ***********************************************************************************************/


/* PLANNING-TERMINAL_VALUE_HELPER function that computes terminal value of an investment */
terminalValueHelper = function(start,period,rate,inflation){
  if (arguments.length === 4){  // calculate inflation adjusted
    return start * Math.pow( (1 + rate)/(1 + inflation),period);
  } else if (arguments.length === 3) {  // no inflation adjustment
    return start * Math.pow(1 + rate,period);
  } else {  // sthg wrong
    return null;
  }
};

/* PLANNING-TERMINAL_RENT_VALUE_HELPER function that computes terminal value of a rent ('nachschüssige Rente') */
terminalRentValueHelper = function(rent,period,rate,inflation){
  if (arguments.length === 4) {  // calculate inflation adjusted
    return (rent * (Math.pow(1 + rate, period) - 1) / rate)/Math.pow(1/1+inflation,period);
    // return rent * (Math.pow((1 + rate)/(1 + inflation), period) - 1) / ((1+rate)/(1+inflation)-1); ALTERNATIVE
  } else if (arguments.length === 3){ // calculate w/o inflation adjustment
    return rent * (Math.pow(1 + rate, period) - 1) / rate;
  } else {
    return null;
  }
};

/* PLANNING-ANNUITY_VALUE_HELPER function that computes the annuity given an initial value and time period */
annuityValueHelper = function(start, period, rate){
  return start * Math.pow(1+rate,period)*rate / (Math.pow(1+rate,period) -1);
};

/* PLANNING-PRESENT_VALUE_HELPER computes the present value of a future cash flow*/
presentValueHelper = function(end, period, rate){
  return end / Math.pow(1+rate,period);
};

/* PLANNING-ANNUAL_VALUE_HELPER computes the annual balances of a compounded series with inital value and ongoing inflow */
annualValueHelper = function(start, inflow, rate, periodBegin, periodEnd, inflation){
  var i, result;

  // initialize & set initial condition
  result = [];
  result[0] = []; result[1] = []; result[2] = [];
  result[0][0] = periodBegin;                 // time
  result[1][0] = start;                       // value
  result[2][0] = start;                       // value inflation adjusted

  // iterate and compute
  for (i = 1; i <= (periodEnd - periodBegin); i++){
    result[0][i] = result[0][i-1] + 1;
    result[1][i] = result[1][i-1] * (1 + rate) + inflow;
    result[2][i] = result[1][i] / Math.pow(1+inflation,i);

  }
  return result;
};

/* PLANNING-REVERSE_ANNUAL_VALUE_HELPER computes the annual capital balances for a capital
 * stock with monthly outflows, interest and inflation for the set of years from periodBegin
 * until periodEnd and returns an array with [0] period [1] capital balances [2] capital balances
 * infl. adjusted
 */
reverseAnnualValueHelper = function(start, outflow, rate, periodBegin, periodEnd, inflation, age){
  var iterator;
  var counter = periodEnd - periodBegin -1;
  var value = start;
  var result = [];
  result[0] = []; result[1] = []; result[2] = [];

  iterator = function(){
    var i;
    while (counter >= 0){
      for (i=0; i < 12; i++){
        value = value * (1+rate/12) - outflow;
      }
      result[0].push(periodEnd - counter);
      result[1].push(value);
      result[2].push(value/Math.pow(1 + inflation,periodEnd - counter - age));
      counter--;
    }
    return value;
  };
  iterator();
  return result;
};





/* ***********************************************************************************************/
/* ************************* END PLANNING MODULE HELPERS (NOT EXPOSED) ***************************/
/* ***********************************************************************************************/