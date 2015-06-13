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
 *   object result.main.
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
  var result = {}; result.main = {};
  var localElems = calcElems.options.outputs;

  var expectedInputs = {
    optiontype: 'Number',
    price: 'Number',
    strike: 'Number',
    interest: 'Number',
    maturity: 'Number',
    vola: 'Number'
  };

  // check validity of inputs and do number conversions
  if (!helpers.validateInputs(inputs,expectedInputs)) return null;

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
  result.main.value =          {'description': 'Theoretischer Optionspreis',  'value': value,         'unit': '€', 'tooltip': localElems.value.tooltip};
  result.main.delta =          {'description': 'Delta',                       'value': delta,         'unit': ' ', 'tooltip': localElems.delta.tooltip};
  result.main.gamma =          {'description': 'Gamma',                       'value': gamma,         'unit': ' ', 'tooltip': localElems.gamma.tooltip};
  result.main.theta =          {'description': 'Theta',                       'value': theta,         'unit': ' ', 'tooltip': localElems.theta.tooltip};
  result.main.vega =           {'description': 'Vega',                        'value': vega,          'unit': ' ', 'tooltip': localElems.vega.tooltip};
  result.main.rho =            {'description': 'Rho',                         'value': rho,           'unit': ' ', 'tooltip': localElems.rho.tooltip};
  result.main.intrinsicValue = {'description': 'Innerer Wert',                'value': intrinsicValue,'unit': '€', 'tooltip': localElems.intrinsicValue.tooltip};
  result.main.timeValue =      {'description': 'Zeitwert',                    'value': timeValue,     'unit': '€', 'tooltip': localElems.timeValue.tooltip};

  return result;

};

// query exchange rates using the fixer.io API (ECB exchange rates)
// todo: documentation
exports.fxConvert = function (inputs,callback) {

  // init and assign
  var value, returnResults;
  var localElems = calcElems.fx.outputs;
  var result = {}; result.main = {}; result.table = {};

  var expectedInputs = {
    principal: 'Number',
    from: 'String',
    to: 'String'
  };

  // check validity of inputs and do number conversions
  if (!helpers.validateInputs(inputs,expectedInputs)) return null;

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
    // main result
    result.main.value =          {'description': 'Betrag in Zielwährung',  'value': value,         'unit': inputs.to, 'tooltip': localElems.value.tooltip};
    // currency conversion table
    result.table.title = 'Umrechnungstabelle';
    result.table.header = [inputs.from, inputs.to, inputs.from, inputs.to];
    result.table.body = [];
    [1,2,3,4,5,10,15,20,25,50,100,250,500,1000].forEach(function(element, index){
      result.table.body.push([element, element*(value/inputs.principal), element, element/(value/inputs.principal)]);
    });
  callback(result);
  }

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