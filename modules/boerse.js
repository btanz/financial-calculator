var request = require('request');
var fx = require('money');
var helpers = require('./helpers');
var calcElems = require('../data/static/calcElems.json');

var cumNormalHelper, cumNormalPrimeHelper;

/* ************************ BEGIN BOERSE MODULE PUBLIC FUNCTIONS *****************************/

/* BLACKSCHOLES function that computes value and other parameters of an option using black scholes
 *
 * ARGUMENTS
 *   object inputs with the following properties
 *     optiontype               number {1 = 'Call-Option',2 = 'Put-Option'} that holds the option type
 *     price                    number containing the current price of the underlying
 *     strike                   number containing the strike price of the option
 *     interest                 number containing the current interest rate in percent
 *     maturity                 number containing the maturity of the option in days
 *     vola                     number containing the volatility of the underlying on %
 *
 * ACTIONS
 *   none
 *
 * RETURNS
 *   object result._1.
 *     value                    object, containing description, value and unit of BS-value of the option
 *     delta                    object, containing description, value and unit of option delta
 *     gamma                    object, containing description, value and unit of option gamma
 *     vega                     object, containing description, value and unit of option vega
 *     theta                    object, containing description, value and unit of option theta
 *     rho                      object, containing description, value and unit of option rho
 *     intrinsicValue           object, containing description, value and unit of intrinsic value of the option
 *     timeValue                object, containing description, value and unit of time value of the option
 *
 *     On calculation error, the function will return null;
 */
exports.blackScholes = function (inputs) {

  // init and assign
  var value, delta, gamma, vega, theta, intrinsicValue, timeValue, rho, d1, d2;
  var result = {}; result._1 = {};
  var localElems = calcElems.options.outputs;
  var expectedInputs = calcElems.options.inputs;
  var errorMap;

  // check for input errors
  errorMap = helpers.validate(inputs, expectedInputs);

  if (errorMap.length !== 0){
    return errorMap;
  }

  // do unit conversions
  inputs.interest = inputs.interest/100;
  inputs.maturity = inputs.maturity/365;
  inputs.vola = inputs.vola/100;

  // compute d1 and d2 parameters
  d1 = (Math.log(inputs.price / inputs.strike) + (inputs.interest + inputs.vola * inputs.vola / 2.0) * inputs.maturity) / (inputs.vola * Math.sqrt(inputs.maturity));
  d2 = d1 - inputs.vola * Math.sqrt(inputs.maturity);
  // return value based on PutCallFlag
  if (inputs.optiontype === 1){ // call
    value =  inputs.price * cumNormalHelper(d1)-inputs.strike * Math.exp(-inputs.interest * inputs.maturity) * cumNormalHelper(d2);
    delta = cumNormalHelper(d1);
    gamma = cumNormalPrimeHelper(d1) / (inputs.price*inputs.vola*Math.sqrt(inputs.maturity));
    vega = 0.01 * inputs.strike * Math.sqrt(inputs.maturity) * cumNormalPrimeHelper(d1);
    theta = (- (inputs.price * cumNormalPrimeHelper(d1) * inputs.vola/(2*Math.sqrt(inputs.maturity))) - inputs.interest * inputs.strike * Math.exp(-inputs.interest*inputs.maturity) * cumNormalHelper(d2))/365;
    rho = 0.01 * inputs.strike * inputs.maturity * Math.exp(- inputs.interest * inputs.maturity) * cumNormalHelper(d2);
    intrinsicValue = Math.max(inputs.price - inputs.strike,0);
    timeValue = value - intrinsicValue;
  } else if (inputs.optiontype === 2) { // put
    value = inputs.strike * Math.exp(-inputs.interest * inputs.maturity) * cumNormalHelper(-d2) - inputs.price * cumNormalHelper(-d1);
    delta = cumNormalHelper(d1) - 1;
    gamma = cumNormalPrimeHelper(d1) / (inputs.price*inputs.vola*Math.sqrt(inputs.maturity));
    vega = 0.01 * inputs.price * Math.sqrt(inputs.maturity) * cumNormalPrimeHelper(d1);
    theta = (- (inputs.price * cumNormalPrimeHelper(d1) * inputs.vola/(2*Math.sqrt(inputs.maturity))) + inputs.interest * inputs.strike * Math.exp(-inputs.interest*inputs.maturity) * cumNormalHelper(-d2))/365;
    rho = - 0.01 * inputs.strike * inputs.maturity * Math.exp(- inputs.interest * inputs.maturity) * cumNormalHelper(-d2);
    intrinsicValue = Math.max(inputs.strike-inputs.price,0);
    timeValue = value - intrinsicValue;
  } else {
    return null;
  }

  // construct result object
  result.id = calcElems.options.id;
  result._1.value =          {'description': 'Theoretischer Optionspreis',  'value': value,         'unit': '€', 'digits': 4, 'tooltip': localElems.value.tooltip};
  result._1.delta =          {'description': 'Delta',                       'value': delta,         'unit': ' ', 'digits': 4, 'tooltip': localElems.delta.tooltip};
  result._1.gamma =          {'description': 'Gamma',                       'value': gamma,         'unit': ' ', 'digits': 4, 'tooltip': localElems.gamma.tooltip};
  result._1.theta =          {'description': 'Theta',                       'value': theta,         'unit': ' ', 'digits': 4, 'tooltip': localElems.theta.tooltip};
  result._1.vega =           {'description': 'Vega',                        'value': vega,          'unit': ' ', 'digits': 4, 'tooltip': localElems.vega.tooltip};
  result._1.rho =            {'description': 'Rho',                         'value': rho,           'unit': ' ', 'digits': 4, 'tooltip': localElems.rho.tooltip};
  result._1.intrinsicValue = {'description': 'Innerer Wert',                'value': intrinsicValue,'unit': '€', 'digits': 4, 'tooltip': localElems.intrinsicValue.tooltip};
  result._1.timeValue =      {'description': 'Zeitwert',                    'value': timeValue,     'unit': '€', 'digits': 4, 'tooltip': localElems.timeValue.tooltip};

  return result;

};

// query exchange rates using the fixer.io API (ECB exchange rates)
// todo: documentation
exports.fxConvert = function (inputs,callback) {

  // init and assign
  var value, returnResults;
  var localElems = calcElems.fx.outputs;
  var result = {}; result._1 = {}; result._2 = {};
  var expectedInputs = calcElems.fx.inputs;
  var errorMap;

  // check for input errors
  errorMap = helpers.validate(inputs, expectedInputs);

  if (errorMap.length !== 0){
    callback(errorMap);
    return;
  }

  request('http://openexchangerates.org/api/latest.json?app_id=42c2d766a7314fcf83a86efc88f4b8a2', function(error,response,body){
    if (!error && response.statusCode == 200) {
      var fxData = JSON.parse(body);
      fx.rates = fxData.rates;
      fx.base = fxData.base;
      value = fx.convert(inputs.principal, {from: inputs.from, to: inputs.to});
      returnResults(value);
    } else {
      return null;
    }
  });

  returnResults = function(value){
  // construct result object
    // calc_id
    result.id = calcElems.fx.id;

    // first result container
    result._1.value =          {'description': 'Betrag in Zielwährung',  'value': value,         'unit': inputs.to, 'tooltip': localElems.value.tooltip};

    // second result container
    result._2.title = 'Umrechnungstabelle';
    result._2.header = [inputs.from, inputs.to, inputs.from, inputs.to];
    result._2.body = [];
    [1,2,3,4,5,10,15,20,25,50,100,250,500,1000].forEach(function(element, index){
      result._2.body.push([element, element*(value/inputs.principal), element, element/(value/inputs.principal)]);
    });
  callback(null, result);
  }

};



// compute return from equity investment
exports.equityReturn = function(inputs, callback) {

  // init and assign

  // validate inputs and do conversions

  console.log(inputs);

  var expectedInputs ={
    'quantity': {
      'type': 'Number',
      'args': [0,1000000000],
      'error': 'Die Menge muss größer als 0 und kleiner als 1000000000 sein.'
      },
    'buy': {
      'type': 'Number',
      'args': [0,1000000000],
      'error': 'Der Kaufpreis muss größer als 0 und kleiner als 1000000000 sein.'
    }


  };



  /*
  var expectedInputs = [
    quantity: 'Number',
    buy: 'Number',
    sell: 'Number',
    buydate: 'Date',
    selldate: 'Date',
    fees: 'Bool',
    dividends: 'Number'
  ];*/

  if (!helpers.validateInputs(inputs,expectedInputs)) return null;

};





/*
equityReturn = function(qty,buy,sell,buyDate,sellDate,buyFee, sellFee, dividends){
  var result = {}, holding, i;
  var delt = 0.0000001; // numerical deviation
  var y1,x1,x2, iter=0;
  var val;

  // check for fees and adjust buy and sell
  if (isFinite(buyFee) && isFinite(sellFee)){
    sell = sell - sellFee;
    buy = buy + buyFee;
  }

  // function to compute NPV for guess; function is 0 at the correct discount rate
  function NPV(discountRate){
    var npv = 0;
    for(var t = 0; t < dividends.length; t++) {
      npv += dividends[t][1] / Math.pow((1+ discountRate),dividends[t][2]/365);
    }
    return npv-buy;
  }

  // convert date sequence in holding time sequence
  var ONE_DAY = 1000 * 60 * 60 * 24;
  holding = (sellDate-buyDate)/ONE_DAY;

  // attach holding time to dividend array + plus check for invalid dividend dates
  for(i=0; i < dividends.length; i++){
    if (dividends[i][0] < buyDate || dividends[i][0] > sellDate){return null;}
    dividends[i].push((dividends[i][0] - buyDate)/ONE_DAY);
  }
  // attach final payment to dividend array and make it a paymens array
  dividends.push([sellDate,sell,holding]);
  /*
   console.log(dividends);
   console.log(NPV(0.03));*/

  /* derivative of NPV
  var dNPV = function(x){ return (NPV(x+delt)-NPV(x))/delt;};

  /* newtown iterations
  x1 = 0.03 // intial guess
  do{
    /*
     console.log(x1);
    y1 = NPV(x1);
    x2 = x1 - y1/dNPV(x1);
    x1 = x2;
    iter++;
    if (iter > 1000){

      return null;
    }
    if (x1<-1){
      x1 = -0.999999;
    }
    /*
     console.log(y1);*/
  /*} while(Math.abs(y1) > 0.0000000001)
  result.irr = x1;
  result.holding = holding;
  // check for fees
  /* reactivate later
   if (isFinite(buyFee) && isFinite(sellFee)){
   result.irr = (Math.pow((sell-sellFee)/(buy+buyFee),365/holding)-1)*100;
   } else {
   result.irr = (Math.pow(sell/buy,365/holding)-1)*100;
   }*/

  /*return result;

};




/* ************************ END BOERSE MODULE PUBLIC FUNCTIONS *********************************/


/* ************************ BEGIN BOERSE MODULE HELPERS (NOT EXPOSED) **************************/
/* The cummulative Normal distribution function: */
cumNormalHelper = function cumNormalHelper(x){
  var a1, a2, a3, a4 ,a5, k ;
  a1 = 0.31938153, a2 =-0.356563782, a3 = 1.781477937, a4= -1.821255978 , a5= 1.330274429;
  if(x<0.0)
    return 1-cumNormalHelper(-x);
  else
    k = 1.0 / (1.0 + 0.2316419 * x);
  return 1.0 - Math.exp(-x * x / 2.0)/ Math.sqrt(2*Math.PI) * k
      * (a1 + k * (-0.356563782 + k * (1.781477937 + k * (-1.821255978 + k * 1.330274429)))) ;
};

cumNormalPrimeHelper = function (x){
  return (1/Math.sqrt(2* Math.PI))*Math.exp(-x*x/2);
};

/* ************************ END BOERSE MODULE HELPERS (NOT EXPOSED) *****************************/