var helpers = require('./helpers');

var cumNormalHelper, cumNormalPrimeHelper;

/* ************************ BEGIN BOERSE MODULE PUBLIC FUNCTIONS *****************************/

/* BLACKSCHOLES function that computes value and other parameters of an option using black scholes
 *
 * ARGUMENTS
 *   object inputs with the following properties
 *     optiontype               string in {'Call-Option','Put-Option'} that holds the option type
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
 *   object result
 *     value                    number; BS-value of the option
 *     delta                    number; option delta
 *     gamma                    number; option gamma
 *     vega                     number; option vega
 *     theta                    number; option theta
 *     rho                      number; option rho
 *     intrinsicValue           number; intrinsic value of the option
 *     timeValue                number; time value of the option
 *
 *     On calculation error, the function will return null;
 */

exports.blackScholes = function (inputs) {

  // init and assign
  var value, delta, gamma, vega, theta, intrinsicValue, timeValue, rho, d1, d2;

  var expectedInputs = {
    optiontype: 'String',
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
  if (inputs.optiontype === 'Call-Option'){ // call
    value =  inputs.price * cumNormalHelper(d1)-inputs.strike * Math.exp(-inputs.interest * inputs.maturity) * cumNormalHelper(d2);
    delta = cumNormalHelper(d1);
    gamma = cumNormalPrimeHelper(d1) / (inputs.price*inputs.vola*Math.sqrt(inputs.maturity));
    vega = 0.01 * inputs.strike * Math.sqrt(inputs.maturity) * cumNormalPrimeHelper(d1);
    theta = (- (inputs.price * cumNormalPrimeHelper(d1) * inputs.vola/(2*Math.sqrt(inputs.maturity))) - inputs.interest * inputs.strike * Math.exp(-inputs.interest*inputs.maturity) * cumNormalHelper(d2))/365;
    rho = 0.01 * inputs.strike * inputs.maturity * Math.exp(- inputs.interest * inputs.maturity) * cumNormalHelper(d2);
    intrinsicValue = Math.max(inputs.price - inputs.strike,0);
    timeValue = value - intrinsicValue;
  } else if (inputs.optiontype === 'Put-Option') { // put
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

  return{
    value: value,
    delta: delta,
    gamma: gamma,
    vega: vega,
    theta: theta,
    rho: rho,
    intrinsicValue: intrinsicValue,
    timeValue: timeValue
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